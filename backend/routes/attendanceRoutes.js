const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getMyAttendance, getAllAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my', protect, getMyAttendance);
router.get('/', protect, admin, getAllAttendance);
router.route('/:id').put(protect, admin, updateAttendance).delete(protect, admin, deleteAttendance);

module.exports = router;
