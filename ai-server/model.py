import re
from functools import lru_cache
from transformers import pipeline

print("Loading Fast NLP Model... (Optimized for speed)")
try:
    # Use a well-known model name
    classifier = pipeline("zero-shot-classification", model="valhalla/distilbart-mnli-12-3")
    HAS_MODEL = True
except Exception as e:
    print(f"Failed to load NLP model: {e}. Falling back to Keyword Analysis.")
    HAS_MODEL = False

def keyword_analysis(text):
    text = text.lower()
    if any(word in text for word in ['emergency', 'critical', 'dying', 'accident', 'medical', 'hospital', 'bleeding', 'breath']):
        return "Critical"
    if any(word in text for word in ['starving', 'hungry', 'food', 'water', 'thirsty', 'shelter', 'homeless']):
        return "High"
    if any(word in text for word in ['blanket', 'clothes', 'supplies', 'medicine', 'fever', 'cold', 'diaper']):
        return "Medium"
    return "Low"

@lru_cache(maxsize=128)
def predict_priority(text):
    """
    Predicts priority using NLP model or keyword fallback.
    """
    if not text or len(text.strip()) < 5:
        return "Low"

    if not HAS_MODEL:
        return keyword_analysis(text)

    label_map = {
        "Immediate Life-Threatening rescue or medical emergency": "Critical",
        "Urgent requirement for food or shelter": "High",
        "Need for clothing, blankets or basic supplies": "Medium",
        "General inquiry or low priority information": "Low"
    }
    descriptive_labels = list(label_map.keys())
    
    try:
        result = classifier(text, candidate_labels=descriptive_labels)
        best_match = result['labels'][0]
        return label_map[best_match]
        
    except Exception as e:
        print(f"AI Prediction Error: {e}")
        return keyword_analysis(text)

