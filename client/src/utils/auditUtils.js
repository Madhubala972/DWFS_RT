export const filterLogs = (logs, term, type) => {
    let result = logs;
    const now = new Date();
    if (type === 'TODAY') result = result.filter(l => new Date(l.createdAt).getTime() >= new Date().setHours(0, 0, 0, 0));
    else if (type === 'WEEK') result = result.filter(l => new Date(l.createdAt).getTime() >= (now.setDate(now.getDate() - 7)));
    else if (type === 'MONTH') result = result.filter(l => new Date(l.createdAt).getTime() >= (now.setMonth(now.getMonth() - 1)));

    if (term) {
        const t = term.toLowerCase();
        result = result.filter(l => l.action.toLowerCase().includes(t) || l.details.toLowerCase().includes(t) || l.user?.name?.toLowerCase().includes(t));
    }
    return result;
};

export const getSessionLogs = (filteredLogs) => {
    const sorted = [...filteredLogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const displayItems = [];
    const paired = new Set();

    for (let i = 0; i < sorted.length; i++) {
        if (paired.has(sorted[i]._id)) continue;
        const log = sorted[i];
        if (log.action === 'LOGOUT') {
            const loginIdx = sorted.findIndex((l, idx) => idx > i && l.user?._id === log.user?._id && l.action === 'LOGIN' && !paired.has(l._id));
            if (loginIdx !== -1) {
                displayItems.push({ ...log, loginTime: sorted[loginIdx].createdAt, logoutTime: log.createdAt, action: 'SESSION' });
                paired.add(sorted[loginIdx]._id); paired.add(log._id);
            } else displayItems.push({ ...log, logoutTime: log.createdAt });
        } else displayItems.push({ ...log, actionTime: log.createdAt });
    }
    return displayItems;
};
