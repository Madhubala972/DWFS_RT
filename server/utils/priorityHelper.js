const calculatePriority = (requestData, aiPrediction = 'Low') => {
    let score = 0;
    const reasons = [];

    // --- 1. ABSOLUTE CRITICAL (Life-Safety & Hazard) ---
    const isVulnerable = requestData.vulnerability?.hasElderly || requestData.vulnerability?.hasDisabled;
    const isDisasterZone = requestData.locationRisk?.isFloodZone || requestData.locationRisk?.isDroughtArea;

    if (aiPrediction === 'Critical' || requestData.type === 'Medical' || (requestData.type === 'Food' && (isVulnerable || isDisasterZone))) {
        return { 
            score: 100, 
            priority: 'Critical', 
            explanation: `IMMEDIATE ACTION REQUIRED: ${aiPrediction === 'Critical' ? 'Critical hazard detected.' : requestData.type === 'Medical' ? 'Medical assistance requested.' : 'Food shortage in high-risk/vulnerable situation.'}` 
        };
    }

    // --- 2. HIGH PRIORITY (Urgent Survival Needs) ---
    if (requestData.type === 'Food' || aiPrediction === 'High') {
        return { 
            score: 75, 
            priority: 'High', 
            explanation: 'URGENT RESOURCE NEED: Necessary supplies for survival and nutrition identified.' 
        };
    }

    // --- 3. MEDIUM PRIORITY (Vulnerability & Basic Needs) ---
    if (['Essentials', 'Funds'].includes(requestData.type) || isVulnerable || aiPrediction === 'High' || aiPrediction === 'Medium') {
        return { 
            score: 50, 
            priority: 'Medium', 
            explanation: 'PRIORITY SUPPORT: Request involving vulnerable individuals or essential household supplies.' 
        };
    }

    // --- 4. LOW PRIORITY (Routine Distributions) ---
    return { 
        score: 25, 
        priority: 'Low', 
        explanation: 'NORMAL LOGISTICS: Standard request for distribution items.' 
    };
};

module.exports = { calculatePriority };
