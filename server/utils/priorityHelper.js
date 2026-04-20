const calculatePriority = (requestData, aiPrediction = 'Low') => {
    let score = 0;
    const reasons = [];

    // --- 1. ABSOLUTE CRITICAL (Hazard / Accident / Disaster Short-circuit) ---
    // If AI detects a life-safety hazard, it is Critical. No other points matter.
    if (aiPrediction === 'Critical') {
        return { 
            score: 100, 
            priority: 'Critical', 
            explanation: 'SITUATIONAL HAZARD DETECTED: Life-threatening emergency or accident identified by AI analysis.' 
        };
    }

    // --- 2. HIGH PRIORITY (Survival Resource Needs) ---
    // If resource is Medical or Food, it is at least High.
    if (['Medical', 'Food'].includes(requestData.type)) {
        return { 
            score: 70, 
            priority: 'High', 
            explanation: 'SURVIVAL RESOURCE NEED: Immediate requirement for healthcare or nutrition.' 
        };
    }

    // --- 3. MEDIUM PRIORITY (Vulnerability & Basic Needs) ---
    // If resource is Essentials/Funds OR there are vulnerable groups.
    const isVulnerable = requestData.vulnerability?.hasElderly || requestData.vulnerability?.hasDisabled;
    if (['Essentials', 'Funds'].includes(requestData.type) || isVulnerable || aiPrediction === 'High') {
        return { 
            score: 45, 
            priority: 'Medium', 
            explanation: 'VULNERABILITY/SUPPLY NEED: Request involves vulnerable dependents or essential logistics.' 
        };
    }

    // --- 4. LOW PRIORITY (Standard Distributions) ---
    return { 
        score: 15, 
        priority: 'Low', 
        explanation: 'NORMAL PRIORITY: Standard request for non-urgent supplies or information.' 
    };
};

module.exports = { calculatePriority };
