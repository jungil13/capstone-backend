// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { isAuthenticated, auth } = require('../middleware/auth');

const adminController = require('../controllers/Admin/adminController');



router.get('/dashboard', auth('Admin'), adminController.dashboard);
router.get('/user-count', auth('Admin'), adminController.getUserCount);
router.get('/pet-count', auth('Admin'), adminController.getPetCount);
router.get('/report-count', auth('Admin'), adminController.getReportCount);
router.get('/forum-count', auth('Admin'), adminController.getForumCount);

router.get('/applications', auth('Admin'), adminController.getApplications);
router.get('/applications', adminController.getPaginatedApplications);

router.put('/pets/:petId', isAuthenticated, auth('Admin'), adminController.updatePet);

router.get('/users', auth('Admin'), adminController.getAllUsers);
router.put('/users/:userId', isAuthenticated, auth('Admin'), adminController.updateUser);
router.delete('/users/:userId', isAuthenticated, auth('Admin'), adminController.deleteUser);

module.exports = router;
