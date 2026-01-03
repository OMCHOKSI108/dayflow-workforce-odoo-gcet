const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createSuperAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected for SuperAdmin seeding...');

        // Check if SuperAdmin already exists
        const existingSuperAdmin = await User.findOne({ role: 'SuperAdmin' });
        if (existingSuperAdmin) {
            console.log('SuperAdmin already exists!');
            console.log('Email:', existingSuperAdmin.email);
            console.log('EmpCode:', existingSuperAdmin.empCode);
            process.exit(0);
        }

        // Create SuperAdmin user
        const superAdmin = new User({
            name: 'Super Administrator',
            email: 'superadmin@dayflow.com',
            password: 'SuperAdmin@123', // Will be hashed by pre-save hook
            role: 'SuperAdmin',
            empCode: 'SUPERADMIN001',
            companyName: 'Dayflow Platform',
            designation: 'System Administrator',
            department: 'Platform Management',
            dateOfJoining: new Date(),
            phone: '0000000000',
            nationality: 'Global',
            gender: 'Other'
        });
        
        await superAdmin.save();

        console.log('SuperAdmin created successfully!');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('Email:', superAdmin.email);
        console.log('Password: SuperAdmin@123');
        console.log('EmpCode:', superAdmin.empCode);
        console.log('Role:', superAdmin.role);
        console.log('═══════════════════════════════════════════════════════════');
        console.log('   IMPORTANT: Change the password after first login!');
        console.log('   SuperAdmin has access to ALL companies and data!');
        console.log('═══════════════════════════════════════════════════════════');

        process.exit(0);
    } catch (error) {
        console.error('Error creating SuperAdmin:', error.message);
        process.exit(1);
    }
};

createSuperAdmin();
