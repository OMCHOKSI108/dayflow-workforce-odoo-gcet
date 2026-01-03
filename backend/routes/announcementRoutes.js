const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createAnnouncement)
    .get(protect, getAnnouncements);

router.route('/:id')
    .put(protect, admin, updateAnnouncement)
    .delete(protect, admin, deleteAnnouncement);

module.exports = router;
