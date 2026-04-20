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
    # 1. HAZARD / LIFE-SAFETY (Absolute Critical)
    if any(word in text for word in ['accident', 'fire', 'flood', 'bleeding', 'blood', 'trapped', 'dying', 'emergency', 'unconscious', 'collapsed', 'breathing', 'heart', 'injured', 'broken', 'stroke', 'seizure']):
        return "Critical"
    # 2. SURVIVAL NEEDS (High)
    if any(word in text for word in ['starving', 'starvation', 'hungry', 'food', 'water', 'shelter', 'medicine', 'fever', 'rescue', 'orphan']):
        return "High"
    # 3. BASIC SUPPLIES (Medium)
    if any(word in text for word in ['blankets', 'clothes', 'diapers', 'sanitary', 'kits', 'shoes', 'soap']):
        return "Medium"
    return "Low"

@lru_cache(maxsize=128)
def predict_priority(text):
    """
    Categorizes the situation based on hazard level and survival urgency.
    """
    if not text or len(text.strip()) < 5:
        return "Low"

    # Precise Hazard Keywords check
    manual_check = keyword_analysis(text)
    if manual_check == "Critical":
        return "Critical"

    if not HAS_MODEL:
        return manual_check

    # AI Model labels updated for better distinction
    label_map = {
        "Life-threatening emergency, high-risk hazard, accident or active natural disaster": "Critical",
        "Urgent survival necessity like severe hunger, thirst or medical sickness": "High",
        "Non-emergency need for items, supplies or temporary shelter": "Medium",
        "General inquiry, low priority information or routine check-in": "Low"
    }
    descriptive_labels = list(label_map.keys())
    
    try:
        result = classifier(text, candidate_labels=descriptive_labels)
        best_match = result['labels'][0]
        return label_map[best_match]
    except Exception as e:
        print(f"AI Prediction Error: {e}")
        return manual_check

