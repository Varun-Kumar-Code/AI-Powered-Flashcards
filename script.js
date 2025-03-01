const API_KEY = "AIzaSyAspvZWTE2MUKrjEXzUHchmJXc1vtws_6A";  // Replace with your actual Gemini API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent?key=${API_KEY}`;

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    const flashcardsContainer = document.querySelector(".flashcards-container");
    const templateSelect = document.getElementById("template-select");

    generateBtn.addEventListener("click", async () => {
        const userInput = document.getElementById("user-input").value.trim();
        if (!userInput) {
            alert("Please enter a topic.");
            return;
        }

        generateBtn.innerText = "Generating...";
        generateBtn.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: `You are a flashcard generator. Create exactly 5 flashcards about "${userInput}". Format them strictly as follows:\n\n
                                Flashcard 1:\nQ: [QUESTION 1]\nA: [ANSWER 1]\n\n
                                Flashcard 2:\nQ: [QUESTION 2]\nA: [ANSWER 2]\n\n
                                Flashcard 3:\nQ: [QUESTION 3]\nA: [ANSWER 3]\n\n
                                Flashcard 4:\nQ: [QUESTION 4]\nA: [ANSWER 4]\n\n
                                Flashcard 5:\nQ: [QUESTION 5]\nA: [ANSWER 5]\n\n
                                Only return flashcards in this format. Do NOT add explanations or extra text.` }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();
            console.log("API Response:", JSON.stringify(data, null, 2));

            generateBtn.innerText = "Generate Flashcards";
            generateBtn.disabled = false;

            if (data.error) {
                alert("Google Gemini API Error: " + data.error.message);
            } else if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                displayFlashcards(data.candidates[0].content.parts[0].text);
            } else {
                alert("No flashcards generated. Try again!");
            }
        } catch (error) {
            console.error("API Error:", error);
            alert("Error fetching flashcards. Please check the console.");
            generateBtn.innerText = "Generate Flashcards";
            generateBtn.disabled = false;
        }
    });

    templateSelect.addEventListener("change", () => {
        const selectedTemplate = templateSelect.value;
        applyTemplate(selectedTemplate);
    });

    function displayFlashcards(flashcardText) {
        flashcardsContainer.innerHTML = "";

        const flashcards = flashcardText
            .split(/Flashcard \d+:/)
            .map(card => card.trim())
            .filter(card => card.includes("Q:") && card.includes("A:"));

        if (flashcards.length === 0) {
            alert("No valid flashcards detected. Try again!");
            return;
        }

        flashcards.forEach((card, index) => {
            const flashcard = document.createElement("div");
            flashcard.className = "flashcard animate__animated animate__fadeIn";
            flashcard.innerHTML = `<strong>Flashcard ${index + 1}:</strong><br>${card}`;
            flashcardsContainer.appendChild(flashcard);
        });

        applyTemplate(templateSelect.value);
    }

    function applyTemplate(template) {
        const flashcards = document.querySelectorAll(".flashcard");
        flashcards.forEach(flashcard => {
            flashcard.className = "flashcard animate__animated animate__fadeIn";
            flashcard.classList.add(template);
        });
    }
    // Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const htmlElement = document.documentElement;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-theme", savedTheme);
themeIcon.textContent = savedTheme === "dark" ? "🌙" : "☀️";

themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    htmlElement.setAttribute("data-theme", newTheme);
    themeIcon.textContent = newTheme === "dark" ? "🌙" : "☀️";
    localStorage.setItem("theme", newTheme);
});
});