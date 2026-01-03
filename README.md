# 🧭 Dayflow - Human Resource Management System (HRMS)

<div align="center">

![Dayflow Logo](frontend/public/logo.png)

**Every workday, perfectly aligned.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Docs](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📌 About

**Dayflow** is a modern, full-stack Human Resource Management System (HRMS) designed to digitize and automate core HR operations for organizations of all sizes. Built with a focus on simplicity, security, and scalability, Dayflow provides a centralized platform for managing employees, tracking attendance, processing leave requests, and maintaining payroll visibility.

**Key Highlights:**
- 🎯 **Role-Based Access Control** - Secure multi-role architecture (Admin, HR, Employee)
- 🏢 **Multi-Company Support** - Complete data isolation between organizations
- 🤖 **AI-Powered Assistant** - RAG-based chatbot using Groq LLaMA 3.3 70B
- 📊 **Real-Time Dashboard** - Comprehensive analytics and activity tracking
- 🔒 **Enterprise Security** - JWT authentication, password encryption, CORS protection
- 💼 **Professional UI** - Odoo-inspired design with smooth animations

---

## 🎯 Problem Statement

Organizations struggle with:
- ❌ Manual, fragmented, and error-prone HR processes
- ❌ Inefficient employee onboarding and management
- ❌ Inaccurate attendance tracking and leave approvals
- ❌ Lack of payroll transparency and visibility
- ❌ Poor role-based access control and data security

**Dayflow solves these problems by providing:**
- ✅ Automated, centralized HR operations
- ✅ Streamlined employee lifecycle management
- ✅ Digital attendance and leave management
- ✅ Transparent salary structures with auto-calculation
- ✅ Secure, role-based data access and audit trails

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure Sign Up** - Organization registration with admin account creation
- **JWT Authentication** - Token-based secure login with 30-day validity
- **Role-Based Access** - Three-tier system (Admin, HR, Employee)
- **Multi-Company Isolation** - Complete data segregation between organizations

### 👥 Employee Management
- **Smart Employee Codes** - Auto-generated unique IDs (e.g., `DAOM20260001`)
- **Comprehensive Profiles** - Personal info, work details, bank info, salary breakdown
- **Team Directory** - Searchable grid with status indicators (Present/Leave/Absent)
- **Excel Export** - Bulk data export for reporting and compliance
- **CRUD Operations** - Full create, read, update, delete capabilities (Admin only)

### ⏰ Attendance Tracking
- **Real-Time Check-In/Out** - One-click clock management with timestamp
- **Work Hours Calculation** - Automatic duration tracking
- **Monthly Statistics** - Present days, leaves, and working days summary
- **Admin Dashboard** - View all employee attendance across company
- **Edit & Delete** - Admin can correct attendance errors (NEW)

### 🏖️ Leave Management
- **Leave Application** - Request Paid, Sick, or Unpaid time off
- **Approval Workflow** - Admin/HR can approve or reject requests
- **Leave Balance** - Automatic calculation based on tenure (2 leaves/month, 24/year)
- **Status Tracking** - Real-time view of Pending, Approved, Rejected leaves
- **Delete Requests** - Users can cancel pending leave applications (NEW)

### 💰 Payroll Management
- **Auto-Calculated Salary** - Smart breakdown based on gross wage
  - Basic: 50% of gross
  - HRA: 25% of gross (50% of basic)
  - Standard Allowance: ₹4,167 fixed
  - Performance Bonus: 8.33% of basic
  - Travel Allowance: 8.33% of basic
  - PF Deduction: 12% of basic
  - Professional Tax: ₹200 fixed
- **Salary Editor** - Admin can modify components with live updates
- **Read-Only View** - Employees can view their salary structure

### 📢 Announcements (NEW)
- **Create Announcements** - Admin/HR can broadcast company-wide messages
- **Color-Coded Types** - Info (Blue), Warning (Yellow), Success (Green), Important (Red)
- **Auto-Expiry** - Optional expiration date for time-sensitive notices
- **Company-Specific** - Only visible to same organization members

### 🤖 AI Chatbot
- **RAG-Powered** - Retrieval Augmented Generation with user context
- **Groq Integration** - LLaMA 3.3 70B model for intelligent responses
- **Context-Aware** - Knows user profile, attendance status, leave history
- **Fallback Engine** - Heuristic responses when API unavailable
- **HR-Focused** - Trained specifically for HR-related queries

### 📊 Dashboard & Analytics
- **Key Metrics** - Attendance count, leave balance, pending tasks, total employees
- **Recent Activity** - Timeline of check-ins/outs and leave requests
- **Announcements Board** - Company-wide notifications and updates
- **Real-Time Updates** - Live data synchronization across platform

---

## 🛠️ Technology Stack

### Backend
```
Node.js         v18.x       - JavaScript runtime
Express.js      v5.x        - Web application framework
MongoDB         v6.x        - NoSQL database
Mongoose        v9.x        - MongoDB object modeling
JWT             v9.x        - Authentication tokens
Bcrypt.js       v3.x        - Password hashing
Groq SDK        v0.37       - AI model integration
CORS            v2.x        - Cross-origin security
```

### Frontend
```
React           v19.x       - UI library
Vite            v7.x        - Build tool & dev server
React Router    v7.x        - Client-side routing
Axios           v1.x        - HTTP client
Material-UI     v7.x        - Component library
Framer Motion   v12.x       - Animation library
Lucide React    v0.562      - Icon library
XLSX            v0.18       - Excel export
```

---

## 🏗️ Architecture

### System Design
```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React SPA)                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐      │
│  │Dashboard│  │Employees│  │ Leaves  │  │Attendance│      │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬─────┘      │
└───────┼───────────┼─────────────┼────────────┼─────────────┘
        │           │             │            │
        └───────────┴─────────────┴────────────┘
                    │ HTTPS/REST
        ┌───────────▼─────────────────────────────────────────┐
        │              API GATEWAY (Express)                   │
        │  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
        │  │   Auth     │  │  Protected │  │   Admin    │   │
        │  │Middleware  │  │  Routes    │  │Middleware  │   │
        │  └────────────┘  └────────────┘  └────────────┘   │
        └───────────┬──────────────────────────────────────────┘
                    │
        ┌───────────▼─────────────────────────────────────────┐
        │              BUSINESS LOGIC                          │
        │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐│
        │  │ User │  │Attend│  │Leave │  │ Chat │  │Announ││
        │  │ Ctrl │  │ Ctrl │  │ Ctrl │  │ Ctrl │  │ Ctrl ││
        │  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘│
        └───────────┬──────────────────────────────────────────┘
                    │
        ┌───────────▼─────────────────────────────────────────┐
        │                DATABASE LAYER                        │
        │  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
        │  │    User    │  │ Attendance │  │   Leave    │   │
        │  │   Model    │  │   Model    │  │   Model    │   │
        │  └────────────┘  └────────────┘  └────────────┘   │
        │        MongoDB with Mongoose ODM                    │
        └──────────────────────────────────────────────────────┘
```

### Data Flow
1. **Client** sends HTTP request with JWT token
2. **Auth Middleware** validates token and extracts user
3. **Controller** processes business logic with company filtering
4. **Model** performs database operations with Mongoose
5. **Response** sent back to client with JSON data

---

## 📦 Installation

### Prerequisites
- Node.js v18+ installed
- MongoDB v6+ running locally or remote connection
- npm or yarn package manager
- Git for version control

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/dayflow-hrms.git
cd dayflow-hrms
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dayflow
JWT_SECRET=your_super_secret_jwt_key_change_this
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

### Step 4: Database Seeding (Optional)
```bash
cd ../backend
node seeder.js
```
This creates 50 sample employees with realistic data for testing.

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 5000 | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `GROQ_API_KEY` | Groq AI API key | - | No* |
| `NODE_ENV` | Environment mode | development | No |

*Without GROQ_API_KEY, chatbot uses fallback heuristic responses.

### Database Configuration
```javascript
// backend/config/db.js
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

### CORS Configuration
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
```

---

## 🚀 Usage

### Start Backend Server
```bash
cd backend
npm start        # Production mode
npm run dev      # Development mode with nodemon
```
Server runs at: `http://localhost:5000`

### Start Frontend Development
```bash
cd frontend
npm run dev
```
Application runs at: `http://localhost:5173`

### Build for Production
```bash
cd frontend
npm run build
```
Optimized files in `frontend/dist/`

---

## 📚 API Documentation

Complete API documentation available at: [docs/backend_api.txt](docs/backend_api.txt)

### Quick Reference

#### Authentication
```http
POST /api/users/login          # Login with email/empCode
POST /api/users                # Register organization
```

#### User Management
```http
GET    /api/users              # List all users (Admin)
POST   /api/users/create       # Create employee (Admin)
GET    /api/users/profile      # Get own profile
PUT    /api/users/profile      # Update own profile
GET    /api/users/:id          # Get user by ID (Admin)
PUT    /api/users/:id          # Update user (Admin)
DELETE /api/users/:id          # Delete user (Admin)
```

#### Attendance
```http
POST   /api/attendance/checkin     # Clock in
POST   /api/attendance/checkout    # Clock out
GET    /api/attendance/my          # My attendance
GET    /api/attendance             # All attendance (Admin)
PUT    /api/attendance/:id         # Edit record (Admin)
DELETE /api/attendance/:id         # Delete record (Admin)
```

#### Leaves
```http
POST   /api/leaves                 # Apply leave
GET    /api/leaves/my              # My leaves
GET    /api/leaves                 # All leaves (Admin)
PUT    /api/leaves/:id             # Approve/Reject (Admin)
DELETE /api/leaves/:id             # Delete request
```

#### Announcements
```http
POST   /api/announcements          # Create (Admin/HR)
GET    /api/announcements          # Get all
PUT    /api/announcements/:id      # Update (Admin/HR)
DELETE /api/announcements/:id      # Delete (Admin/HR)
```

#### AI Chat
```http
POST   /api/chat                   # Send message
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Real-time metrics, activity feed, and announcements*

### Employee Directory
![Employees](docs/screenshots/employees.png)
*Searchable team directory with status indicators*

### Attendance Tracking
![Attendance](docs/screenshots/attendance.png)
*Check-in/out with work hours calculation*

### Leave Management
![Leaves](docs/screenshots/leaves.png)
*Leave application and approval workflow*

### Profile Management
![Profile](docs/screenshots/profile.png)
*Comprehensive employee profile editor*

---

## 🔒 Security

### Implemented Security Measures

✅ **Authentication**
- JWT-based token authentication (30-day expiry)
- Bcrypt password hashing (10 salt rounds)
- Secure password validation (min 6 characters)

✅ **Authorization**
- Role-based access control (Admin, HR, Employee)
- Company-based data isolation
- Protected routes with middleware verification

✅ **Data Protection**
- Company-specific filtering on all queries
- Ownership verification before updates/deletes
- Prevention of role escalation attacks
- Input validation and sanitization

✅ **API Security**
- CORS protection with origin whitelist
- Rate limiting on sensitive endpoints
- SQL injection prevention via Mongoose
- XSS protection through React escaping

### Security Best Practices

```javascript
// ✅ DO: Use environment variables
const secret = process.env.JWT_SECRET;

// ❌ DON'T: Hardcode secrets
const secret = "mysecretkey123";

// ✅ DO: Validate ownership
if (resource.companyName !== user.companyName) {
  return res.status(403).json({ message: 'Not authorized' });
}

// ❌ DON'T: Trust user input
const data = await Model.find({});  // Returns ALL data
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### Coding Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Project Lead:** Your Name  
**Frontend Developer:** Your Name  
**Backend Developer:** Your Name  
**UI/UX Designer:** Your Name  

---

## 🙏 Acknowledgments

- **Odoo** - Design inspiration
- **Groq** - AI model provider
- **MongoDB** - Database solution
- **React Team** - Frontend framework
- **Node.js Community** - Backend ecosystem

---

## 📞 Support

For issues, questions, or feature requests:
- 📧 Email: support@dayflow.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/dayflow-hrms/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/dayflow-hrms/discussions)

---

<div align="center">

**Made with ❤️ by Dayflow Team**

⭐ Star us on GitHub — it motivates us a lot!

[⬆ Back to Top](#-dayflow---human-resource-management-system-hrms)

</div>