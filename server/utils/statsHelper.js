const formatDuration = (ms) => {
    if (ms < 0) return '0m'; // Safety for bad data
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return 'Less than 1m';
};

const getTimelineDates = (now, stepCount, stepType) => {
    const dates = [];
    const istOffset = 5.5 * 60 * 60 * 1000;
    
    for (let i = 0; i < stepCount; i++) {
        const d = new Date(now.getTime());
        if (stepType === 'hour') { d.setHours(d.getHours() - i); }
        else if (stepType === 'month') { d.setMonth(d.getMonth() - i); d.setDate(1); }
        else { d.setDate(d.getDate() - i); }

        const istDate = new Date(d.getTime() + istOffset);
        const yyyy = istDate.getUTCFullYear();
        const mm = String(istDate.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(istDate.getUTCDate()).padStart(2, '0');
        const hh = String(istDate.getUTCHours()).padStart(2, '0');

        if (stepType === 'hour') {
            dates.push(`${yyyy}-${mm}-${dd} ${hh}:00`);
        } else if (stepType === 'month') {
            dates.push(`${yyyy}-${mm}`);
        } else {
            dates.push(`${yyyy}-${mm}-${dd}`);
        }
    }
    return dates.sort();
};

module.exports = { formatDuration, getTimelineDates };
