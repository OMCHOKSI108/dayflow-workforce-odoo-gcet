import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { motion } from 'framer-motion';
import { Book, Clock, Users, Calendar, CheckCircle, MessageSquare, BarChart3, Zap, Shield, Code, Globe, Smartphone } from 'lucide-react';

const Documentation = () => {
    const features = [
        {
            icon: Clock,
            title: 'Smart Attendance Tracking',
            description: 'Comprehensive attendance management with GPS verification, shift scheduling, and automated reporting.',
            details: [
                'GPS-based check-in/check-out with location verification',
                'Multiple shift management and rotation support',
                'Real-time attendance dashboard and analytics',
                'Overtime calculation and approval workflows',
                'Late arrival and early departure tracking',
                'Biometric integration support',
                'Automated attendance reports and exports'
            ],
            apiExample: `// Check In
POST /api/attendance/check-in
{
  "location": {
    "latitude": 23.0225,
    "longitude": 72.5714
  }
}

// Get Attendance Records
GET /api/attendance?month=1&year=2024`
        },
        {
            icon: Calendar,
            title: 'Leave Management',
            description: 'Complete leave management system with multiple leave types, approval workflows, and balance tracking.',
            details: [
                'Multiple leave types (Sick, Casual, Annual, etc.)',
                'Leave balance tracking and accrual rules',
                'Multi-level approval workflows',
                'Leave calendar and conflict detection',
                'Half-day and hourly leave support',
                'Emergency leave requests',
                'Automated email notifications'
            ],
            apiExample: `// Apply for Leave
POST /api/leaves
{
  "type": "sick",
  "startDate": "2024-02-01",
  "endDate": "2024-02-03",
  "reason": "Medical appointment"
}

// Approve/Reject Leave (Admin/HR)
PATCH /api/leaves/:id
{
  "status": "approved",
  "remarks": "Hope you feel better soon"
}`
        },
        {
            icon: Users,
            title: 'Employee Management',
            description: 'Centralized employee database with role-based access, department management, and detailed profiles.',
            details: [
                'Complete employee profiles with documents',
                'Role-based access control (Admin/HR/Employee)',
                'Department and team organization',
                'Employee hierarchy and reporting structure',
                'Document management and storage',
                'Contact information and emergency contacts',
                'Employment history and status tracking'
            ],
            apiExample: `// Get All Employees (Admin/HR)
GET /api/users/employees

// Update Employee Profile
PATCH /api/users/profile
{
  "phone": "+91 1234567890",
  "department": "Engineering",
  "jobTitle": "Senior Developer"
}`
        },
        {
            icon: CheckCircle,
            title: 'Task Management',
            description: 'Assign, track, and manage tasks with priority levels, due dates, and collaborative features.',
            details: [
                'Task assignment with multiple priorities',
                'Due date tracking and overdue alerts',
                'Status management (Pending, In Progress, Completed)',
                'Comment system for task discussions',
                'File attachments and document sharing',
                'Task filtering and sorting options',
                'Activity timeline and history'
            ],
            apiExample: `// Create Task (Admin)
POST /api/tasks
{
  "title": "Update user documentation",
  "description": "Add new API endpoints to docs",
  "assignedTo": "employee_id",
  "priority": "High",
  "dueDate": "2024-02-15"
}

// Update Task Status (Employee)
PATCH /api/tasks/:id
{
  "status": "In Progress"
}

// Add Comment
POST /api/tasks/:id/comment
{
  "text": "Working on it, will complete by EOD"
}`
        },
        {
            icon: MessageSquare,
            title: 'AI-Powered Chatbot',
            description: 'Intelligent HR assistant powered by Groq LLaMA 3.3 70B for instant answers to HR queries.',
            details: [
                'RAG-based context-aware responses',
                'Company policy and handbook integration',
                '24/7 availability for employee queries',
                'Multi-language support',
                'Leave balance and attendance inquiries',
                'Policy clarifications and FAQs',
                'Intelligent conversation history'
            ],
            apiExample: `// Send Message to Chatbot
POST /api/chat
{
  "message": "How many sick leaves do I have left?",
  "conversationHistory": []
}

// Response
{
  "response": "Based on your records, you have 5 sick leaves remaining out of 12 for this year.",
  "model": "llama-3.3-70b-versatile"
}`
        },
        {
            icon: BarChart3,
            title: 'Advanced Analytics',
            description: 'Comprehensive dashboards and reports for data-driven decision making.',
            details: [
                'Real-time attendance analytics',
                'Leave utilization reports',
                'Department-wise performance metrics',
                'Custom report generation',
                'Export to PDF, Excel, CSV',
                'Trend analysis and predictions',
                'Visual charts and graphs'
            ],
            apiExample: `// Get Dashboard Statistics
GET /api/users/dashboard

// Response includes:
{
  "totalEmployees": 250,
  "presentToday": 235,
  "onLeave": 12,
  "pendingLeaves": 8,
  "tasks": {
    "total": 45,
    "pending": 12,
    "inProgress": 18,
    "completed": 15
  }
}`
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'Bank-level security with JWT authentication, role-based access, and data encryption.',
            details: [
                'JWT token-based authentication',
                'Bcrypt password hashing',
                'Role-based access control (RBAC)',
                'Company-based data isolation',
                'Secure API endpoints',
                'Session management',
                'Audit logs and activity tracking'
            ],
            apiExample: `// Authentication
POST /api/users/login
{
  "email": "user@company.com",
  "password": "securepassword"
}

// Protected Route Headers
Authorization: Bearer <jwt_token>`
        },
        {
            icon: Globe,
            title: 'Multi-Tenant Architecture',
            description: 'Complete data isolation for multiple companies on a single platform.',
            details: [
                'Unlimited companies support',
                'Automatic data isolation by company',
                'Company-specific branding',
                'Independent user management',
                'Cross-company analytics (SuperAdmin)',
                'Scalable architecture',
                'Resource optimization'
            ],
            apiExample: `// All queries automatically filter by company
GET /api/users/employees
// Returns only employees from your company

// SuperAdmin can access all companies
GET /api/superadmin/companies
GET /api/superadmin/company/:id/users`
        },
        {
            icon: Zap,
            title: 'Lightning Fast Performance',
            description: 'Built with React 19, Vite, and MongoDB for optimal speed and efficiency.',
            details: [
                'React 19 with latest optimizations',
                'Vite for instant HMR and builds',
                'MongoDB for scalable database',
                'Efficient state management',
                'Lazy loading and code splitting',
                'Optimized API responses',
                'CDN-ready static assets'
            ],
            apiExample: `// Technologies Used:
Frontend: React 19 + Vite 7 + Material-UI 7
Backend: Node.js 22 + Express 5 + MongoDB 6
AI: Groq SDK (LLaMA 3.3 70B)
Auth: JWT + Bcrypt
Real-time: WebSockets (planned)`
        },
        {
            icon: Smartphone,
            title: 'Mobile Responsive',
            description: 'Fully responsive design that works seamlessly across all devices.',
            details: [
                'Mobile-first design approach',
                'Touch-optimized interfaces',
                'Responsive grid layouts',
                'Cross-browser compatibility',
                'Progressive Web App (PWA) ready',
                'Offline mode capabilities (planned)',
                'Native mobile apps (planned)'
            ],
            apiExample: `// Responsive Design Features:
- Adaptive layouts for mobile, tablet, desktop
- Touch-friendly buttons and forms
- Mobile navigation menu
- Optimized images and assets
- Fast load times on 3G/4G networks`
        },
        {
            icon: Code,
            title: 'Open Source',
            description: 'MIT licensed and available on GitHub for complete transparency and customization.',
            details: [
                'MIT License - free to use and modify',
                'Full source code on GitHub',
                'Community-driven development',
                'Regular updates and improvements',
                'Extensive documentation',
                'Active issue tracking',
                'Contribution guidelines'
            ],
            apiExample: `// GitHub Repository
https://github.com/dayflow/hrms

// Installation
git clone <repo-url>
cd dayflow-workforce-odoo-gcet
npm install
npm run dev

// Environment Variables
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key`
        },
        {
            icon: Book,
            title: 'Comprehensive API',
            description: 'RESTful API with complete documentation for easy integration and customization.',
            details: [
                'RESTful architecture',
                'JSON request/response format',
                'Comprehensive error handling',
                'Rate limiting and throttling',
                'API versioning support',
                'Webhook support (planned)',
                'GraphQL support (planned)'
            ],
            apiExample: `// API Base URL
https://api.dayflow.com/v1

// Common Endpoints:
POST   /api/users/register
POST   /api/users/login
GET    /api/users/profile
POST   /api/attendance/check-in
GET    /api/attendance
POST   /api/leaves
GET    /api/leaves
POST   /api/tasks
GET    /api/tasks
POST   /api/chat

// Error Handling:
{
  "error": "Authentication failed",
  "code": "AUTH_ERROR",
  "status": 401
}`
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'white', position: 'relative', overflow: 'hidden' }}>
            {/* Calligraphy Background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                fontSize: '15rem',
                fontFamily: 'serif',
                fontStyle: 'italic',
                color: 'rgba(123, 31, 162, 0.02)',
                lineHeight: '1.2',
                overflow: 'hidden',
                userSelect: 'none',
                pointerEvents: 'none',
                zIndex: 0,
                transform: 'rotate(-15deg)',
                whiteSpace: 'nowrap'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    Documentation Features API Integration Security Performance
                </div>
                <div style={{ marginBottom: '2rem' }}>
                    HRMS Workforce Management Analytics Intelligence Automation
                </div>
                <div style={{ marginBottom: '2rem' }}>
                    Enterprise Cloud Modern Technology Innovation Excellence
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <PublicNavbar />
                
                {/* Hero */}
                <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(250,245,255,0.95) 100%)' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{
                                display: 'inline-block',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, var(--primary-color), #c084fc)',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                marginBottom: '1.5rem'
                            }}>
                                COMPLETE DOCUMENTATION
                            </div>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{ fontSize: '4rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}
                        >
                            Feature <span style={{ color: 'var(--primary-color)' }}>Documentation</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{ fontSize: '1.3rem', color: '#1f2937', lineHeight: '1.7', fontWeight: '500' }}
                        >
                            Comprehensive guide to all features, APIs, and implementation details
                        </motion.p>
                    </div>
                </section>

                {/* Backend Architecture & API Overview */}
                <section style={{ padding: '4rem 2rem', background: '#fafafa' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111827', marginBottom: '3rem', textAlign: 'center' }}
                        >
                            Backend <span style={{ color: 'var(--primary-color)' }}>Architecture</span>
                        </motion.h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }} className="mobile-grid-1">
                            {/* Tech Stack */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    background: 'white',
                                    padding: '2.5rem',
                                    borderRadius: '16px',
                                    border: '3px solid #e9d5ff',
                                    boxShadow: '0 4px 20px rgba(123, 31, 162, 0.1)'
                                }}
                            >
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
                                    Technology Stack
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {[
                                        { label: 'Runtime', value: 'Node.js 22.x' },
                                        { label: 'Framework', value: 'Express.js 5.x' },
                                        { label: 'Database', value: 'MongoDB 6.x with Mongoose ODM' },
                                        { label: 'Authentication', value: 'JWT (30-day validity)' },
                                        { label: 'Password Security', value: 'Bcrypt (10 salt rounds)' },
                                        { label: 'AI Integration', value: 'Groq LLaMA 3.3 70B Versatile' },
                                        { label: 'CORS', value: 'Enabled for cross-origin requests' },
                                        { label: 'Environment', value: 'dotenv for config management' }
                                    ].map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#faf5ff', borderRadius: '8px' }}>
                                            <span style={{ fontWeight: '600', color: '#374151' }}>{item.label}:</span>
                                            <span style={{ color: 'var(--primary-color)', fontWeight: '500' }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Architecture Patterns */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    background: 'white',
                                    padding: '2.5rem',
                                    borderRadius: '16px',
                                    border: '3px solid #e9d5ff',
                                    boxShadow: '0 4px 20px rgba(123, 31, 162, 0.1)'
                                }}
                            >
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
                                    Architecture Patterns
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {[
                                        'MVC (Model-View-Controller) Pattern',
                                        'RESTful API Design',
                                        'Middleware Chain Architecture',
                                        'Role-Based Access Control (RBAC)',
                                        'Multi-Tenant Data Isolation',
                                        'Retrieval-Augmented Generation (RAG) for AI',
                                        'Async/Await Error Handling',
                                        'Schema Validation with Mongoose'
                                    ].map((pattern, idx) => (
                                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                            <CheckCircle size={20} color="var(--primary-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                            <span style={{ fontSize: '1rem', color: '#374151', lineHeight: '1.6', fontWeight: '500' }}>
                                                {pattern}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* API Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                background: 'white',
                                padding: '3rem',
                                borderRadius: '16px',
                                border: '3px solid #e9d5ff',
                                boxShadow: '0 4px 20px rgba(123, 31, 162, 0.1)'
                            }}
                        >
                            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>
                                Complete API Reference
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }} className="mobile-grid-1">
                                {[
                                    {
                                        category: 'Authentication',
                                        endpoints: [
                                            'POST /api/users/login',
                                            'POST /api/users (register)'
                                        ]
                                    },
                                    {
                                        category: 'User Management',
                                        endpoints: [
                                            'GET /api/users (Admin)',
                                            'GET /api/users/profile',
                                            'PUT /api/users/profile',
                                            'POST /api/users/create (Admin)',
                                            'GET /api/users/:id (Admin)',
                                            'PUT /api/users/:id (Admin)',
                                            'DELETE /api/users/:id (Admin)',
                                            'GET /api/users/dashboard/stats'
                                        ]
                                    },
                                    {
                                        category: 'Attendance',
                                        endpoints: [
                                            'POST /api/attendance/checkin',
                                            'POST /api/attendance/checkout',
                                            'GET /api/attendance/my',
                                            'GET /api/attendance (Admin)',
                                            'PUT /api/attendance/:id (Admin)',
                                            'DELETE /api/attendance/:id (Admin)'
                                        ]
                                    },
                                    {
                                        category: 'Leave Management',
                                        endpoints: [
                                            'POST /api/leaves',
                                            'GET /api/leaves/my',
                                            'GET /api/leaves (Admin)',
                                            'PUT /api/leaves/:id (Admin)',
                                            'DELETE /api/leaves/:id'
                                        ]
                                    },
                                    {
                                        category: 'Task Management',
                                        endpoints: [
                                            'POST /api/tasks (Admin)',
                                            'GET /api/tasks',
                                            'GET /api/tasks/my',
                                            'GET /api/tasks/:id',
                                            'PUT /api/tasks/:id',
                                            'DELETE /api/tasks/:id (Admin)',
                                            'POST /api/tasks/:id/comment'
                                        ]
                                    },
                                    {
                                        category: 'Announcements',
                                        endpoints: [
                                            'POST /api/announcements (Admin)',
                                            'GET /api/announcements',
                                            'PUT /api/announcements/:id (Admin)',
                                            'DELETE /api/announcements/:id (Admin)'
                                        ]
                                    },
                                    {
                                        category: 'AI Chat',
                                        endpoints: [
                                            'POST /api/chat'
                                        ]
                                    },
                                    {
                                        category: 'SuperAdmin',
                                        endpoints: [
                                            'GET /api/superadmin/companies',
                                            'GET /api/superadmin/admins',
                                            'GET /api/superadmin/company/:id',
                                            'GET /api/superadmin/stats',
                                            'DELETE /api/superadmin/company/:id',
                                            'PUT /api/superadmin/user/:id'
                                        ]
                                    }
                                ].map((group, idx) => (
                                    <div key={idx} style={{ background: '#faf5ff', padding: '1.5rem', borderRadius: '12px' }}>
                                        <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                                            {group.category}
                                        </h4>
                                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {group.endpoints.map((endpoint, i) => (
                                                <li key={i} style={{ fontSize: '0.85rem', color: '#374151', fontFamily: 'monospace', lineHeight: '1.5' }}>
                                                    {endpoint}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#111827', borderRadius: '12px' }}>
                                <p style={{ color: '#e2e8f0', fontSize: '1rem', marginBottom: '0.5rem' }}>
                                    <strong>Base URL:</strong> <code style={{ color: '#a78bfa', background: '#1e293b', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>http://localhost:5000</code> (development)
                                </p>
                                <p style={{ color: '#e2e8f0', fontSize: '1rem' }}>
                                    <strong>Production:</strong> <code style={{ color: '#a78bfa', background: '#1e293b', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>https://your-app.onrender.com</code>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Documentation */}
                <section style={{ padding: '4rem 2rem 8rem', background: 'rgba(255,255,255,0.95)' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                    background: 'white',
                                    padding: '3rem',
                                    borderRadius: '16px',
                                    border: '3px solid #e9d5ff',
                                    marginBottom: '2rem',
                                    boxShadow: '0 4px 20px rgba(123, 31, 162, 0.1)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginBottom: '2rem' }}>
                                    <div style={{
                                        width: '70px',
                                        height: '70px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, var(--primary-color), #c084fc)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <feature.icon size={36} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>
                                            {feature.title}
                                        </h2>
                                        <p style={{ fontSize: '1.15rem', color: '#4b5563', lineHeight: '1.7', fontWeight: '500' }}>
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="mobile-grid-1">
                                    {/* Details */}
                                    <div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                                            Key Features
                                        </h3>
                                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {feature.details.map((detail, i) => (
                                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                    <CheckCircle size={20} color="var(--primary-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                                    <span style={{ fontSize: '1rem', color: '#374151', lineHeight: '1.6', fontWeight: '500' }}>
                                                        {detail}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* API Example */}
                                    <div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
                                            API Reference
                                        </h3>
                                        <pre style={{
                                            background: '#1e293b',
                                            color: '#e2e8f0',
                                            padding: '1.5rem',
                                            borderRadius: '10px',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.6',
                                            overflow: 'auto',
                                            border: '2px solid #334155',
                                            fontFamily: 'monospace'
                                        }}>
                                            {feature.apiExample}
                                        </pre>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <PublicFooter />
            </div>
        </div>
    );
};

export default Documentation;
