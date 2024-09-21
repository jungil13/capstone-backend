const db = require('../models/db');

exports.createApplication = (applicationData, callback) => {
    const { UserID, PetID, PetExperience, HomeEnvironment, OtherPets, ChildrenAtHome, ReasonForAdoption } = applicationData;
    const query = `
        INSERT INTO applications (UserID, PetID, PetExperience, HomeEnvironment, OtherPets, ChildrenAtHome, ReasonForAdoption)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [UserID, PetID, PetExperience, HomeEnvironment, OtherPets, ChildrenAtHome, ReasonForAdoption], callback);
};

exports.findByOwnerId = (ownerId, callback) => {
    const query = `
        SELECT a.*, p.PetName, p.PetPhoto,
               u.FullName AS ApplicantName, u.Email, u.Contactnumber, u.Address, u.ProfilePhoto
        FROM applications a
        JOIN pets p ON a.PetID = p.PetID
        JOIN users u ON a.UserID = u.UserID
        WHERE p.OwnerID = ?
    `;
    db.query(query, [ownerId], callback);
};

exports.updateStatus = (applicationId, status, callback) => {
    const query = "UPDATE applications SET Status = ? WHERE ApplicationID = ?";
    db.query(query, [status, applicationId], callback);
};

exports.getApplicationsByOwnerId = (ownerId, callback) => {
    const query = `
        SELECT 
            a.ApplicationID,
            a.UserID,
            a.PetID,
            a.PetExperience,
            a.HomeEnvironment,
            a.OtherPets,
            a.ChildrenAtHome,
            a.ReasonForAdoption,
            a.Status,
            a.DateSubmitted,
            p.PetName,
            p.PetPhoto,
            u.FullName AS ApplicantName,
            u.Email AS ApplicantEmail,
            u.Address AS ApplicantAddress,
            u.Contactnumber AS ApplicantContactnumber,
            u.ProfilePhoto AS ApplicantProfilePhoto
        FROM applications a
        JOIN pets p ON a.PetID = p.PetID
        JOIN users u ON a.UserID = u.UserID
        WHERE p.OwnerID = ?
    `;
    db.query(query, [ownerId], callback);
};

exports.getAllApplications = (callback) => {
    // Constructing a SQL query to join applications, users, and pets tables
    const query = `
        SELECT 
            a.ApplicationID,
            a.UserID,
            a.PetID,
            a.PetExperience,
            a.HomeEnvironment,
            a.OtherPets,
            a.ChildrenAtHome,
            a.ReasonForAdoption,
            a.Status,
            a.DateSubmitted,
            p.PetName,
            p.PetPhoto,
            u.FullName AS ApplicantName,
            u.Email AS ApplicantEmail,
            u.Address AS ApplicantAddress,
            u.ContactNumber AS ApplicantContactnumber,
            u.ProfilePhoto AS ApplicantProfilePhoto
        FROM applications a
        JOIN users u ON a.UserID = u.UserID
        JOIN pets p ON a.PetID = p.PetID
    `;
    db.query(query, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            // Modify results to handle JSON parsing for PetPhoto
            const modifiedResults = results.map(result => {
                if (result.PetPhoto) {
                    try {
                        result.PetPhoto = JSON.parse(result.PetPhoto.replace(/\\\\/g, "/"));
                    } catch (e) {
                        console.error('Failed to parse PetPhoto:', e);
                    }
                }
                return result;
            });
            callback(null, modifiedResults);
        }
    });
};