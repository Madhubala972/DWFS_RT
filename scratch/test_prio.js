const { calculatePriority } = require('../server/utils/priorityHelper');

const test = () => {
    const data = {
        type: 'Medical',
        vulnerability: { hasElderly: false, hasDisabled: false },
        locationRisk: { isFloodZone: false, isDroughtArea: false }
    };
    
    console.log("Test with 'Pending':", calculatePriority(data, 'Pending'));
    console.log("Test with 'Critical':", calculatePriority(data, 'Critical'));
    console.log("Test with 'Low':", calculatePriority(data, 'Low'));
};

test();
