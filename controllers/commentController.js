const Comment = require('../models/comments');
const async = require('async');

exports.commentPost = async (req, res) => {
  try {
    let newComment = new Comment({
      post: req.params.id,
      text: req.body.text,
      user: req.user._id
    }).save();

    return res.json({ msg: 'Comment Posted', post: newComment.post })
  } catch (error) {
    return res.json({ error: error })
  }
}