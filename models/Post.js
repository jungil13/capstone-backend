const db = require('../models/db');

class Post {
  static fetchAllByCategory(categoryID) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, 
               u.FullName AS AuthorFullName, 
               u.ProfilePhoto AS AuthorProfilePhoto, 
               c.Name AS CategoryName
        FROM forum_posts p
        JOIN Users u ON p.AuthorID = u.UserID
        JOIN Categories c ON p.CategoryID = c.CategoryID
        WHERE p.CategoryID = ?
        ORDER BY p.PostDate DESC
      `;
      db.query(sql, [categoryID], (err, results) => {
        if (err) return reject(err);
  
        // Format PostDate
        const formattedResults = results.map(post => {
          return {
            ...post,
            PostDate: post.PostDate ? new Date(post.PostDate).toLocaleString('en-US', {
              month: 'long',
              day: '2-digit',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }) : null
          };
        });
        
        resolve(formattedResults);
      });
    });
  }
  
  
  static fetchAllByID(postID) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT p.*, 
               u.FullName AS AuthorFullName, 
               u.ProfilePhoto AS AuthorProfilePhoto, 
               c.Name AS CategoryName
        FROM forum_posts p
        JOIN Users u ON p.AuthorID = u.UserID
        JOIN Categories c ON p.CategoryID = c.CategoryID
        WHERE p.PostID = ?
        ORDER BY p.PostDate DESC
      `;
      db.query(sql, [postID], (err, results) => {
        if (err) return reject(err);
  
        // Format PostDate
        const formattedResults = results.map(post => {
          return {
            ...post,
            PostDate: post.PostDate ? new Date(post.PostDate).toLocaleString('en-US', {
              month: 'long',
              day: '2-digit',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            }) : null
          };
        });
  
        resolve(formattedResults);
      });
    });
  }
  
  
      static create(userID, categoryID, title, content) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO forum_posts (AuthorID, CategoryID, Title, Content) VALUES (?, ?, ?, ?)';
            db.query(sql, [userID, categoryID, title, content], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    }

    static getAll() {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT 
            p.*, 
            u.FullName AS AuthorFullName,
            c.Name AS CategoryName
          FROM forum_posts p
          JOIN Users u ON p.AuthorID = u.UserID
          JOIN Categories c ON p.CategoryID = c.CategoryID
          ORDER BY p.PostDate DESC
        `;
        db.query(query, (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          const formattedResults = results.map(post => {
            return {
              ...post,
              PostDate: post.PostDate ? new Date(post.PostDate).toLocaleString('en-US', {
                month: 'long', 
                day: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
              }) : post.PostDate
            };
          });
  
          resolve(formattedResults);
        });
      });
    }
  

      static getForumCount = (callback) => {
        db.query('SELECT COUNT(*) AS count FROM forum_posts', (err, results) => {
          if (err) {
            console.error("Error fetching forum count:", err);
            callback(err, null);
          } else {
            callback(null, results[0].count);
          }
        });
      };
}

module.exports = Post;
