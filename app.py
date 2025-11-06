import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

load_dotenv()
app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("❌ Please set your OPENAI_API_KEY in .env file!")

client = OpenAI(api_key=OPENAI_API_KEY)

@app.route('/summary', methods=['POST'])
def generate_summary():
    data = request.json
    name = data.get('name', 'Candidate')
    skills = data.get('skills', '')
    experience = data.get('experience', '')

    if not skills or not experience:
        return jsonify({"summary": "Please provide skills and experience."})

    prompt = f"""
    You are an expert resume writer. Create a short, strong professional summary (3-4 sentences)
    written in first person.

    Name: {name}
    Skills: {skills}
    Experience: {experience}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You write excellent resume summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        summary_text = response.choices[0].message.content.strip()
        return jsonify({"summary": summary_text})

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": "Server error generating summary."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
from flask import request, jsonify
from openai import OpenAI
import os

# Make sure you already have CORS enabled and client initialized:
# from flask_cors import CORS
# CORS(app)
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/summary', methods=['POST'])
def generate_summary():
    data = request.json
    name = data.get('name', 'Candidate')
    skills = data.get('skills', '')
    experience = data.get('experience', '')

    prompt = f"""
You are an expert resume writer. Create a short, strong professional summary (3-4 sentences)
written in first person.

Name: {name}
Skills: {skills}
Experience: {experience}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You write excellent resume summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        summary_text = response.choices[0].message.content.strip()
        return jsonify({"summary": summary_text})
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Server error generating summary."}), 500
