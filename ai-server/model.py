import os
from transformers import pipeline

print("Loading Zero-Shot Classifier Model... (This takes a moment on startup)")
# Using the DistilBART version as it is much faster and lighter than the large BART
classifier = pipeline("zero-shot-classification", model="valhalla/distilbart-mnli-12-3")

def predict_priority(text):
    """
    Predicts priority using a pre-trained zero-shot NLP model.
    """
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
