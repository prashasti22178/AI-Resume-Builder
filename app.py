import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

# ---------------- Flask App Setup ----------------
app = Flask(__name__)
CORS(app)  # Allow frontend → backend requests

# ---------------- OpenAI Client ----------------
# Use environment variable for safety
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("❌ Please set your OPENAI_API_KEY as an environment variable!")

client = OpenAI(api_key=OPENAI_API_KEY)

# ---------------- Generate AI Summary ----------------
@app.route('/summary', methods=['POST'])
def generate_summary():
    data = request.json
    name = data.get('name', 'Candidate')
    skills = data.get('skills', '')
    experience = data.get('experience', '')

    if not skills and not experience:
        return jsonify({"summary": "Please provide skills and experience."}), 200

    prompt = f"""
    You are an expert resume writer. Create a short, strong professional summary (3-4 sentences)
    written in first person.

    Name: {name}
    Skills: {skills}
    Experience: {experience}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",   # Or gpt-4.1 if you have access
            messages=[
                {"role": "system", "content": "You write excellent resume summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )

        summary_text = response.choices[0].message.content.strip()
        return jsonify({"summary": summary_text}), 200

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": "Server error generating summary."}), 500

# ---------------- Run App ----------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
