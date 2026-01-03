const express = require('express');
const router = express.Router();
const { authUser, registerUser, createEmployee, getUsers, getUserProfile, updateUserProfile, getUserById, updateUser, deleteUser, getDashboardStats
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.route('/').post(registerUser).get(protect, admin, getUsers); // Admin can get all users
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/create').post(protect, admin, createEmployee); // Admin create employee
router.get('/dashboard/stats', protect, getDashboardStats); // New Dashboard Route
router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

module.exports = router;
