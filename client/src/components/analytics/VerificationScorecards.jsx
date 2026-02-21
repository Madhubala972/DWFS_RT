import React from 'react';

const VerificationScorecards = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-3xl">⏳</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Under Review</h3>
                <p className="text-sm text-gray-500 mb-4 uppercase font-semibold">Pending Verification</p>
                <span className="text-4xl font-bold text-blue-600">
                    {stats.byStatus?.['Pending'] || 0}
                </span>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-3xl">🛡️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Verified</h3>
                <p className="text-sm text-gray-500 mb-4 uppercase font-semibold">Authenticity Checked</p>
                <span className="text-4xl font-bold text-green-600">
                    {(['Approved', 'Assigned', 'InProgress', 'Collected', 'Delivered']
                        .reduce((sum, status) => sum + (stats.byStatus?.[status] || 0), 0))}
                </span>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-3xl">❌</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Rejected</h3>
                <p className="text-sm text-gray-500 mb-4 uppercase font-semibold">Invalid/Fraud Cases</p>
                <span className="text-4xl font-bold text-red-600">
                    {stats.byStatus?.['Rejected'] || 0}
                </span>
            </div>
        </div>
    );
};

export default VerificationScorecards;
