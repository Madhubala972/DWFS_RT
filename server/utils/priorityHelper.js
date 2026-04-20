const calculatePriority = (requestData, aiPrediction = 'Low') => {
    let score = 0;
    const reasons = [];

    // --- Base Priority from Nuanced AI Analysis ---
    let priority = aiPrediction || 'Low';
    
    const isVulnerable = requestData.vulnerability?.hasElderly || requestData.vulnerability?.hasDisabled;
    const isDisasterZone = requestData.locationRisk?.isFloodZone || requestData.locationRisk?.isDroughtArea;

    // --- Contextual Boosters (Upgrading priority based on Risk) ---
    if (priority === 'High' && (isVulnerable || isDisasterZone)) {
        priority = 'Critical'; // Survival risk + Vulnerability = Critical
    } else if (priority === 'Medium' && (isVulnerable || isDisasterZone)) {
        priority = 'High'; // Manageable issue + Vulnerability = High
    } else if (priority === 'Low' && isVulnerable) {
        priority = 'Medium'; // Non-urgent + Elderly/Disabled = Medium
    }

    // --- Final Output Mapping ---
    const results = {
        'Critical': { score: 100, explanation: `CRITICAL: ${aiPrediction === 'Critical' ? 'Immediate life/safety risk identified.' : 'High-risk situation for vulnerable/displaced member.'}` },
        'High': { score: 75, explanation: `HIGH: ${aiPrediction === 'High' ? 'Significant survival/resource deprivation.' : 'Risk elevated due to environmental factors.'}` },
        'Medium': { score: 50, explanation: `MEDIUM: ${isVulnerable ? 'Priority assistance for elderly/disabled.' : 'Resource shortage with moderate urgency.'}` },
        'Low': { score: 25, explanation: 'LOW: Routine request with no immediate safety or survival risk detected.' }
    };

    const final = results[priority] || results['Low'];
    return { 
        score: final.score, 
        priority: priority, 
        explanation: final.explanation 
    };
};

module.exports = { calculatePriority };
