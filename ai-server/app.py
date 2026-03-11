from flask import Flask, request, jsonify
from flask_cors import CORS
import model

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

if __name__ == '__main__':
    app.run(port=5001, debug=True)
