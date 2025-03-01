import google.generativeai as genai
from flask import Flask, render_template, request, jsonify

# Flask app setup
app = Flask(__name__)

# Configure Gemini API Key (Replace with your actual API key)
api_key = "AIzaSyB0rnBHGHwsU0vONH_JlLMgTVedjWGPHXU"
genai.configure(api_key=api_key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def get_answer():
    """Generate AI-generated answers based on user input and return summaries."""
    print("[INFO] Received request to generate an answer.")

    # Get user prompt
    user_prompt = request.form.get('prompt', '')

    if not user_prompt:
        print("[ERROR] No prompt provided.")
        return jsonify({"error": "No prompt provided."}), 400

    print(f"[INFO] User Prompt: {user_prompt}")

    prompt = f"Answer the following question concisely in three different ways:\n\n{user_prompt}"

    try:
        print("[INFO] Sending request to Gemini API...")
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        if response.text:
            print("[SUCCESS] Response received.")

            # Splitting the response into three summaries
            summaries = response.text.split("\n\n")[:3]  # Taking first 3 meaningful responses
            while len(summaries) < 3:  # Ensure we always have 3 summaries
                summaries.append("No response available.")

            return jsonify({"summaries": summaries})
        else:
            print("[ERROR] No response from Gemini API.")
            return jsonify({"error": "No response from AI."}), 500
    except Exception as e:
        print(f"[ERROR] API Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("[INFO] Starting Flask server...")
    app.run(debug=True)
