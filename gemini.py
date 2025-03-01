import google.generativeai as genai
import os


API_KEY = "AIzaSyAswhW3f-puzeBT6Gq5v4jbM6d4YwjStJs"
genai.configure(api_key=API_KEY)



# Use the correct model
model = genai.GenerativeModel("gemini-1.5-pro-latest")


user_topic = os.environ.get('USER_TOPIC', 'General Knowledge')

# Dynamic Prompt for Any Topic
prompt = f"""
Generate 8 flashcards on the topic: {user_topic}.
Each flashcard should follow this format:
Question: <Short question>
Answer: <Concise and descriptive answer within 10 words>

Ensure answers are short (1-2 sentences) and informative.
"""

# Get Response from Gemini API
response = model.generate_content(prompt)

# Save Response to output.txt
with open("output.txt", "w", encoding="utf-8") as file:
    file.write(response.text)

print(f"✅ Flashcards on '{user_topic}' saved to output.txt")
print(response.text)
