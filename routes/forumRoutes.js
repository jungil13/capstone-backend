const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/posts/:categoryID', postController.getPostsByCategory);
router.get('/posts/id/:postID', postController.getPostsByID);
router.post('/posts', isAuthenticated, postController.createPost);
router.post('/comments', isAuthenticated, commentController.addComment);
router.get('/comments/post/:postID', isAuthenticated, commentController.getCommentsByPost);
router.get('/comments', isAuthenticated, commentController.getAllComments);

router.get('/posts', postController.getAllPosts);

router.put('/comments/:commentID', isAuthenticated, commentController.editComment);
router.delete('/comments/:commentID', isAuthenticated, commentController.deleteComment);

module.exports = router;
