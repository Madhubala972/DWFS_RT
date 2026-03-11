import React from 'react';

const LogTable = ({ displayLogs }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp (Login/Action)</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp (Logout)</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Activity Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {displayLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-xs text-gray-600 font-mono">
                                <div className="flex flex-col">
                                    {log.loginTime ? new Date(log.loginTime).toLocaleString() : new Date(log.actionTime).toLocaleString()}
                                    <span className={`mt-1 font-bold ${log.action === 'SESSION' ? 'text-blue-600' : 'text-gray-400'}`}>
                                        ({log.action})
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-600 font-mono">
                                {log.logoutTime ? new Date(log.logoutTime).toLocaleString() : '—'}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-800">{log.user?.name || 'System'}</span>
                                    <span className="text-[10px] text-gray-400 uppercase font-black">{log.user?.role}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {log.details}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LogTable;
