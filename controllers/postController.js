const Post = require('../models/posts');
const Comment = require('../models/comments');
const async = require('async');

exports.index = async (req, res, next) => {
  Post.find().lean().exec((err, posts) => {
    return res.end(JSON.stringify(posts));
  });
};

exports.blogPost = async (req, res, next) => {
  async.parallel({
    post: (callback) => {
      Post.findById(req.params.postId)
        .lean()
        .exec(callback);
    },
    comment: (callback) => {
      Comment.find({ post: req.params.postId })
        .lean()
        .populate('user', 'username')
        .exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.post === null) {
      let err = new Error('Post not found');
      err.status = 404;
      return next(err);
    }
    return res.end(JSON.stringify(results));
  });
};

exports.deletePost = async (req, res, next) => {
  try {
    await Post.deleteOne({ _id: req.params.postId });
    return res.json({ msg: 'Post Deleted' })
  }
  catch (error) {
    return res.json({ error: error });
  }
};
// Error here since /api/:id doesn't require auth.  Will have to work on tomorrow.
exports.updatePost = async (req,res) => {
  try {
    console.log(req.user);
    if (!req.user.me) { return res.json({ msg: 'Permission Denied' }); }
    await Post.findById(req.params.postId, (err, post) => {
      if (err) { return res.json({ error: err }); }
      post.title = req.body.title;
      post.content = req.body.content;
      post.save( (err, post) => {
        if (err) { return res.json({ error: err}); }
        return res.json({ post, msg: 'Post Updated' });
      });
    });
  }
  catch (error) {
    return res.status(404).json({ error: error })
  }
}

exports.commentPost = async (req, res) => {
  try {
    let newComment = new Comment({
      post: req.param.postId,
      text: req.body.text,
      user: req.user._id
    }).save();

    return res.json({ msg: 'Comment Posted' })
  } catch (error) {
    return res.status(404).json({ error: error })
  }
}