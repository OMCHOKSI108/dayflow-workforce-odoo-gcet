const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();

// Flag to check if seeder has already run
const SEEDER_FLAG = 'SEEDER_RUN';

const indianFirstNames = [
    "Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Muhammad", "Krishna", "Ishaan", "Shaurya",
    "Aadhya", "Diya", "Saanvi", "Ananya", "Myra", "Kiara", "Pari", "Amaira", "Riya", "Fatima",
    "Rohan", "Vikram", "Neha", "Pooja", "Rahul", "Amit", "Suresh", "Priya", "Sneha", "Anjali",
    "Karan", "Manish", "Deepak", "Sanjay", "Sunil", "Anita", "Sunita", "Meena", "Rekha", "Suman",
    "Vijay", "Ajay", "Raj", "Ramesh", "Ganesh", "Lakshmi", "Saraswati", "Durga", "Kali", "Shiva"
];

const indianLastNames = [
    "Patel", "Sharma", "Singh", "Kumar", "Gupta", "Desai", "Mehta", "Joshi", "Shah", "Reddy",
    "Nair", "Iyer", "Khan", "Ali", "Ahmed", "Fernandes", "Pereira", "Crasto", "D'Souza", "Lobo",
    "Chopra", "Malhotra", "Kapoor", "Saxena", "Verma", "Yadav", "Mishra", "Pandey", "Tiwari", "Dubey",
    "Bhat", "Rao", "More", "Patil", "Kulkarni", "Deshmukh", "Pawar", "Shinde", "Jadhav", "Gaikwad",
    "Chauhan", "Solanki", "Rathod", "Parmar", "Makwana", "Vasava", "Gamit", "Chowdhury", "Das", "Biswas"
];

const companies = ["Dayflow HQ", "Odoo India", "Tech Mahindra", "Infosys", "Wipro"];
const departments = ["Engineering", "HR", "Sales", "Marketing", "Finance", "Operations", "Support"];
const designations = ["Junior Developer", "Senior Developer", "Manager", "Intern", "Team Lead", "Analyst", "Consultant"];
const leaveTypes = ["Paid", "Sick", "Unpaid"];
const leaveStatuses = ["Pending", "Approved", "Rejected"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generatePhone = () => `9${Math.floor(Math.random() * 900000000 + 100000000)}`;

const generateEmpCode = (company, name, year, serial) => {
    let companyPrefix = (company.split(' ')[0][0] + (company.split(' ')[1]?.[0] || company[1])).toUpperCase();
    let nameParts = name.split(' ');
    let namePrefix = nameParts.length > 1 ? (nameParts[0].substring(0, 2) + nameParts[1].substring(0, 2)).toUpperCase() : name.substring(0, 4).toUpperCase();
    return `${companyPrefix}${namePrefix}${year}${serial.toString().padStart(4, '0')}`;
};

const calculateSalaryBreakdown = (monthlySalary) => {
    // Logic based on Sketch
    // Basic = 50%
    const basic = Math.round(monthlySalary * 0.50);
    // HRA = 50% of Basic (so 25% of total)
    const hra = Math.round(basic * 0.50);
    // Standard Allowance (Fixed approx 16%)
    const standardAllowance = Math.round(monthlySalary * 0.15);
    // Performance Bonus (approx 8%)
    const performanceBonus = Math.round(monthlySalary * 0.08);
    // Travel Allowance (approx 7%)
    const travelAllowance = monthlySalary - (basic + hra + standardAllowance + performanceBonus);

    // Deductions
    // PF = 12% of Basic
    const pf = Math.round(basic * 0.12);
    const professionalTax = 200;

    return {
        basic,
        hra,
        standardAllowance,
        performanceBonus,
        travelAllowance,
        pf,
        professionalTax
    };
};

const importData = async () => {
    try {
        // Check if data already exists to prevent duplicate seeding
        const existingUsers = await User.countDocuments();
        if (existingUsers > 0) {
            console.log('⚠️  Database already contains data. Skipping seeder to prevent duplicates.');
            console.log(`Found ${existingUsers} existing users.`);
            process.exit(0);
        }

        await User.deleteMany();
        await Attendance.deleteMany();
        await Leave.deleteMany();

        const users = [];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Create System Admin
        const adminSalary = 150000;
        const adminUser = {
            name: 'System Admin',
            email: 'admin@dayflow.com',
            password: hashedPassword,
            role: 'Admin',
            empCode: 'dayflowadmin',
            companyName: 'Dayflow HQ',
            designation: 'HR Director',
            department: 'HR',
            phone: '9876543210',
            salary: {
                monthly: adminSalary,
                yearly: adminSalary * 12,
                breakdown: calculateSalaryBreakdown(adminSalary)
            },
            dateOfJoining: new Date('2023-01-01')
        };
        users.push(adminUser);

        // 2. Generate 50 Indian Employees
        for (let i = 1; i <= 50; i++) {
            const firstName = getRandom(indianFirstNames);
            const lastName = getRandom(indianLastNames);
            const name = `${firstName} ${lastName}`;
            const company = getRandom(companies);
            const year = 2023 + Math.floor(Math.random() * 3); // 2023-2025
            const empCode = generateEmpCode(company, name, year, i);
            const monthlySalary = Math.floor(Math.random() * (100000 - 20000) + 20000);

            users.push({
                name: name,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@dayflow.com`,
                password: hashedPassword,
                role: 'Employee',
                empCode: empCode,
                companyName: company,
                department: getRandom(departments),
                designation: getRandom(designations),
                dateOfJoining: new Date(`${year}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`),
                phone: generatePhone(),
                residingAddress: `${Math.floor(Math.random() * 100)}, ${getRandom(['MG Road', 'Station Road', 'Park Street', 'Main Bazaar'])}, ${getRandom(['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'])}`,
                nationality: 'Indian',
                gender: Math.random() > 0.5 ? 'Male' : 'Female',
                maritalStatus: Math.random() > 0.7 ? 'Married' : 'Single',
                personalEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
                salary: {
                    monthly: monthlySalary,
                    yearly: monthlySalary * 12,
                    breakdown: calculateSalaryBreakdown(monthlySalary)
                },
                bankDetails: {
                    accountNumber: Math.floor(Math.random() * 100000000000).toString(),
                    pan: `ABCDE${Math.floor(Math.random() * 10000)}F`,
                    uan: Math.floor(Math.random() * 100000000000).toString()
                }
            });
        }

        const createdUsers = await User.insertMany(users);
        console.log(`Users Imported: ${createdUsers.length}`);

        // 3. Generate Attendance
        const attendanceRecords = [];
        const today = new Date();

        for (const user of createdUsers) {
            const daysPresent = Math.floor(Math.random() * 5) + 2;
            for (let d = 0; d < daysPresent; d++) {
                const date = new Date();
                date.setDate(today.getDate() - d);

                const checkInHour = Math.floor(Math.random() * 3) + 8;
                const checkInMin = Math.floor(Math.random() * 60);
                const checkInTime = new Date(date);
                checkInTime.setHours(checkInHour, checkInMin, 0);

                const checkOutHour = Math.floor(Math.random() * 4) + 17;
                const checkOutMin = Math.floor(Math.random() * 60);
                const checkOutTime = new Date(date);
                checkOutTime.setHours(checkOutHour, checkOutMin, 0);

                attendanceRecords.push({
                    user: user._id,
                    date: checkInTime,
                    checkIn: checkInTime,
                    checkOut: checkOutTime,
                    status: 'Present'
                });
            }
        }
        await Attendance.insertMany(attendanceRecords);
        console.log(`Attendance Records Imported: ${attendanceRecords.length}`);

        // 4. Leave Requests
        const leaveRequests = [];
        for (const user of createdUsers) {
            if (Math.random() > 0.7) {
                const startDate = new Date();
                startDate.setDate(today.getDate() + Math.floor(Math.random() * 10));
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 3) + 1);

                leaveRequests.push({
                    user: user._id,
                    reason: getRandom(['Personal Emergency', 'Vacation', 'Sick Leave', 'Family Function']),
                    startDate: startDate,
                    endDate: endDate,
                    status: getRandom(leaveStatuses),
                    type: getRandom(leaveTypes)
                });
            }
        }
        await Leave.insertMany(leaveRequests);
        console.log(`Leave Requests Imported: ${leaveRequests.length}`);

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
