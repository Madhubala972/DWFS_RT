const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequests,
    getMyRequests,
    updateRequest,
    getRequestById
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createRequest)
    .get(protect, authorize('admin', 'ngo', 'volunteer'), getRequests);

router.route('/my').get(protect, getMyRequests);

router.route('/:id')
    .get(protect, getRequestById)
    .put(protect, authorize('admin', 'ngo', 'volunteer'), updateRequest);

module.exports = router;
