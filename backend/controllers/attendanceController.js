const Attendance = require('../models/Attendance');

// @desc Check in
// @route POST /api/attendance/checkin
const checkIn = async (req, res) => {
    // Check if user already has an OPEN session (checked in but not checked out)
    const openSession = await Attendance.findOne({ user: req.user._id, checkOut: null });

    if (openSession) {
        return res.status(400).json({ message: 'You are already checked in.' });
    }

    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.create({
        user: req.user._id,
        date: today,
        checkIn: new Date(),
        status: 'Present'
    });

    res.status(201).json(attendance);
};

// @desc Check out
// @route POST /api/attendance/checkout
const checkOut = async (req, res) => {
    // Find the latest open session
    const attendance = await Attendance.findOne({ user: req.user._id, checkOut: null }).sort({ createdAt: -1 });

    if (!attendance) {
        return res.status(400).json({ message: 'You are not checked in.' });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.json(attendance);
};

// @desc Get my attendance
// @route GET /api/attendance/my
const getMyAttendance = async (req, res) => {
    const attendance = await Attendance.find({ user: req.user._id });
    res.json(attendance);
};

// @desc Get all attendance (Admin)
// @route GET /api/attendance
const getAllAttendance = async (req, res) => {
    const adminUser = await require('../models/User').findById(req.user._id);
    const companyUsers = await require('../models/User').find({ companyName: adminUser.companyName }).select('_id');
    const userIds = companyUsers.map(u => u._id);
    
    const attendance = await Attendance.find({ user: { $in: userIds } }).populate('user', 'name email');
    res.json(attendance);
};

// @desc Update attendance record (Admin)
// @route PUT /api/attendance/:id
const updateAttendance = async (req, res) => {
    const attendance = await Attendance.findById(req.params.id).populate('user');
    if (!attendance) {
        return res.status(404).json({ message: 'Attendance not found' });
    }
    
    // Verify attendance belongs to admin's company
    const adminUser = await require('../models/User').findById(req.user._id);
    if (attendance.user.companyName !== adminUser.companyName) {
        return res.status(403).json({ message: 'Not authorized to update this attendance' });
    }
    
    attendance.checkIn = req.body.checkIn || attendance.checkIn;
    attendance.checkOut = req.body.checkOut || attendance.checkOut;
    attendance.status = req.body.status || attendance.status;
    
    const updated = await attendance.save();
    res.json(updated);
};

// @desc Delete attendance record (Admin)
// @route DELETE /api/attendance/:id
const deleteAttendance = async (req, res) => {
    const attendance = await Attendance.findById(req.params.id).populate('user');
    if (!attendance) {
        return res.status(404).json({ message: 'Attendance not found' });
    }
    
    // Verify attendance belongs to admin's company
    const adminUser = await require('../models/User').findById(req.user._id);
    if (attendance.user.companyName !== adminUser.companyName) {
        return res.status(403).json({ message: 'Not authorized to delete this attendance' });
    }
    
    await attendance.deleteOne();
    res.json({ message: 'Attendance record deleted' });
};

module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance, updateAttendance, deleteAttendance };
