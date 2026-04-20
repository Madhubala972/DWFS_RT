import os
import google.generativeai as genai
from dotenv import load_dotenv
from functools import lru_cache

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-flash-latest')
        HAS_GEMINI = True
        print("Google Gemini AI Integrated Successfully!")
    except Exception as e:
        print(f"Gemini Config Error: {e}")
        HAS_GEMINI = False
else:
    HAS_GEMINI = False
    print("Warning: GEMINI_API_KEY not found. Falling back to keyword analysis.")

def keyword_analysis(text):
    text = text.lower()
    # Fast manual checks for survival risks (Fallback)
    if any(word in text for word in ['starvation', 'unconscious', 'bleeding', 'eviction', 'homeless', 'critical', 'dying']):
        return "Critical"
    if any(word in text for word in ['food', 'water', 'shelter', 'trapped']):
        return "High"
    return "Medium"

@lru_cache(maxsize=128)
def predict_priority(text):
    """
    Leverages Google Gemini LLM for nuanced situational understanding.
    Strictly follows the platform's priority matrix.
    """
    if not text or len(text.strip()) < 5:
        return "Low"

    if not HAS_GEMINI:
        return keyword_analysis(text)

    # Detailed System Prompt based on user matrix
    prompt = f"""
    You are a disaster welfare priority analyzer. Categorize the following request into one of these levels: Critical, High, Medium, or Low.
    
    Use these STRICT rules based on our Priority Matrix:
    1. FOOD: Critical if starvation risk (not eaten for days). High if no food today. Medium if 1-2 days left. 
    2. MEDICAL: Critical if life-threatening (bleeding, unconscious). High if serious injury. Medium if fever or moderate injury.
    3. SHELTER: Critical if completely homeless/total loss. High if staying in camps/outside.
    4. FINANCIAL: Critical if immediate eviction. High if cannot pay essential bills.
    5. OTHERS: Critical if immediate danger/emergency. High if urgent help for vulnerable person.

    Request Description: "{text}"

    Return ONLY the category word (Critical, High, Medium, or Low). Do NOT provide any explanation.
    """

    try:
        response = model.generate_content(prompt)
        result = response.text.strip().capitalize()
        
        valid_priorities = ["Critical", "High", "Medium", "Low"]
        for p in valid_priorities:
            if p in result:
                return p
        return "Low"
    except Exception as e:
        print(f"Gemini Prediction Error: {e}")
        return keyword_analysis(text)
