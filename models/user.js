const db = require('./db');
const bcrypt = require('bcryptjs');



exports.getAllUsers = (callback) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      callback(err, null);
    } else {
      const formattedResults = results.map(user => {
        const formatDate = (date) => {
          if (!date) return null;
          const d = new Date(date);
          if (isNaN(d.getTime())) return null;
          return d.toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
          }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, '$3-$1-$2 $4');
        };

        return {
          ...user,
          Birthdate: formatDate(user.Birthdate),
          created_at: formatDate(user.created_at),
          updated_at: formatDate(user.updated_at)
        };
      });
      callback(null, formattedResults);
    }
  });
};

exports.createUser = (user, callback) => {
  // Hash the user's password
  bcrypt.hash(user.Password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      callback(err);
      return;
    }

    // Prepare the query for inserting the user
    const query = `
      INSERT INTO users (
        Username, Email, Password, Fullname, 
        Contactnumber, Address, Age, Birthdate, 
        ProfilePhoto, created_at, updated_at, isVerified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), FALSE)
    `;

    // Extract profile photo URL or handle file uploads here
    const profilePhotoPath = user.ProfilePhoto ? user.ProfilePhoto : null;

    // Execute the database query
    db.query(query, [
      user.Username, 
      user.Email, 
      hash, 
      user.Fullname, 
      user.Contactnumber, 
      user.Address, 
      user.Age, 
      user.Birthdate, 
      profilePhotoPath // Use the profile photo path
    ], (error, results) => {
      if (error) {
        console.error("Error inserting user into the database:", error);
        callback(error);
        return;
      }
      // Return the new user's ID
      callback(null, results.insertId);
    });
  });
};

exports.createVerificationToken = (userId, token, callback) => {
  db.query('UPDATE users SET verificationToken = ? WHERE UserID = ?', [token, userId], (error, results) => {
    if (error) {
      console.error("Error creating verification token:", error);
    }
    callback(error, results);
  });
};

exports.verifyUserEmail = (userId, callback) => {
  db.query('UPDATE users SET isVerified = 1, verificationToken = NULL WHERE UserID = ?', [userId], (error, results) => {
    if (error) {
      console.error("Error verifying user email:", error);
    }
    callback(error, results);
  });
};

exports.findUserByEmail = (Email, callback) => {
  db.query('SELECT * FROM users WHERE Email = ?', [Email], (err, results) => {
    if (err) {
      console.error("Error finding user by email:", err);
      return callback(err, null);
    }
    callback(null, results.length > 0 ? results[0] : null);
  });
};

exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      console.error("Error comparing passwords:", err);
      return callback(err, false);
    }
    callback(null, isMatch);
  });
};

exports.findUserById = (id, callback) => {
  db.query('SELECT * FROM users WHERE UserID = ?', [id], (err, results) => {
      if (err) {
          console.error("Error finding user by ID:", err);
          callback(err, null);
      } else {
          if (results.length > 0) {
              const user = results[0];
              const formatDate = (date) => {
                  if (!date) return null;
                  const d = new Date(date);
                  if (isNaN(d.getTime())) return null;
                  return d.toLocaleString('en-US', {
                      year: 'numeric', month: '2-digit', day: '2-digit',
                      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                  }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, '$3-$1-$2 $4');
              };
              
              const formattedUser = {
                  ...user,
                  DateJoined: formatDate(user.DateJoined),
                  Birthdate: formatDate(user.Birthdate),
                  created_at: formatDate(user.created_at),
                  updated_at: formatDate(user.updated_at)
              };
              
              callback(null, formattedUser);
          } else {
              callback(null, null);
          }
      }
  });
};

exports.updateUser = (userID, updateData, callback) => {
  console.log("Received update data:", updateData);

  let query = 'UPDATE users SET ';
  let updates = [];
  let values = [];

  const allowedUpdates = [
    'Username', 'Email', 'Fullname', 'Age',
    'Contactnumber', 'Address', 'ProfilePhoto', 'UserType', 'isVerified'
  ];

  const hashPasswordAndUpdate = () => {
    if (updateData.Password) {
      bcrypt.hash(updateData.Password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Password hashing error:", err);
          return callback(err);
        }
        updateData.Password = hashedPassword; 
        processUpdate(); 
      });
    } else {
      processUpdate(); 
    }
  };

  const processUpdate = () => {
    allowedUpdates.forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== '' && updateData[key] !== null) {
        updates.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (updates.length === 0) {
      console.error("Attempt to update with no valid fields.");
      return callback(new Error("No valid fields provided for update"));
    }
    query += updates.join(', ') + ' WHERE UserID = ?';
    values.push(userID);

    console.log("Final SQL Query:", query);
    console.log("Values:", values);

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("SQL Error:", err);
        return callback(err);
      }
      callback(null, results);
    });
  };

  hashPasswordAndUpdate();
};



exports.getUserTypeById = function(userId, callback) {
  const query = 'SELECT UserType FROM users WHERE UserID = ?';
  db.query(query, [userId], function(err, result) {
      if (err) throw err;
      callback(null, result[0].UserType);
  });
};

exports.getUserCount = (callback) => {
  db.query('SELECT COUNT(*) AS count FROM users', (err, results) => {
    if (err) {
      console.error("Error fetching user count:", err);
      callback(err, null);
    } else {
      callback(null, results[0].count);
    }
  });
};


exports.updateUserStatus = (userId, status, callback) => {
  const query = "UPDATE users SET status = ? WHERE UserID = ?";
  db.query(query, [status, userId], (err, result) => {
    if (err) {
      console.error("Error updating user status:", err);
      callback(err, null);
    } else {
      console.log(`Updated status to ${status} for UserID ${userId}, affected rows: ${result.affectedRows}`);
      callback(null, result);
    }
  });
};
