const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Task = require('../models/Task');
const Announcement = require('../models/Announcement');

// @desc    Get all companies (SuperAdmin only)
// @route   GET /api/superadmin/companies
// @access  Private (SuperAdmin)
const getAllCompanies = async (req, res) => {
    try {
        // Get unique company names
        const companies = await User.aggregate([
            {
                $match: { companyName: { $exists: true, $ne: null } }
            },
            {
                $group: {
                    _id: '$companyName',
                    adminCount: {
                        $sum: { $cond: [{ $eq: ['$role', 'Admin'] }, 1, 0] }
                    },
                    hrCount: {
                        $sum: { $cond: [{ $eq: ['$role', 'HR'] }, 1, 0] }
                    },
                    employeeCount: {
                        $sum: { $cond: [{ $eq: ['$role', 'Employee'] }, 1, 0] }
                    },
                    totalUsers: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    companyName: '$_id',
                    adminCount: 1,
                    hrCount: 1,
                    employeeCount: 1,
                    totalUsers: 1
                }
            },
            {
                $sort: { companyName: 1 }
            }
        ]);

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all admins across all companies (SuperAdmin only)
// @route   GET /api/superadmin/admins
// @access  Private (SuperAdmin)
const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ 
            role: { $in: ['Admin', 'HR'] } 
        })
        .select('-password')
        .sort({ companyName: 1, role: 1 });

        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get company details by name (SuperAdmin only)
// @route   GET /api/superadmin/companies/:companyName
// @access  Private (SuperAdmin)
const getCompanyDetails = async (req, res) => {
    try {
        const { companyName } = req.params;

        // Get all users
        const users = await User.find({ companyName })
            .select('-password')
            .sort({ role: 1, name: 1 });

        if (users.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Get attendance stats
        const attendanceCount = await Attendance.countDocuments({ 
            user: { $in: users.map(u => u._id) }
        });

        // Get leave stats
        const leaveStats = await Leave.aggregate([
            {
                $match: { 
                    user: { $in: users.map(u => u._id) }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get task stats
        const taskStats = await Task.aggregate([
            {
                $match: { companyName }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get announcements
        const announcementCount = await Announcement.countDocuments({ 
            companyName,
            isActive: true 
        });

        res.status(200).json({
            companyName,
            users,
            stats: {
                totalUsers: users.length,
                attendanceRecords: attendanceCount,
                leaves: leaveStats.reduce((acc, curr) => {
                    acc[curr._id.toLowerCase()] = curr.count;
                    return acc;
                }, {}),
                tasks: taskStats.reduce((acc, curr) => {
                    acc[curr._id.toLowerCase().replace(' ', '')] = curr.count;
                    return acc;
                }, {}),
                activeAnnouncements: announcementCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get global system statistics (SuperAdmin only)
// @route   GET /api/superadmin/stats
// @access  Private (SuperAdmin)
const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'SuperAdmin' } });
        const totalCompanies = await User.distinct('companyName').then(arr => arr.length);
        const totalAdmins = await User.countDocuments({ role: 'Admin' });
        const totalEmployees = await User.countDocuments({ role: 'Employee' });
        const totalAttendance = await Attendance.countDocuments();
        const totalLeaves = await Leave.countDocuments();
        const totalTasks = await Task.countDocuments();
        const totalAnnouncements = await Announcement.countDocuments({ isActive: true });

        // Recent activity across all companies
        const recentUsers = await User.find({ role: { $ne: 'SuperAdmin' } })
            .select('name email companyName role createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            overview: {
                totalCompanies,
                totalUsers,
                totalAdmins,
                totalEmployees,
                totalAttendance,
                totalLeaves,
                totalTasks,
                totalAnnouncements
            },
            recentUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete company and all its data (SuperAdmin only - DANGEROUS)
// @route   DELETE /api/superadmin/companies/:companyName
// @access  Private (SuperAdmin)
const deleteCompany = async (req, res) => {
    try {
        const { companyName } = req.params;

        // Get all user IDs from this company
        const users = await User.find({ companyName });
        if (users.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const userIds = users.map(u => u._id);

        // Delete all related data
        await User.deleteMany({ companyName });
        await Attendance.deleteMany({ user: { $in: userIds } });
        await Leave.deleteMany({ user: { $in: userIds } });
        await Task.deleteMany({ companyName });
        await Announcement.deleteMany({ companyName });

        res.status(200).json({ 
            message: `Company "${companyName}" and all associated data deleted successfully`,
            deletedUsers: users.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user across companies (SuperAdmin only)
// @route   PUT /api/superadmin/users/:id
// @access  Private (SuperAdmin)
const updateAnyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // SuperAdmin can change anything including roles
        const allowedUpdates = [
            'name', 'email', 'role', 'companyName', 'designation', 
            'department', 'phone', 'salary', 'dateOfJoining'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyName: user.companyName
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllCompanies,
    getAllAdmins,
    getCompanyDetails,
    getSystemStats,
    deleteCompany,
    updateAnyUser
};
