import google.generativeai as genai
import requests
import random
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# ✅ Eden AI Image Generation API
EDEN_API_URL = "https://api.edenai.run/v2/image/generation"
EDEN_API_KEY =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNGM1MmM4MmMtYzAyOS00MThkLTg5MTgtMGUyMDk5MDEyYTc3IiwidHlwZSI6ImZyb250X2FwaV90b2tlbiJ9.sru_urC5dZsgIsbRWgFkIiQipXxMnnNgPwuIre-p-vY"




# ✅ Gemini AI Text Generation API
GEMINI_API_KEY = "AIzaSyB0rnBHGHwsU0vONH_JlLMgTVedjWGPHXU"
genai.configure(api_key=GEMINI_API_KEY)

@app.route('/')
def index():
    return render_template('codevolt.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Generates images and text points based on the prompt."""
    print("[INFO] Received request to generate images & text.")  

    user_prompt = request.form.get('prompt', '')
    num_items = int(request.form.get('num_items', 1))  # Number of images & text points

    if not user_prompt:
        return jsonify({"error": "No prompt provided."}), 400

    headers = {"Authorization": f"Bearer {EDEN_API_KEY}"}
    images = []

    # ✅ Generate Images Sequentially
    for i in range(num_items):
        modified_prompt = f"{user_prompt} variation {random.randint(1, 1000)}"  # Hidden variation
        payload = {
            "providers": "replicate",
            "text": modified_prompt,
            "resolution": "512x512"
        }
        response = requests.post(EDEN_API_URL, json=payload, headers=headers)

        if response.status_code == 200:
            result = response.json()
            image_url = result["replicate"]["items"][0]["image_resource_url"]
            images.append(image_url)
        else:
            images.append(None)  # Placeholder for failed images

    # ✅ Generate Text Points
    ai_prompt = f"Provide {num_items} key points (without introduction) in response to:\n{user_prompt}"
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(ai_prompt)

        if response.text:
            points = response.text.split("\n")
            filtered_points = [p.strip("-• ") for p in points if p.strip() and "key points" not in p.lower()]
            while len(filtered_points) < num_items:
                filtered_points.append("No response available")
        else:
            filtered_points = ["No response available"] * num_items

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # ✅ Combine Image & Text
    combined_data = [{"image": img, "point": filtered_points[i]} for i, img in enumerate(images)]

    return jsonify({"status": "success", "results": combined_data})

if __name__ == '__main__':
    print("[INFO] Starting Flask server...")
    app.run(debug=True)
