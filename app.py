import os
from flask import Flask, request, jsonify
from flask_cors import CORS

import vertexai
from vertexai.generative_models import GenerativeModel

# --- CONFIGURATION ---
from dotenv import load_dotenv
load_dotenv()

PROJECT_ID = "amazing-plateau-472615-v4"
LOCATION = "us-central1"

# --- INITIALIZE ---
app = Flask(__name__)
CORS(app)
vertexai.init(project=PROJECT_ID, location=LOCATION)
model = GenerativeModel("gemini-1.0-pro")


# --- API ROUTE ---
@app.route("/chat", methods=["POST"])
def chat():
    """
    This is the safe, English-only version.
    It receives the user's message and location, but ignores translation.
    """
    try:
        data = request.get_json()
        user_message = data["message"]
        lat = data.get("lat")
        lon = data.get("lon")

        # --- TRANSLATION IS SKIPPED ---
        # We assume the input is English for the safe demo
        message_in_english = user_message
        
        # Create a context-aware prompt for Gemini
        prompt = "You are a friendly and helpful tourist assistant for Hyderabad, India."
        if lat and lon:
            prompt += f" The user is currently at latitude {lat} and longitude {lon}."
        prompt += f" Answer the following question concisely: \"{message_in_english}\""
        
        response = model.generate_content(prompt)
        response_in_english = response.text

        # --- TRANSLATION BACK IS SKIPPED ---
        final_response = response_in_english

        return jsonify({"reply": final_response})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "Sorry, something went wrong."}), 500

@app.route("/")
def home():
    return "Chatbot server is active and ready to receive requests."

if __name__ == "__main__":
    app.run(debug=True)