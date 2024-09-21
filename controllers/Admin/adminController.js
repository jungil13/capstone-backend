// Import necessary models or utilities
const UserModel = require("../../models/user");
const PetModel = require("../../models/Pet")
const ReportModel = require("../../models/report")
const ForumModel = require("../../models/Post")
const AdminModel = require("../../models/adminmodel")


exports.dashboard = (req, res) => {

    UserModel.findAllAdmins((err, admins) => {
        if (err) {
            return res.status(500).json({ message: "Failed to retrieve admin data." });
        }
        res.render('admin/dashboard', { admins });
    });
};

exports.getUserCount = (req, res) => {
    UserModel.getUserCount((err, count) => {
      if (err) {
        res.status(500).json({ message: 'Failed to retrieve user count', error: err });
      } else {
        res.json({ count });
      }
    });
  };

  exports.getPetCount = (req, res) => {
    PetModel.getPetCount((err, count) => {
      if (err) {
        res.status(500).json({ message: 'Failed to retrieve pets count', error: err });
      } else {
        res.json({ count });
      }
    });
  };

  exports.getReportCount = (req, res) => {
    ReportModel.getReportCount((err, count) => {
      if (err) {
        res.status(500).json({ message: 'Failed to retrieve report count', error: err });
      } else {
        res.json({ count });
      }
    });
  };

  exports.getForumCount = (req, res) => {
    ForumModel.getForumCount((err, count) => {
      if (err) {
        res.status(500).json({ message: 'Failed to retrieve forum count', error: err });
      } else {
        res.json({ count });
      }
    });
  };

  exports.getApplications = (req, res) => {
    PetModel.getApplications((err, applications) => {
      if (err) {
        console.error("Failed to retrieve applications:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(applications);
    });
  };
  
  exports.updatePet = (req, res) => {
    const petId = req.params.petId;
    const updates = req.body;
  
    AdminModel.updatePet(petId, updates, (err) => {
      if (err) return res.status(500).json({ message: 'Failed to update pet.' });
      res.json({ message: 'Pet updated successfully.' });
    });
  };

  exports.deletePet = (req, res) => {
    const petId = req.params.petId;
  
    AdminModel.deletePet(petId, (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete pet.' });
      res.json({ message: 'Pet deleted successfully.' });
    });
  };

exports.getPaginatedApplications = (req, res) => {
  const page = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 10; 
  const offset = (page - 1) * limit;

  PetModel.getPaginatedApplications(limit, offset, (err, results, total) => {
    if (err) {
      console.error("Error fetching paginated applications:", err);
      return res.status(500).json({ message: "Internal server error", error: err });
    }
    const totalPages = Math.ceil(total / limit);
    res.json({
      data: results,
      currentPage: page,
      totalPages: totalPages,
      totalEntries: total
    });
  });
};

// Fetch all users
exports.getAllUsers = (req, res) => {
  UserModel.getAllUsers((err, users) => {
      if (err) {
          return res.status(500).json({ message: "Failed to retrieve users." });
      }
      res.json(users);
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.userId;
  const updates = req.body;
  const isAdmin = req.user.UserType === 'Admin';

  AdminModel.updateUser(userId, updates, isAdmin, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update user." });
    }
    res.json({ message: "User updated successfully." });
  });
};

// Delete a user
exports.deleteUser = (req, res) => {
  const userId = req.params.userId;

  UserModel.deleteUser(userId, (err, result) => {
      if (err) {
          return res.status(500).json({ message: "Failed to delete user." });
      }
      res.json({ message: "User deleted successfully." });
  });
};

module.exports = exports;
