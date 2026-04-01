const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequests,
    getMyRequests,
    updateRequest,
    getRequestById,
    warmupAi
} = require('../controllers/requestController');
const {
    getPublicStats,
    getPublicRequestStatus,
    getSummary
} = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', getPublicStats);
router.get('/summary', getSummary);
router.get('/track/:id', getPublicRequestStatus);
router.get('/warmup', protect, warmupAi);

router.route('/')
    .post(protect, createRequest)
    .get(protect, authorize('admin', 'ngo', 'volunteer'), getRequests);

router.route('/my').get(protect, getMyRequests);

router.route('/:id')
    .get(protect, getRequestById)
    .put(protect, authorize('admin', 'ngo', 'volunteer'), updateRequest);

module.exports = router;
