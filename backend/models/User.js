const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    // Auth Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Employee', 'HR', 'Admin', 'SuperAdmin'], default: 'Employee' },
    empCode: { type: String, unique: true }, // Auto-generated Login ID
    image: { type: String }, // Profile Image URL (Base64 or Link)

    // Work Info
    companyName: { type: String },
    designation: { type: String }, // Job Position
    department: { type: String },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateOfJoining: { type: Date },

    // Contact & Private Info
    phone: { type: String },
    address: { type: String }, // Current Address
    residingAddress: { type: String }, // Permanent/Residing
    nationality: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced'] },
    personalEmail: { type: String },

    // Bank & Security
    bankDetails: {
        accountNumber: String,
        pan: String,
        uan: String,
    },

    // Salary Info (Admin View)
    salary: {
        monthly: { type: Number, default: 0 },
        yearly: { type: Number, default: 0 },
        breakdown: {
            basic: { type: Number, default: 0 },
            hra: { type: Number, default: 0 },
            standardAllowance: { type: Number, default: 0 },
            performanceBonus: { type: Number, default: 0 },
            travelAllowance: { type: Number, default: 0 },
            pf: { type: Number, default: 0 }, // Provident Fund (Deduction)
            professionalTax: { type: Number, default: 0 } // Deduction
        },
        workingDays: { type: Number, default: 5 },
        breakTime: { type: String, default: '1 Hour' }
    },

    createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
