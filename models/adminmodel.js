const db = require('../models/db'); // Adjust path as needed
const bcrypt = require('bcrypt');

class AdminModel {
  // Fetch all users with optional search
  static fetchUsers(searchQuery = '', callback) {
    let query = 'SELECT * FROM users';
    const values = [];

    if (searchQuery) {
      query += ' WHERE Username LIKE ? OR Email LIKE ?';
      values.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    db.query(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  // Create a new user
  static createUser(userData, callback) {
    bcrypt.hash(userData.Password, 10, (err, hash) => {
      if (err) return callback(err);

      const query = `
        INSERT INTO users (Username, Email, Password, Fullname, Contactnumber, Address, Age, Birthdate, UserType)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userData.Username,
        userData.Email,
        hash,
        userData.Fullname,
        userData.Contactnumber,
        userData.Address,
        userData.Age,
        userData.Birthdate,
        userData.UserType,
      ];

      db.query(query, values, (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
      });
    });
  }

  // Update an existing user
  static updateUser(userId, updateData, isAdmin, callback) {
    let query = 'UPDATE users SET ';
    const updates = [];
    const values = [];

    const allowedUpdates = ['Username', 'Email', 'Fullname', 'Contactnumber', 'Address', 'Age', 'Birthdate', 'UserType','isVerified'];

    allowedUpdates.forEach((key) => {
      if (updateData[key] !== undefined && updateData[key] !== '') {
        updates.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (updateData.Password) {
      bcrypt.hash(updateData.Password, 10, (err, hash) => {
        if (err) return callback(err);
        values.push(hash);
        updates.push('Password = ?');
      });
    }

    if (updates.length === 0) {
      return callback(new Error('No valid fields provided for update'));
    }

    query += updates.join(', ') + ' WHERE UserID = ?';
    values.push(userId);

    db.query(query, values, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  // Delete a user
  static deleteUser(userId, callback) {
    const query = 'DELETE FROM users WHERE UserID = ?';
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static updatePet(petId, fields, callback) {
    let setClause = "SET ";
    const values = [];
    let isUpdateNeeded = false; // Track if there are updates
  
    // Append fields to update
    if (fields.PetName) {
      setClause += "PetName = ?, ";
      values.push(fields.PetName);
      isUpdateNeeded = true;
    }
    if (fields.Type) {
      setClause += "Type = ?, ";
      values.push(fields.Type);
      isUpdateNeeded = true;
    }
    if (fields.Breed) {
      setClause += "Breed = ?, ";
      values.push(fields.Breed);
      isUpdateNeeded = true;
    }
    if (fields.Markings) {
      setClause += "Markings = ?, ";
      values.push(fields.Markings);
      isUpdateNeeded = true;
    }
    if (fields.Species) {
      setClause += "Species = ?, ";
      values.push(fields.Species);
      isUpdateNeeded = true;
    }
    if (fields.Sex) {
      setClause += "Sex = ?, ";
      values.push(fields.Sex);
      isUpdateNeeded = true;
    }
    if (fields.Status) {
      setClause += "Status = ?, ";
      values.push(fields.Status);
      isUpdateNeeded = true;
    }
    if (fields.Description) {
      setClause += "Description = ?, ";
      values.push(fields.Description);
      isUpdateNeeded = true;
    }
    if (fields.PetPhoto !== undefined) {
      setClause += "PetPhoto = ?, ";
      values.push(JSON.stringify(fields.PetPhoto)); // Stringify if it's an array
      isUpdateNeeded = true;
    }
    if (fields.VaccinationCertificate !== undefined) {
      setClause += "VaccinationCertificate = ?, ";
      values.push(JSON.stringify(fields.VaccinationCertificate)); // Stringify if it's an array
      isUpdateNeeded = true;
    }
  
    if (!isUpdateNeeded) {
      return callback(null, { message: "No fields to update" });
    }
    
    // Remove the last comma and space
    setClause = setClause.slice(0, -2);
  
    const query = `
      UPDATE pets
      ${setClause}
      WHERE PetID = ? AND OwnerID = ?
    `;
  
    values.push(petId, fields.OwnerID); // Ensure OwnerID is included
  
    console.log("Update query:", query);
    console.log("Update values:", values);
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return callback(err);
      }
      callback(null, result);
    });
  }  

}


module.exports = AdminModel;
