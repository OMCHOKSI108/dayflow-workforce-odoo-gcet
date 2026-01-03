const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create a new task (Admin/HR only)
// @route   POST /api/tasks
// @access  Private (Admin/HR)
const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority, dueDate } = req.body;

        // Verify assigned user exists and is in same company
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
            return res.status(404).json({ message: 'Assigned user not found' });
        }
        
        if (assignedUser.companyName !== req.user.companyName) {
            return res.status(403).json({ message: 'Cannot assign tasks to users outside your company' });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            companyName: req.user.companyName,
            priority,
            dueDate,
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email empCode')
            .populate('assignedBy', 'name email');

        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all tasks (Admin: all tasks, Employee: assigned to them)
// @route   GET /api/tasks
// @access  Private
const getAllTasks = async (req, res) => {
    try {
        let query = { companyName: req.user.companyName };

        // Employees can only see their assigned tasks
        if (req.user.role === 'Employee') {
            query.assignedTo = req.user._id;
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email empCode department')
            .populate('assignedBy', 'name email')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get my assigned tasks
// @route   GET /api/tasks/my
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ 
            assignedTo: req.user._id,
            companyName: req.user.companyName 
        })
            .populate('assignedBy', 'name email')
            .populate('comments.user', 'name')
            .sort({ dueDate: 1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email empCode department')
            .populate('assignedBy', 'name email')
            .populate('comments.user', 'name');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check company access
        if (task.companyName !== req.user.companyName) {
            return res.status(403).json({ message: 'Not authorized to view this task' });
        }

        // Employees can only view their assigned tasks
        if (req.user.role === 'Employee' && task.assignedTo._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this task' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update task (Admin can update all, Employee can update status/comments)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check company access
        if (task.companyName !== req.user.companyName) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        // Employees can only update their own tasks
        if (req.user.role === 'Employee' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const { title, description, priority, dueDate, status, assignedTo } = req.body;

        // Admin/HR can update everything
        if (req.user.role === 'Admin' || req.user.role === 'HR') {
            if (title) task.title = title;
            if (description) task.description = description;
            if (priority) task.priority = priority;
            if (dueDate) task.dueDate = dueDate;
            if (status) task.status = status;
            if (assignedTo) {
                // Verify new assigned user is in same company
                const newAssignedUser = await User.findById(assignedTo);
                if (newAssignedUser && newAssignedUser.companyName === req.user.companyName) {
                    task.assignedTo = assignedTo;
                }
            }
        } else {
            // Employees can only update status
            if (status) {
                task.status = status;
                if (status === 'Completed') {
                    task.completedAt = new Date();
                }
            }
        }

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email empCode')
            .populate('assignedBy', 'name email');

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete task (Admin/HR only)
// @route   DELETE /api/tasks/:id
// @access  Private (Admin/HR)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check company access
        if (task.companyName !== req.user.companyName) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check company access
        if (task.companyName !== req.user.companyName) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if user is involved in the task
        const isAssigned = task.assignedTo.toString() === req.user._id.toString();
        const isAssigner = task.assignedBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'Admin' || req.user.role === 'HR';

        if (!isAssigned && !isAssigner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to comment on this task' });
        }

        task.comments.push({
            user: req.user._id,
            text,
            createdAt: new Date()
        });

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email empCode')
            .populate('assignedBy', 'name email')
            .populate('comments.user', 'name');

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getMyTasks,
    getTaskById,
    updateTask,
    deleteTask,
    addComment
};
