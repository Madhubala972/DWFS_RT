import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import os

def generate_synthetic_data():
    data = [
        # Critical
        ("I am trapped in my house due to a massive flood.", "Critical"),
        ("Need immediate medical attention, someone is bleeding severely.", "Critical"),
        ("The building collapsed and people are stuck under debris.", "Critical"),
        ("Emergency rescue needed, water level is rising fast.", "Critical"),
        ("Gas leak in the neighborhood, we can't breathe.", "Critical"),
        ("Someone is having a heart attack, send help now.", "Critical"),
        ("Major fire in the slum area, houses are burning.", "Critical"),
        ("We are stuck on the roof, please rescue us.", "Critical"),
        
        # High
        ("We haven't had any food for three days, children are starving.", "High"),
        ("Need clean drinking water urgently, town well is contaminated.", "High"),
        ("Our roof was blown away by the storm, we need shelter.", "High"),
        ("Baby needs milk and diapers, we have nothing left.", "High"),
        ("Elderly people here need their daily survival medication.", "High"),
        ("The earthquake destroyed our store, we have no food supply.", "High"),
        ("Displaced families need immediate grain and pulse supply.", "High"),
        
        # Medium
        ("Requesting warm clothes and blankets for the winter season.", "Medium"),
        ("We need basic first aid kits and bandages.", "Medium"),
        ("Need financial assistance to repair the broken wall.", "Medium"),
        ("Asking for hygiene kits for women in the camp.", "Medium"),
        ("Requirement for cooking utensils as we lost everything.", "Medium"),
        ("Need a set of school books for the kids after the flood.", "Medium"),
        
        # Low
        ("How can I register as a volunteer for relief work?", "Low"),
        ("Looking for information on the next aid distribution.", "Low"),
        ("I want to donate some old furniture to the needy.", "Low"),
        ("Is there a meeting regarding disaster management today?", "Low"),
        ("Providing general feedback on the distribution process.", "Low"),
        ("Just Checking the status of the local government center.", "Low"),
    ]
    
    # Duplicate data to have a larger set for 'training'
    expanded_data = data * 20
    return pd.DataFrame(expanded_data, columns=['text', 'label'])

def train():
    print("Generating synthetic training data...")
    df = generate_synthetic_data()
    
    print("Building and training the AI model pipeline...")
    # TF-IDF + Logistic Regression is robust for small text datasets
    model = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1, 2))),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    
    model.fit(df['text'], df['label'])
    
    print("Saving the trained model to 'disaster_model.pkl'...")
    joblib.dump(model, 'disaster_model.pkl')
    print("Training complete!")

if __name__ == "__main__":
    train()
