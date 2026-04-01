const getPublicStats = require('./statsController/getPublicStats');
const getPublicRequestStatus = require('./statsController/getPublicRequestStatus');
const getSummary = require('./statsController/getSummary');

module.exports = {
    getPublicStats,
    getPublicRequestStatus,
    getSummary
};
