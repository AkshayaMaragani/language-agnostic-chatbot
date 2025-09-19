# Transitalk 🤖

**"Talk to Hyderabad — culture, travel, and environment in your own tongue."**

Transitalk is a language-agnostic, location-aware AI assistant built for the "Smart Cities & Tourism" theme of the HiBuddy Hackathon. It's designed to break down language barriers and provide inclusive access to information for tourists and residents in Hyderabad.

## The Problem

In a diverse, multilingual city like Hyderabad, language is often a barrier to accessing crucial information about tourism, city services, and the environment. Tourists who don't speak the local languages can feel lost, and residents may struggle to access digital services.

## Our Solution

Transitalk is a web-based chatbot that allows users to ask questions in their native language (supporting Telugu, Hindi, and English) using either text or voice. Our backend, powered by Google's Gemini and Translation APIs, provides context-aware answers that are translated back into the user's original language.

## Key Features ✨

* **Multilingual Support**: Switch between Telugu, Hindi, and English on the fly.
* **Speech-to-Text**: An integrated microphone allows for hands-free, voice-based queries, perfect for accessibility.
* **Location-Aware**: The chatbot uses the user's GPS location to provide more relevant, context-aware answers (e.g., "nearby" suggestions).
* **Smart AI Backend**: Utilizes Google's Gemini Pro for intelligent responses and the Cloud Translation API for seamless communication.
* **Sleek, Mobile-First UI**: A clean, modern, and responsive interface built with HTML, CSS, and JavaScript.

## Tech Stack 🛠️

* **Frontend**: HTML, CSS, JavaScript (with Web Speech & Geolocation APIs)
* **Backend**: Python, Flask, Flask-Cors
* **Cloud Services**: Google Cloud Vertex AI (Gemini Pro), Google Cloud Translation API

## How to Run This Project

1.  Clone the repository.
2.  Create and activate a Python virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # or .\venv\Scripts\activate
    ```
3.  Install the required libraries:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file and add your `GOOGLE_API_KEY="your_key"`.
5.  Run the Flask backend server:
    ```bash
    python app.py
    ```
6.  Open the `index.html` file in your web browser.

---
*Built for the Google Developer Day 2025 Hackathon.*