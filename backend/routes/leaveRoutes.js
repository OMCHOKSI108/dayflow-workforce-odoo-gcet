const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, deleteLeave } = require('../controllers/leaveController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, applyLeave).get(protect, admin, getAllLeaves);
router.get('/my', protect, getMyLeaves);
router.route('/:id').put(protect, admin, updateLeaveStatus).delete(protect, deleteLeave);

module.exports = router;
