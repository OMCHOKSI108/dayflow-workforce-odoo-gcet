const Announcement = require('../models/Announcement');
const User = require('../models/User');

// @desc Create announcement (Admin only)
// @route POST /api/announcements
const createAnnouncement = async (req, res) => {
    try {
        const { title, message, type, expiresAt } = req.body;
        
        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }
        
        const user = await User.findById(req.user._id);
        
        const announcement = await Announcement.create({
            title,
            message,
            type: type || 'info',
            companyName: user.companyName,
            createdBy: req.user._id,
            expiresAt: expiresAt || null
        });
        
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Error creating announcement', error: error.message });
    }
};

// @desc Get all announcements for company
// @route GET /api/announcements
const getAnnouncements = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        const announcements = await Announcement.find({
            companyName: user.companyName,
            isActive: true,
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        }).sort({ createdAt: -1 }).populate('createdBy', 'name');
        
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
};

// @desc Update announcement (Admin only)
// @route PUT /api/announcements/:id
const updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        
        const user = await User.findById(req.user._id);
        if (announcement.companyName !== user.companyName) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        announcement.title = req.body.title || announcement.title;
        announcement.message = req.body.message || announcement.message;
        announcement.type = req.body.type || announcement.type;
        announcement.isActive = req.body.isActive !== undefined ? req.body.isActive : announcement.isActive;
        
        const updated = await announcement.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating announcement' });
    }
};

// @desc Delete announcement (Admin only)
// @route DELETE /api/announcements/:id
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        
        const user = await User.findById(req.user._id);
        if (announcement.companyName !== user.companyName) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await announcement.deleteOne();
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting announcement' });
    }
};

module.exports = { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement };
