const calculatePriority = (requestData, aiPrediction = 'Low') => {
    let score = 0;
    const reasons = [];

    // 1. AI Content Analysis (Emergency Sentiment from ML Model)
    const aiServiceWeights = {
        'Critical': 55,
        'High': 40,
        'Medium': 20,
        'Low': 5
    };
    const aiScore = aiServiceWeights[aiPrediction] || 5;
    score += aiScore;
    reasons.push(`AI Analysis (${aiPrediction}): +${aiScore}`);

    // 2. Resource Type Necessity (Direct Impact on Priority)
    const emergencyTypes = {
        'Medical': 60,   // Immediate health risk
        'Food': 35,      // Survival necessity
        'Essentials': 20, // Hygiene/Safety
        'Funds': 10,     // Logistics
        'Clothes': 5,    // Comfort
        'Other': 2
    };
    const typeScore = emergencyTypes[requestData.type] || 0;
    score += typeScore;
    reasons.push(`Aid Type (${requestData.type}): +${typeScore}`);

    // 3. Vulnerability (Household)
    if (requestData.vulnerability?.hasElderly) {
        score += 10;
        reasons.push('Elderly present: +10');
    }
    if (requestData.vulnerability?.hasDisabled) {
        score += 15;
        reasons.push('Disability present: +15');
    }
    const famBonus = Math.min((requestData.vulnerability?.familySize || 0) * 2, 10);
    if (famBonus > 0) {
        score += famBonus;
        reasons.push(`Household size (${requestData.vulnerability?.familySize}): +${famBonus}`);
    }

    // 4. Environmental Risk
    if (requestData.locationRisk?.isFloodZone) {
        score += 25;
        reasons.push('Flood Zone: +25');
    }
    if (requestData.locationRisk?.isDroughtArea) {
        score += 15;
        reasons.push('Drought Zone: +15');
    }

    // Final Mapping
    let priority = 'Low';
    if (score >= 71) priority = 'Critical';
    else if (score >= 50) priority = 'High';
    else if (score >= 25) priority = 'Medium';

    return { score, priority, explanation: reasons.join(' | ') };
};

module.exports = { calculatePriority };
