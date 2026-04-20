from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_priority
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'AI Service is running'})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    description = data.get('description', '')
    
    if not description:
        return jsonify({'error': 'No description provided'}), 400
    
    priority = model.predict_priority(description)
    return jsonify({'priority': priority})

import os

if __name__ == '__main__':
    # Use environment PORT or default to 5001 (standard for Flask in dev)
    # Hugging Face Spaces usually requires port 7860
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port)
