import random

def predict_priority(text):
    """
    Predicts priority based on keywords in the text.
    In a real scenario, this would use a trained ML model (e.g., TF-IDF + Naive Bayes or BERT).
    """
    text = text.lower()
    
    critical_keywords = ['urgent', 'emergency', 'life-threatening', 'medical', 'blood', 'rescue']
    high_keywords = ['food', 'starving', 'water', 'shelter', 'trapped']
    medium_keywords = ['clothes', 'blankets', 'medicines', 'funds']
    
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
