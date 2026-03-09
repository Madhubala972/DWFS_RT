import random
import os
import joblib

# Load the trained ML model if it exists
model_path = os.path.join(os.path.dirname(__file__), 'disaster_model.pkl')
ml_model = None
if os.path.exists(model_path):
    try:
        ml_model = joblib.load(model_path)
        print("ML model loaded successfully.")
    except Exception as e:
        print(f"Error loading ML model: {e}")

def predict_priority(text):
    """
    Predicts priority based on an ML model with keyword fallback.
    """
    if ml_model:
        try:
            return ml_model.predict([text])[0]
        except:
            pass
            
    # Fallback keyword logic
    text = text.lower()
    critical_keywords = ['urgent', 'emergency', 'life-threatening', 'medical', 'blood', 'rescue', 'trapped', 'flood', 'collapsed']
    high_keywords = ['food', 'starving', 'water', 'shelter', 'starvation', 'drinking']
    medium_keywords = ['clothes', 'blankets', 'medicines', 'funds', 'first aid', 'repair']
    
    for word in critical_keywords:
        if word in text:
            return 'Critical'
            
    for word in high_keywords:
        if word in text:
            return 'High'
            
    for word in medium_keywords:
        if word in text:
            return 'Medium'
            
    return 'Low'
