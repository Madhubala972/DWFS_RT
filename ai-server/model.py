from functools import lru_cache
from transformers import pipeline

print("Loading Fast NLP Model... (Optimized for speed)")
# MiniLM is significantly faster than DistilBART on CPU while maintaining good accuracy for zero-shot tasks
classifier = pipeline("zero-shot-classification", model="cross-encoder/nli-MiniLM-L6-v2")

@lru_cache(maxsize=128)
def predict_priority(text):
    """
    Predicts priority using a pre-trained zero-shot NLP model.
    Cached for faster repeated queries.
    """
    if not text or len(text.strip()) < 5:
        return "Low"

    # Use descriptive labels to help the model understand the nuances
    label_map = {
        "Immediate Life-Threatening rescue or medical emergency": "Critical",
        "Urgent requirement for food or shelter": "High",
        "Need for clothing, blankets or basic supplies": "Medium",
        "General inquiry or low priority information": "Low"
    }
    descriptive_labels = list(label_map.keys())
    
    try:
        # The AI dynamically scores the text against the 4 labels
        result = classifier(text, candidate_labels=descriptive_labels)
        
        # Get the top descriptive label and map it back to the original priority levels
        best_match = result['labels'][0]
        predicted_label = label_map[best_match]
        
        return predicted_label
        
    except Exception as e:
        print(f"AI Prediction Error: {e}")
        # Absolute worst-case fallback
        return 'Low'
