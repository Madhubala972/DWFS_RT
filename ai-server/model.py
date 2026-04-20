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
    
    # --- CRITICAL (Immediate Life/Death/Total Loss/Medical Emergency) ---
    if any(word in text for word in [
        'starvation', 'eaten for days', 'not eaten', 'bleeding', 'unconscious', 
        'eviction', 'evicted', 'homeless', 'no safety', 'disaster victim', 
        'immediate emergency', 'medical emergency', 'dying', 'cannot breathe', 
        'total loss', 'on fire', 'heart attack', 'accident', 'no shelter'
    ]):
        return "Critical"

    # --- HIGH (Survival Urgency / Serious Risk) ---
    if any(word in text for word in [
        'no food', 'skipped meals', 'emergency shelter', 'cannot pay rent', 
        'essential bills', 'serious injury', 'one set clothing', 'temporary camp', 
        'urgent help', 'starving', 'severe pain', 'dehydration'
    ]):
        return "High"

    # --- MEDIUM (Manageable Stress / Basic Need) ---
    if any(word in text for word in [
        'income loss', 'moderate injury', 'fever', 'safe shelter', 
        'temporary stay', 'need help', 'damage', 'repair', '1-2 days', 
        'medicine', 'blankets', 'clothes'
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

    # 1. Keyword analysis provides a reliable "floor" or direct hit
    manual_check = keyword_analysis(text)
    
    # Critical keywords always override AI for safety
    if manual_check == "Critical":
        return "Critical"

    if not HAS_MODEL:
        return manual_check

    # 2. Precise labels for AI classification
    label_map = {
        "Immediate life-threatening medical emergency or starvation": "Critical",
        "Direct survival risk like no food today or total displacement": "High",
        "Non-emergency resource shortage with 1-2 days buffer": "Medium",
        "General inquiry or minor non-urgent assistance": "Low"
    }
    descriptive_labels = list(label_map.keys())
    
    try:
        # Use semantic classification
        result = classifier(text, candidate_labels=descriptive_labels)
        ai_label = label_map[result['labels'][0]]
        ai_score = result['scores'][0]
        
        # Priority mapping for comparison
        rank = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}
        
        # If AI is confident (score > 0.4), take the highest of manual vs AI
        if ai_score > 0.4:
            return ai_label if rank[ai_label] > rank[manual_check] else manual_check
        
        return manual_check
    except Exception as e:
        print(f"AI Robustness Error: {e}")
        return manual_check



