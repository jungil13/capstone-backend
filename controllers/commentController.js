const Comment = require('../models/Comments');

exports.addComment = async (req, res) => {
    const postID = req.body.postID;
    const content = req.body.content;
    const userID = req.user.id; 

    try {
        const commentID = await Comment.create(postID, content, userID);
        res.status(201).send({ message: 'Comment added successfully', commentID });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to add comment', error: err });
    }
};

exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.fetchCommentsByPost(req.params.postID);
        res.json(comments);
    } catch (err) {
        console.error("Failed to fetch comments:", err);
        res.status(500).send({ message: 'Failed to fetch comments', error: err });
    }
};


exports.getAllComments = (req, res) => {
    Comment.getAll()
        .then(comments => {
            res.json(comments);
        })
        .catch(err => {
            console.error("Error fetching comments:", err);
            res.status(500).json({ message: "Failed to retrieve comments", error: err });
        });
};


exports.editComment = (req, res) => {
  const commentID = req.params.commentID;
  const { content } = req.body;
  const commenterID = req.user.id;

  if (!content) {
    return res.status(400).json({ msg: "Comment content is required" });
  }

  Comment.updateComment(commentID, content, commenterID, (err, results) => {
    if (err) {
      console.error("Error updating comment:", err);
      return res.status(500).json({ msg: "Failed to update comment", error: err });
    }

    // Check if any rows were affected
    if (results.affectedRows === 0) {
      return res.status(404).json({ msg: "Comment not found or you are not authorized to edit this comment" });
    }

    res.json({ msg: "Comment updated successfully" });
  });
};

  
  exports.deleteComment = (req, res) => {
    const commentID = req.params.commentID;
  
    Comment.removeComment(commentID, (err) => {
      if (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json({ msg: "Failed to delete comment", error: err });
      }
      res.json({ msg: "Comment deleted successfully" });
    });
};