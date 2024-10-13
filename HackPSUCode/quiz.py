from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os
import pypdf

app = Flask(__name__)
load_dotenv()
OpenAI.api_key = os.getenv("OPENAI_API_KEY")

UPLOAD_FOLDER = 'uploads/'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if file is in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    # If no file is selected
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    extracted_text = extract_text_from_pdf(file_path)

    quiz = generate_quiz(extracted_text, "Easy, general and definitions", 5)

    return quiz

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as pdf_file:
        reader = pypdf.PdfReader(pdf_file)
        # Extract text from each page
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
    return text

client = OpenAI()
def generate_quiz(content, difficulty, num_questions):
    prompt = f"Generate a quiz with {num_questions}, with {difficulty} difficulty and based on the content on: {content}"
    # Call the ChatCompletion API
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000,
    )

    quiz = response.choices[0].message.content
    return quiz


if __name__ == "__main__":
    app.run(debug=True)
