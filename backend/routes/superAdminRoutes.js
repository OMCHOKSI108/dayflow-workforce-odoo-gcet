const express = require('express');
const router = express.Router();
const { protect, superAdmin } = require('../middleware/authMiddleware');
const {
    getAllCompanies,
    getAllAdmins,
    getCompanyDetails,
    getSystemStats,
    deleteCompany,
    updateAnyUser
} = require('../controllers/superAdminController');

// All routes require SuperAdmin authentication
router.use(protect);
router.use(superAdmin);

// Company management
router.get('/companies', getAllCompanies);
router.get('/companies/:companyName', getCompanyDetails);
router.delete('/companies/:companyName', deleteCompany);

// Admin management
router.get('/admins', getAllAdmins);

// System statistics
router.get('/stats', getSystemStats);

// User management across companies
router.put('/users/:id', updateAnyUser);

module.exports = router;
