const Post = require('../models/posts');
const async = require('async');

exports.index = async (req, res, next) => {
  Post.find().lean().exec((err, posts) => {
    return res.end(JSON.stringify(posts));
  });
};

exports.blogPost = async (req, res, next) => {
  Post.findById(req.params.id).lean().exec((err, post) => {
    return res.end(JSON.stringify(post));
  })
}

exports.deletePost = async (req, res, next) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    return res.json({ msg: 'Post Deleted' })
  }
  catch (error) {
    return res.json({ error: error });
  }
};