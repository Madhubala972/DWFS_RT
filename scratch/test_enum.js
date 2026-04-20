const { calculatePriority } = require('./server/utils/priorityHelper');
const Request = require('./server/models/Request');
const mongoose = require('mongoose');

async function test() {
    const data = {
        type: 'Medical',
        vulnerability: {},
        locationRisk: {}
    };
    
    const { score, priority, explanation } = calculatePriority(data, 'Low');
    console.log('Calculated priority:', priority);
    
    // Check if priority is one of the enum values
    const enumValues = Request.schema.path('priority').enumValues;
    console.log('Enum values:', enumValues);
    
    if (enumValues.includes(priority)) {
        console.log('SUCCESS: Priority is valid.');
    } else {
        console.error('ERROR: Priority is INVALID!');
    }
}

test();
