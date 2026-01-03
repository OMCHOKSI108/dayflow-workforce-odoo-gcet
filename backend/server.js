const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables FIRST
dotenv.config();

// Validate required environment variables BEFORE doing anything else
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('\n❌ ============================================');
    console.error('❌  DEPLOYMENT FAILED - MISSING ENV VARIABLES');
    console.error('❌ ============================================\n');
    console.error('Missing required environment variables:');
    missingEnvVars.forEach(varName => {
        console.error(`   ❌ ${varName} is not set`);
    });
    console.error('\n📋 How to fix this on Render:');
    console.error('   1. Go to https://dashboard.render.com');
    console.error('   2. Click on your web service');
    console.error('   3. Click "Environment" in the left sidebar');
    console.error('   4. Add these variables:\n');
    console.error('      MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/dayflow-hrms');
    console.error('      JWT_SECRET = (generate with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))")');
    console.error('      GROQ_API_KEY = gsk_your_groq_api_key (optional)\n');
    console.error('   5. Click "Save Changes" - Render will auto-redeploy\n');
    console.error('❌ ============================================\n');
    process.exit(1);
}

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Dayflow HRMS API v1.0',
        status: 'running',
        documentation: '/api/docs',
        endpoints: {
            authentication: {
                login: 'POST /api/users/login',
                register: 'POST /api/users'
            },
            users: {
                getAll: 'GET /api/users (Admin)',
                getProfile: 'GET /api/users/profile',
                updateProfile: 'PUT /api/users/profile',
                createEmployee: 'POST /api/users/create (Admin)',
                getById: 'GET /api/users/:id (Admin)',
                updateById: 'PUT /api/users/:id (Admin)',
                deleteById: 'DELETE /api/users/:id (Admin)',
                dashboardStats: 'GET /api/users/dashboard/stats'
            },
            attendance: {
                checkIn: 'POST /api/attendance/checkin',
                checkOut: 'POST /api/attendance/checkout',
                getMy: 'GET /api/attendance/my',
                getAll: 'GET /api/attendance (Admin)',
                update: 'PUT /api/attendance/:id (Admin)',
                delete: 'DELETE /api/attendance/:id (Admin)'
            },
            leaves: {
                apply: 'POST /api/leaves',
                getMy: 'GET /api/leaves/my',
                getAll: 'GET /api/leaves (Admin)',
                updateStatus: 'PUT /api/leaves/:id (Admin)',
                delete: 'DELETE /api/leaves/:id'
            },
            tasks: {
                create: 'POST /api/tasks (Admin)',
                getAll: 'GET /api/tasks',
                getMy: 'GET /api/tasks/my',
                getById: 'GET /api/tasks/:id',
                update: 'PUT /api/tasks/:id',
                delete: 'DELETE /api/tasks/:id (Admin)',
                addComment: 'POST /api/tasks/:id/comment'
            },
            announcements: {
                create: 'POST /api/announcements (Admin)',
                getAll: 'GET /api/announcements',
                update: 'PUT /api/announcements/:id (Admin)',
                delete: 'DELETE /api/announcements/:id (Admin)'
            },
            chat: {
                sendMessage: 'POST /api/chat'
            },
            superadmin: {
                getAllCompanies: 'GET /api/superadmin/companies (SuperAdmin)',
                getAllAdmins: 'GET /api/superadmin/admins (SuperAdmin)',
                getCompanyDetails: 'GET /api/superadmin/company/:id (SuperAdmin)',
                getSystemStats: 'GET /api/superadmin/stats (SuperAdmin)',
                deleteCompany: 'DELETE /api/superadmin/company/:id (SuperAdmin)',
                updateUser: 'PUT /api/superadmin/user/:id (SuperAdmin)'
            }
        },
        tech_stack: {
            runtime: 'Node.js 22.x',
            framework: 'Express.js 5.x',
            database: 'MongoDB 6.x with Mongoose',
            authentication: 'JWT (JSON Web Tokens)',
            ai: 'Groq LLaMA 3.3 70B Versatile'
        }
    });
});

const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const chatRoutes = require('./routes/chatRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const taskRoutes = require('./routes/taskRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');

app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/superadmin', superAdminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
