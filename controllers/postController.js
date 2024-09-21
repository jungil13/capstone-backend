const Post = require('../models/Post');

exports.getPostsByCategory = async (req, res) => {
    try {
        const posts = await Post.fetchAllByCategory(req.params.categoryID);
        res.json(posts);
    } catch (err) {
        res.status(500).send({ message: 'Failed to fetch posts', error: err });
    }
};

exports.getPostsByID = async (req, res) => {
  try {
      const post = await Post.fetchAllByID(req.params.postID);
      if (post.length === 0) {
          return res.status(404).send({ message: 'Post not found' });
      }
      res.json(post[0]);
  } catch (err) {
      res.status(500).send({ message: 'Failed to fetch post', error: err });
  }
};


exports.createPost = async (req, res) => {
    const { categoryID, title, content } = req.body;
    if (!title || !content) {
      return res.status(400).send({ message: 'Title and content cannot be null' });
    }
  
    try {
      const userID = req.user.id; 
      const postID = await Post.create(userID, categoryID, title, content);
      res.status(201).send({ message: 'Post created successfully', postID });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Failed to create post', error: err });
    }
  };

  exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAll();
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};