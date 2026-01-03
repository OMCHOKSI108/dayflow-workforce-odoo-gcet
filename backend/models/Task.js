const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        assignedTo: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        assignedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        companyName: { 
            type: String, 
            required: true 
        },
        priority: { 
            type: String, 
            enum: ['Low', 'Medium', 'High', 'Urgent'], 
            default: 'Medium' 
        },
        status: { 
            type: String, 
            enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], 
            default: 'Pending' 
        },
        dueDate: { 
            type: Date, 
            required: true 
        },
        completedAt: { 
            type: Date 
        },
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                text: { type: String },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        attachments: [
            {
                name: String,
                url: String
            }
        ]
    },
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('Task', taskSchema);
