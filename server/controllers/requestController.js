const createRequest = require('./requestController/createRequest');
const getRequests = require('./requestController/getRequests');
const getMyRequests = require('./requestController/getMyRequests');
const updateRequest = require('./requestController/updateRequest');
const getRequestById = require('./requestController/getRequestById');
const warmupAi = require('./requestController/warmup');

module.exports = {
    createRequest,
    getRequests,
    getMyRequests,
    updateRequest,
    getRequestById,
    warmupAi
};
