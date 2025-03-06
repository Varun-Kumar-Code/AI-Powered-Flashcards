// WARNING: DO NOT DEPLOY THIS CODE WITH EXPOSED API KEYS.
// THIS IS FOR DEVELOPMENT PURPOSES ONLY.
// API KEYS SHOULD NEVER BE EXPOSED IN CLIENT-SIDE CODE IN A PRODUCTION ENVIRONMENT.

const GEMINI_API_KEY = "AIzaSyB0rnBHGHwsU0vONH_JlLMgTVedjWGPHXU"; // Replace with your actual development API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const analyzeButton = document.getElementById("analyzeButton");
    const resultsDiv = document.getElementById("results");
    const errorMessageDiv = document.getElementById("error-message");

    analyzeButton.addEventListener("click", () => {
        const file = fileInput.files[0];
        if (!file) {
            errorMessageDiv.textContent = "Please select a CSV file.";
            return;
        }
        errorMessageDiv.textContent = "";
        resultsDiv.innerHTML = "";//clear previous results.

        const reader = new FileReader();
        reader.onload = async (event) => { // Make onload async
            const csvData = event.target.result;
            const parsedData = parseCSV(csvData);
            if (parsedData.error) {
                errorMessageDiv.textContent = parsedData.error;
                return;
            }
            try{
                const insights = await analyzeDataWithGemini(parsedData);
                displayResults(insights);
            } catch (error){
                errorMessageDiv.textContent = "Error communicating with Gemini API.";
                console.error("Gemini API Error:", error);
            }

        };
        reader.onerror = () => {
            errorMessageDiv.textContent = "Error reading file.";
        };
        reader.readAsText(file);
    });

    function parseCSV(csvText) {
        const lines = csvText.split("\n");
        if (lines.length <= 1) return { error: "The CSV file is empty or has only headers." };
        const headers = lines[0].toLowerCase().split(",").map(header => header.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(value => value.trim());
            if (values.length === headers.length) {
                const row = {};
                for (let j = 0; j < headers.length; j++) {
                    let header = headers[j];
                    if (header === 'avg_speed_0_60_mph') header = "avg_speed";
                    if (header === 'payload_weight_pounds') header = "payload_weight";
                    if (header === 'battery_temperature_c') header = "battery_temperature";
                    if (header === 'auxiliary_energy_loss_percent') header = "auxillary_energy_usage";
                    if (header === 'battery_health_percent') header = "battery_health";
                    if (header === 'regenerative_braking_efficiency_percent') header = "regen_brakes";
                    row[header] = isNaN(parseFloat(values[j])) ? values[j] : parseFloat(values[j]);
                }
                data.push(row);
            }
        }
        if (data.length === 0) return { error: "No valid data rows found in CSV." };

        try {
            const insights = {
                avg_speed: data.reduce((acc, row) => acc + row.avg_speed, 0) / data.length,
                battery_health: data.reduce((acc, row) => acc + row.battery_health, 0) / data.length,
                payload_weight: data.reduce((acc, row) => acc + row.payload_weight, 0) / data.length,
                battery_temp: data.reduce((acc, row) => acc + row.battery_temperature, 0) / data.length,
                aux_energy: data.reduce((acc, row) => acc + row.auxillary_energy_usage, 0) / data.length,
                regen_brakes: data.reduce((acc, row) => acc + row.regen_brakes, 0) / data.length,
            };
            return insights;
        } catch (e) {
            return { error: "Error processing CSV data. Please check the format." };
        }
    }

    async function analyzeDataWithGemini(insights) {
        const prompt = `
            Analyze the following EV data and compare it with industry standards:
            - Average Speed: ${insights.avg_speed} km/h
            - Battery Health: ${insights.battery_health}%
            - Payload Weight: ${insights.payload_weight} kg
            - Battery Temperature: ${insights.battery_temp} °C
            - Auxiliary Energy Usage: ${insights.aux_energy} kWh
            - Regenerative Braking Efficiency: ${insights.regen_brakes}%

            Provide a **brief summary (max 50 words)** of how these values compare to industry standards. 
            Keep it small yet informative(such that it covers the vital aspects of the data).
            and doesnt make the user feel overwhelmed with information and also that it is easy to understand. 
            and small in length
        `;

        try {
            const response = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const ai_response = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const formattedResponse = ai_response ? ai_response + `\n\n(Character count: ${ai_response.length})` : "";
            return { ...insights, ai_analysis: formattedResponse };

        } catch (error) {
            console.error("Gemini API Error:", error);
            throw error;
        }
    }

    function displayResults(insights) {
        let resultsHTML = "<div class='result-box'><h3>Analysis Results</h3>";
        resultsHTML += `<p><strong>Average Speed:</strong> ${insights.avg_speed.toFixed(2)} km/h</p>`;
        resultsHTML += `<p><strong>Battery Health:</strong> ${insights.battery_health.toFixed(2)}%</p>`;
        resultsHTML += `<p><strong>Payload Weight:</strong> ${insights.payload_weight.toFixed(2)} kg</p>`;
        resultsHTML += `<p><strong>Battery Temperature:</strong> ${insights.battery_temp.toFixed(2)} °C</p>`;
        resultsHTML += `<p><strong>Auxiliary Energy Usage:</strong> ${insights.aux_energy.toFixed(2)} kWh</p>`;
        resultsHTML += `<p><strong>Regenerative Braking Efficiency:</strong> ${insights.regen_brakes.toFixed(2)}%</p></div>`;
        resultsHTML += "<div class='result-box'><h3>AI Analysis</h3>";
        resultsHTML += `<p>${insights.ai_analysis}</p></div>`;

        resultsDiv.innerHTML = resultsHTML;
        document.querySelector(".box").style.width = "900px";
    }
});