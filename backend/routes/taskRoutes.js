const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    createTask,
    getAllTasks,
    getMyTasks,
    getTaskById,
    updateTask,
    deleteTask,
    addComment
} = require('../controllers/taskController');

// Task CRUD routes
router.route('/')
    .get(protect, getAllTasks)
    .post(protect, adminOnly, createTask);

router.get('/my', protect, getMyTasks);

router.route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, adminOnly, deleteTask);

router.post('/:id/comment', protect, addComment);

module.exports = router;
