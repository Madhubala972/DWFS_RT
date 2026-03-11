export const AUDIT_MOCK_DATA = [
    {
        _id: 'mock1',
        createdAt: new Date().toISOString(),
        action: 'AI_PRIORITIZATION',
        user: { name: 'System AI', role: 'admin' },
        details: 'Calculated Critical priority (Score: 92) for Medical Aid request in Flood Zone.',
        ipAddress: '192.168.1.1'
    },
    {
        _id: 'mock2',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        action: 'USER_LOGIN',
        user: { name: 'Admin User', role: 'admin' },
        details: 'Admin session started successfully.',
        ipAddress: '203.0.113.42'
    },
    {
        _id: 'mock8',
        createdAt: new Date(Date.now() - 600000).toISOString(),
        action: 'LOGOUT',
        user: { name: 'Admin User', role: 'admin' },
        details: 'User logged out successfully. Active session terminated.',
        ipAddress: '203.0.113.42'
    },
    {
        _id: 'mock9',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        action: 'LOGIN',
        user: { name: 'Rahul Volunteer', role: 'volunteer' },
        details: 'Volunteer session started safely via mobile device.',
        ipAddress: '49.15.22.101'
    },
    {
        _id: 'mock10',
        createdAt: new Date(Date.now() - 5400000).toISOString(),
        action: 'LOGOUT',
        user: { name: 'Rahul Volunteer', role: 'volunteer' },
        details: 'User logged out. Volunteer session finalized.',
        ipAddress: '49.15.22.101'
    },
    {
        _id: 'mock3',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        action: 'RESOURCE_ALLOCATION',
        user: { name: 'Asha Center', role: 'ngo' },
        details: 'Allocated 500kg Rice to High-priority cluster in Zone-B.',
        ipAddress: '172.16.254.1'
    },
    {
        _id: 'mock4',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        action: 'AI_PRIORITIZATION',
        user: { name: 'Priya Sharma', role: 'user' },
        details: 'Mapped Medium priority (Score: 45) for Clothes request. No vulnerability flags detected.',
        ipAddress: 'Internal'
    },
    {
        _id: 'mock5',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        action: 'SECURITY_ALERT',
        user: { name: 'System Sentinel', role: 'admin' },
        details: 'Blocked suspicious login attempt from unrecognized region.',
        ipAddress: '45.76.12.190'
    },
    {
        _id: 'mock6',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        action: 'DATA_BACKUP',
        user: { name: 'DB Instance', role: 'admin' },
        details: 'Full socio-economic dataset backed up to encrypted storage.',
        ipAddress: 'Local'
    },
    {
        _id: 'mock7',
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        action: 'AI_RETRAINING',
        user: { name: 'ML Pipeline', role: 'admin' },
        details: 'Model Dis_V2 retrained with 5,000 new human-verified samples. Accuracy increased by 2.4%.',
        ipAddress: 'GPU_Node_01'
    }
];
