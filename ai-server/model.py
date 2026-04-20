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
    
    # --- CRITICAL (Life-Threatening / Total Loss) ---
    critical_words = [
        'starvation', 'not eaten for days', 'eviction', 'immediate danger',
        'heavy bleeding', 'unconscious', 'no safe place to stay', 'completely homeless',
        'lost in disaster', 'total loss', 'immediate emergency'
    ]
    if any(word in text for word in critical_words):
        return "Critical"

    # --- HIGH (Survival Risk / Displacement) ---
    high_words = [
        'no food', 'skipped meals', 'cannot pay rent', 'essential bills',
        'serious injury', 'one set of clothing', 'staying outside', 'temporary camp',
        'urgent help', 'rescue needed'
    ]
    if any(word in text for word in high_words):
        return "High"

    # --- MEDIUM (Manageable but Urgent) ---
    medium_words = [
        '1-2 days', 'income loss', 'basic needs manageable', 'fever',
        'moderate injury', 'damage', 'not safe long term', 'arranging transport'
    ]
    if any(word in text for word in medium_words):
        return "Medium"

    return "Low"

@lru_cache(maxsize=128)
def predict_priority(text):
    """
    Nuanced categorization based on the specific condition thresholds:
    Critical: Starvation, Eviction, Life-threatening, Total homelessness
    High: No food/skipped meals, Bills/Rent debt, Serious injury, Displacement
    Medium: Limited resources (1-2 days), Manageable illness, Damaged shelter
    Low: Minor issues, general info, or additional help requests
    """
    if not text or len(text.strip()) < 5:
        return "Low"

    # Nuanced Manual Keyword Pass
    manual_check = keyword_analysis(text)
    if manual_check != "Low":
        return manual_check

    if not HAS_MODEL:
        return manual_check

    # Labels updated with the specific examples from the user
    label_map = {
        "Starvation risk, immediate eviction, life-threatening injury or total homelessness": "Critical",
        "No food today, cannot pay essential bills, serious injury or staying in camps": "High",
        "Limited food (1-2 days), income loss but manageable, fever or safe temporary shelter": "Medium",
        "General inquiry, minor issues like headaches or needs additional non-urgent items": "Low"
    }
    descriptive_labels = list(label_map.keys())
    
    try:
        result = classifier(text, candidate_labels=descriptive_labels)
        best_match = result['labels'][0]
        return label_map[best_match]
    except Exception as e:
        print(f"AI Prediction Error: {e}")
        return manual_check

