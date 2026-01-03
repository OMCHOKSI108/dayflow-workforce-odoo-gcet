const Leave = require('../models/Leave');

// @desc Apply for leave
// @route POST /api/leaves
const applyLeave = async (req, res) => {
    const { type, startDate, endDate, reason } = req.body;
    const leave = await Leave.create({
        user: req.user._id,
        type,
        startDate,
        endDate,
        reason
    });
    res.status(201).json(leave);
};

// @desc Get my leaves
// @route GET /api/leaves/my
const getMyLeaves = async (req, res) => {
    const leaves = await Leave.find({ user: req.user._id });
    res.json(leaves);
};

// @desc Get all leaves (Admin)
// @route GET /api/leaves
const getAllLeaves = async (req, res) => {
    const adminUser = await require('../models/User').findById(req.user._id);
    const companyUsers = await require('../models/User').find({ companyName: adminUser.companyName }).select('_id');
    const userIds = companyUsers.map(u => u._id);
    
    const leaves = await Leave.find({ user: { $in: userIds } }).populate('user', 'name email');
    res.json(leaves);
};

// @desc Update leave status
// @route PUT /api/leaves/:id
const updateLeaveStatus = async (req, res) => {
    const leave = await Leave.findById(req.params.id).populate('user');
    if (!leave) {
        return res.status(404).json({ message: 'Leave not found' });
    }
    
    // Verify leave belongs to admin's company
    const adminUser = await require('../models/User').findById(req.user._id);
    if (leave.user.companyName !== adminUser.companyName) {
        return res.status(403).json({ message: 'Not authorized to update this leave' });
    }
    
    leave.status = req.body.status;
    const updatedLeave = await leave.save();
    res.json(updatedLeave);
};

// @desc Delete leave request
// @route DELETE /api/leaves/:id
const deleteLeave = async (req, res) => {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
        return res.status(404).json({ message: 'Leave not found' });
    }
    
    // Users can only delete their own pending leaves
    if (leave.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this leave' });
    }
    
    if (leave.status !== 'Pending') {
        return res.status(400).json({ message: 'Cannot delete approved/rejected leaves' });
    }
    
    await leave.deleteOne();
    res.json({ message: 'Leave request deleted' });
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, deleteLeave };
