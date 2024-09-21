const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Route to update the status of an application
router.patch('/applications/:applicationId/status', applicationController.updateApplicationStatus);

module.exports = router;
