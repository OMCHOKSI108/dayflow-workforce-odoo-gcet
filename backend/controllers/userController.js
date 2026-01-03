const User = require('../models/User');
const generateToken = (id) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper: Generate Employee Code
// Format: [CO (Company Initials)][NAM (Name Initials)][Year][Serial] -> OIJODO20220001
const generateEmpCode = async (companyName, name) => {
    // Company Initials: Get first char of first 2 words, or first 2 chars of single word
    const companyParts = (companyName || 'Dayflow').trim().split(' ');
    let companyPrefix = '';
    if (companyParts.length >= 2) {
        companyPrefix = (companyParts[0][0] + companyParts[1][0]).toUpperCase();
    } else {
        companyPrefix = (companyName || 'Dayflow').substring(0, 2).toUpperCase();
    }

    // Name Initials: First 2 chars of First Name + First 2 chars of Last Name
    const nameParts = name.trim().split(' ');
    let namePrefix = '';
    if (nameParts.length >= 2) {
        namePrefix = (nameParts[0].substring(0, 2) + nameParts[nameParts.length - 1].substring(0, 2)).toUpperCase();
    } else {
        namePrefix = name.substring(0, 4).toUpperCase().padEnd(4, 'X');
    }

    const year = new Date().getFullYear();

    // Pattern config
    const prefix = `${companyPrefix}${namePrefix}${year}`;

    // Find last employee code matching this pattern to increment
    const lastUser = await User.findOne({ empCode: { $regex: `^${prefix}` } }).sort({ createdAt: -1 });

    let serial = 1;
    if (lastUser && lastUser.empCode) {
        const lastSerialStr = lastUser.empCode.replace(prefix, '');
        const lastSerial = parseInt(lastSerialStr);
        if (!isNaN(lastSerial)) serial = lastSerial + 1;
    }

    const serialStr = serial.toString().padStart(4, '0');
    return `${prefix}${serialStr}`;
};

// @desc Auth user & get token
// @route POST /api/users/login
const authUser = async (req, res) => {
    const { email, password } = req.body;
    // Allow login with Email OR EmpCode
    const user = await User.findOne({
        $or: [{ email: email }, { empCode: email }]
    });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            empCode: user.empCode,
            role: user.role,
            image: user.image,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc Register a new Organization/Admin
// @route POST /api/users
const registerUser = async (req, res) => {
    const { name, email, password, companyName, phone } = req.body;
    
    // Validation
    if (!name || !email || !password || !companyName) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Password validation - minimum 6 characters
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Name validation - minimum 2 characters
    if (name.trim().length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    
    // Company name validation
    if (companyName.trim().length < 2) {
        return res.status(400).json({ message: 'Company name must be at least 2 characters' });
    }
    
    // Phone validation if provided
    if (phone && phone.length < 10) {
        return res.status(400).json({ message: 'Phone number must be at least 10 digits' });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        companyName: companyName.trim(),
        phone: phone || '',
        role: 'Admin', // First user is Admin
        empCode: await generateEmpCode(companyName.trim(), name.trim())
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            empCode: user.empCode,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc Create a new Employee (Admin Only)
// @route POST /api/users/create
const createEmployee = async (req, res) => {
    const { name, email, department, designation, salary, dateOfJoining } = req.body;

    // Auto-generate password (can be changed later)
    const autoPassword = Math.random().toString(36).slice(-8);

    const adminUser = await User.findById(req.user._id);
    const companyName = adminUser.companyName || 'Dayflow';

    const empCode = await generateEmpCode(companyName, name);

    try {
        const user = await User.create({
            name,
            email,
            password: autoPassword,
            empCode,
            role: 'Employee',
            companyName,
            department,
            designation,
            dateOfJoining: dateOfJoining || new Date(),
            salary: { monthly: salary || 0, yearly: (salary || 0) * 12 }
        });

        res.status(201).json({
            user,
            tempPassword: autoPassword, // Return this so Admin can share it
            message: 'Employee created successfully'
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating employee', error: error.message });
    }
};

// @desc Get all users
// @route GET /api/users
const getUsers = async (req, res) => {
    const adminUser = await User.findById(req.user._id);
    const users = await User.find({ companyName: adminUser.companyName });
    res.json(users);
};

// @desc Get user profile
// @route GET /api/users/profile
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc Update user profile
// @route PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.residingAddress = req.body.residingAddress || user.residingAddress;
        user.gender = req.body.gender || user.gender;
        user.maritalStatus = req.body.maritalStatus || user.maritalStatus;
        user.personalEmail = req.body.personalEmail || user.personalEmail;
        user.image = req.body.image || user.image;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            image: updatedUser.image,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc Get user by ID (Admin)
// @route GET /api/users/:id
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify user belongs to admin's company
    const adminUser = await User.findById(req.user._id);
    if (user.companyName !== adminUser.companyName) {
        return res.status(403).json({ message: 'Not authorized to view this user' });
    }
    
    res.json(user);
};

// @desc Update user (Admin)
// @route PUT /api/users/:id
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify user belongs to admin's company
    const adminUser = await User.findById(req.user._id);
    if (user.companyName !== adminUser.companyName) {
        return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    // Prevent role escalation - only original admin can change roles
    if (req.body.role && req.body.role !== user.role) {
        if (adminUser.role !== 'Admin' || req.user._id.toString() === user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to change roles' });
        }
    }
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.department = req.body.department || user.department;
    user.designation = req.body.designation || user.designation;
    user.address = req.body.address || user.address;
    user.residingAddress = req.body.residingAddress || user.residingAddress;
    user.gender = req.body.gender || user.gender;
    user.nationality = req.body.nationality || user.nationality;
    user.personalEmail = req.body.personalEmail || user.personalEmail;
    user.maritalStatus = req.body.maritalStatus || user.maritalStatus;
    user.dateOfJoining = req.body.dateOfJoining || user.dateOfJoining;
    user.dob = req.body.dob || user.dob;
    user.image = req.body.image || user.image;
    
    // Bank details
    if (req.body.bankDetails) {
        user.bankDetails = req.body.bankDetails;
    }

    // Salary Info (Admin Only)
    if (req.body.salary) {
        user.salary = req.body.salary;
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
    });
};

// @desc Delete user (Soft delete - set inactive)
// @route DELETE /api/users/:id
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify user belongs to admin's company
    const adminUser = await User.findById(req.user._id);
    if (user.companyName !== adminUser.companyName) {
        return res.status(403).json({ message: 'Not authorized to delete this user' });
    }
    
    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    
    // Prevent deleting other admins
    if (user.role === 'Admin') {
        return res.status(400).json({ message: 'Cannot delete admin users' });
    }
    
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
};

// @desc Get Dashboard Stats
// @route GET /api/users/dashboard/stats
const getDashboardStats = async (req, res) => {
    const Attendance = require('../models/Attendance');
    const Leave = require('../models/Leave');
    const Task = require('../models/Task');

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    try {
        // Get current user's company
        const currentUser = await User.findById(req.user._id);
        
        // 1. Attendance Count (Current Month)
        const attendanceCount = await Attendance.countDocuments({
            user: req.user._id,
            date: { $gte: firstDay.toISOString().split('T')[0] },
            status: 'Present'
        });

        // 2. Leave Balance (Only show if user has joined date)
        let leaveBalance = 0;
        if (currentUser.dateOfJoining) {
            // Calculate months since joining
            const joinDate = new Date(currentUser.dateOfJoining);
            const monthsSinceJoining = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24 * 30));
            
            if (monthsSinceJoining >= 0) {
                // Allocate 2 leaves per month (24 per year)
                const allocatedLeaves = Math.min(monthsSinceJoining * 2, 24);
                
                const leavesTaken = await Leave.countDocuments({
                    user: req.user._id,
                    status: 'Approved'
                });
                
                leaveBalance = Math.max(0, allocatedLeaves - leavesTaken);
            }
        }

        // 3. Pending Tasks (Tasks not completed)
        const pendingTasks = await Task.countDocuments({
            assignedTo: req.user._id,
            status: { $in: ['Pending', 'In Progress'] }
        });
        
        // 4. Total Employees in company
        const totalEmployees = await User.countDocuments({
            companyName: currentUser.companyName,
            role: { $ne: 'Admin' }
        });

        // 5. Recent Activity (Last 5 items)
        const recentAttendance = await Attendance.find({ user: req.user._id }).sort({ date: -1 }).limit(2).lean();
        const recentLeaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(2).lean();
        const recentTasks = await Task.find({ assignedTo: req.user._id }).sort({ createdAt: -1 }).limit(2).lean();

        // Normalize and merge activity
        let activity = [
            ...recentAttendance.map(a => ({
                type: 'attendance',
                title: a.checkOut ? 'Checked Out' : 'Checked In',
                date: a.checkIn || a.date,
                status: a.status
            })),
            ...recentLeaves.map(l => ({
                type: 'leave',
                title: `Leave Request (${l.type})`,
                date: l.createdAt,
                status: l.status
            })),
            ...recentTasks.map(t => ({
                type: 'task',
                title: t.title,
                date: t.createdAt,
                status: t.status,
                priority: t.priority
            }))
        ];

        // Sort by date desc and take top 5
        activity.sort((a, b) => new Date(b.date) - new Date(a.date));
        activity = activity.slice(0, 5);

        res.json({
            attendanceCount,
            leaveBalance,
            pendingTasks,
            totalEmployees,
            activity
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

module.exports = { authUser, registerUser, createEmployee, getUsers, getUserProfile, updateUserProfile, getUserById, updateUser, deleteUser, getDashboardStats };
