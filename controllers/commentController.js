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
};

exports.commentUpdate = async (req, res) => {
  try {
    Comment.findById(req.params.id, (err, comment) => {
      if (err) { return res.json({ error: err }); }
      comment.text = req.body.text;
      comment.save( (err, comment) => {
        if (err) { return res.json({error:err}); }
        return res.json(comment);
      });
    });
  } catch (error) {
    return res.json({ error: error });
  };
};