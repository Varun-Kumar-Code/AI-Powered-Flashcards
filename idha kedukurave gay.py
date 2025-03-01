from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import requests
import os

app = Flask(__name__)

# Configure the Gemini API key
GEMINI_API_KEY = 'AIzaSyB0rnBHGHwsU0vONH_JlLMgTVedjWGPHXU'  # Replace with your actual API key
genai.configure(api_key=GEMINI_API_KEY)

# Configure the Stability AI API key
STABILITY_API_KEY = 'sk-Tt2DTspB91CdEAu3MVRTLpR7OTmRuIkTNm0tAkkU36VD7AH7'  # Replace with your actual Stability AI API key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    prompt = request.form['prompt']
    
    # Generate text using Gemini API
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    generated_text = response.text
    
    # Generate image using Stability AI API
    response = requests.post(
        "https://api.stability.ai/v2beta/stable-image/generate/ultra",
        headers={
            "authorization": f"Bearer {STABILITY_API_KEY}",
            "accept": "image/*"
        },
        files={"none": ''},
        data={
            "prompt": prompt,
            "output_format": "webp",
        },
    )
    
    if response.status_code == 200:
        # Ensure the static directory exists
        os.makedirs('./static', exist_ok=True)
        
        image_path = f"./static/{prompt.replace(' ', '_')}.webp"
        with open(image_path, 'wb') as file:
            file.write(response.content)
        generated_image_url = image_path
    else:
        generated_image_url = 'https://via.placeholder.com/600x400?text=Image+not+available'
    
    return render_template('result.html', prompt=prompt, text=generated_text, image_url=generated_image_url)

if __name__ == '__main__':
    app.run(debug=True)
