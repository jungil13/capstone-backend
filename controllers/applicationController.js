const Application = require('../models/applicationModel');
exports.submitApplication = (req, res) => {
    const applicationData = {
        UserID: req.user.id,  // Assuming user ID is available from session or token
        PetID: req.body.petId,
        PetExperience: req.body.petExperience,
        HomeEnvironment: req.body.homeEnvironment,
        OtherPets: req.body.otherPets,
        ChildrenAtHome: req.body.childrenAtHome,
        ReasonForAdoption: req.body.reasonForAdoption
    };

    Application.createApplication(applicationData, (error, result) => {
        if (error) {
            console.error("Error submitting application:", error);
            return res.status(500).json({ message: "Error submitting application", error });
        }
        res.status(201).json({ message: "Application submitted successfully", applicationId: result.insertId });
    });
};

exports.viewOwnerApplications = (req, res) => {
    const { ownerId } = req.params;
    Application.findByOwnerId(ownerId, (error, applications) => {
        if (error) {
            return res.status(500).json({ message: "Error retrieving applications", error });
        }
        if (applications.length === 0) {
            return res.status(404).json({ message: "No applications found for this owner" });
        }
        res.json({ applications });
    });
};

exports.updateApplicationStatus = (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body; // Expected to be 'approved' or 'declined'
    Application.updateStatus(applicationId, status, (error, result) => {
        if (error) {
            return res.status(500).json({ message: "Error updating application status", error });
        }
        res.json({ message: "Application status updated successfully" });
    });
};

exports.getMyPetsApplications = (req, res) => {
    const userId = req.user.id;
    Application.getApplicationsByOwnerId(userId, (err, applications) => {
        if (err) {
            console.error('Error fetching applications:', err);
            return res.status(500).json({ message: 'Failed to fetch applications due to an internal error.', error: err });
        }
        if (applications.length === 0) {
            return res.status(404).json({ message: 'No applications found for your pets.' });
        }
        res.json({ applications });
    });
};
exports.getAllApplications = (req, res) => {
    Application.getAllApplications((err, applications) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching applications', error: err });
        } else {
            res.status(200).json(applications);
        }
    });
};