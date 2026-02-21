const calculatePriority = (requestData, aiPrediction = 'Low') => {
    let score = 0;
    const reasons = [];

    // 1. AI Content Analysis (Emergency Sentiment from ML Model)
    const aiServiceWeights = {
        'Critical': 45,
        'High': 35,
        'Medium': 20,
        'Low': 5
    };
    const aiScore = aiServiceWeights[aiPrediction] || 5;
    score += aiScore;
    reasons.push(`AI Analysis (${aiPrediction}): +${aiScore}`);

    // 2. Resource Type Necessity
    const emergencyTypes = {
        'Medical': 15,
        'Food': 12,
        'Essentials': 8,
        'Funds': 5,
        'Clothes': 3,
        'Other': 2
    };
    const typeScore = emergencyTypes[requestData.type] || 0;
    score += typeScore;
    reasons.push(`Aid Type (${requestData.type}): +${typeScore}`);

    // 3. Vulnerability (Socio-economic)
    if (requestData.incomeLevel < 10000) {
        score += 20;
        reasons.push('Extreme Poverty: +20');
    } else if (requestData.incomeLevel < 30000) {
        score += 10;
        reasons.push('Vulnerable Income: +10');
    }

    if (requestData.vulnerability?.hasElderly) {
        score += 10;
        reasons.push('Elderly present: +10');
    }
    if (requestData.vulnerability?.hasDisabled) {
        score += 15;
        reasons.push('Disability present: +15');
    }
    const famBonus = Math.min(requestData.vulnerability?.familySize * 2, 10);
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
    if (score >= 80) priority = 'Critical';
    else if (score >= 55) priority = 'High';
    else if (score >= 30) priority = 'Medium';

    return { score, priority, explanation: reasons.join(' | ') };
};

module.exports = { calculatePriority };
