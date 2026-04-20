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
    
    # --- CRITICAL (Immediate Life/Death/Total Loss) ---
    if any(word in text for word in [
        'starvation', 'eaten for days', 'not eaten', 'bleeding', 'unconscious', 
        'eviction', 'evicted', 'homeless', 'no safety', 'disaster victim', 
        'immediate emergency', 'dying', 'cannot breathe', 'total loss', 'on fire'
    ]):
        return "Critical"

    # --- HIGH (Survival Urgency / Serious Risk) ---
    if any(word in text for word in [
        'no food', 'skipped meals', 'emergency shelter', 'cannot pay rent', 
        'essential bills', 'serious injury', 'one set clothing', 'temporary camp', 
        'urgent help', 'starving'
    ]):
        return "High"

    # --- MEDIUM (Manageable Stress / Basic Need) ---
    if any(word in text for word in [
        'income loss', 'moderate injury', 'fever', 'safe shelter', 
        'temporary stay', 'need help', 'damage', 'repair', '1-2 days'
    ]):
        return "Medium"

    return "Low"

@lru_cache(maxsize=128)
def predict_priority(text):
    """
    Robust situational classifier using detailed semantic contrast.
    Focuses on the severity of the human condition (Safety/Hunger/Shelter).
    """
    if not text or len(text.strip()) < 5:
        return "Low"

    # Check for direct emergency keywords first
    manual_check = keyword_analysis(text)
    if manual_check == "Critical":
        return "Critical"

    if not HAS_MODEL:
        return manual_check

    # Precise labels derived from user matrix for minimal ambiguity
    label_map = {
        "Immediate starvation, life-threatening injury, total homelessness, or urgent eviction": "Critical",
        "Direct survival risk like no food today, displacement in camps, or unable to pay essential survival bills": "High",
        "Non-emergency resource shortage with 1-2 days buffer, fever, or manageable repair needs": "Medium",
        "General inquiry, minor issues like headache, or request for additional non-urgent assistance": "Low"
    }
    descriptive_labels = list(label_map.keys())
    
    try:
        # We use a very low multi-label threshold to ensure distinct categorization
        result = classifier(text, candidate_labels=descriptive_labels)
        best_match = result['labels'][0]
        return label_map[best_match]
    except Exception as e:
        print(f"AI Robustness Error: {e}")
        return manual_check

