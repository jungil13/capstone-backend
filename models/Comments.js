const db = require('../models/db');

class Comment {
    static create(postID, content, userID) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO forum_comments (PostID, CommenterID, Content) VALUES (?, ?, ?)';
            db.query(sql, [postID, userID, content], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    }

    static fetchCommentsByPost(postID) {
      return new Promise((resolve, reject) => {
        const sql = `
          SELECT c.*, 
                 u.FullName AS CommenterFullName, 
                 u.ProfilePhoto AS CommenterProfilePhoto  -- Include ProfilePhoto
          FROM forum_comments c
          JOIN Users u ON c.CommenterID = u.UserID
          WHERE c.PostID = ?
          ORDER BY c.CommentDate DESC
        `;
        db.query(sql, [postID], (err, results) => {
          if (err) return reject(err);
          
          const formattedResults = results.map(comment => {
            return {
              ...comment,
              CommentDate: new Date(comment.CommentDate).toLocaleString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })
            };
          });
    
          resolve(formattedResults);
        });
      });
    }
    

      static getAll() {
        return new Promise((resolve, reject) => {
          const query = `
            SELECT 
              fc.*, 
              u.FullName AS CommenterName,
              u.ProfilePhoto AS CommenterProfilePhoto  -- Include ProfilePhoto
            FROM 
              forum_comments fc
            JOIN 
              users u ON fc.CommenterID = u.UserID
            ORDER BY 
              fc.CommentDate DESC
          `;
          db.query(query, (err, results) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(results);
          });
        });
      }
      
      static updateComment(commentID, content, commenterID, callback) {
        const sql = 'UPDATE forum_comments SET Content = ? WHERE CommentID = ? AND CommenterID = ?';
        db.query(sql, [content, commentID, commenterID], (err, results) => {
          if (err) return callback(err);
      
          callback(null, results);
        });
      }
      
    
      static removeComment(commentID, callback) {
        const sql = 'DELETE FROM forum_comments WHERE CommentID = ?';
        db.query(sql, [commentID], (err, results) => {
          if (err) return callback(err);
          callback(null, results);
        });
      }
    }

module.exports = Comment;
