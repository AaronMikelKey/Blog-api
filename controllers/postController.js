const Post = require('../models/posts');
const Comment = require('../models/comments');
const async = require('async');
const { check,validationResult } = require('express-validator');

//Display list of all posts
exports.index = async (req, res, next) => {
  Post.find().lean().exec((err, posts) => {
    return res.end(JSON.stringify(posts));
  });
};

//Display single post
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

//Delete single post
exports.deletePost = async (req, res, next) => {
  try {
    if (req.user.username.toString() !== 'AaronMikelKey' ) { return res.status(401).json({ msg: 'Permission Denied' }); }
    await Post.deleteOne({ _id: req.params.postId });
    return res.json({ msg: 'Post Deleted' })
  }
  catch (error) {
    return res.json({ error: error });
  }
};

// Error here.  THIS SHIT DON'T WORK
//Update single post
exports.updatePost = [

  check('title')
  .trim()
  .optional()
  .escape(),
  check('blogContent')
  .trim()
  .optional()
  .escape(),
  check('tags')
  .trim()
  .optional()
  .escape(),

async (req,res,) => {
  try {
    validationResult(req).throw()

    if (req.user.username.toString() !== 'AaronMikelKey' ) { console.log('username err'); return res.response(401).json({ msg: 'Permission Denied' }); }
    await Post.findById(req.params.postId, (err, post) => {
      if (err) { return res.json({ error: err }); }

      post.title = (typeof req.body.title==='undefined') ? '' : req.body.title;
      post.blogContent = (typeof req.body.blogContent==='undefined') ? '' : req.body.blogContent;
      post.tags = (typeof req.body.tags==='undefined') ? [] : req.body.tags;
      post.save()
    });
  }
  catch (error) {
    console.log('catch')
    return res.status(404).json({ error: error })
  }
}
]

//Create single post
exports.createPost = [

  check('title')
  .trim()
  .isLength({ min: 1 }).withMessage('Title too short')
  .isLength({ max: 100 }).withMessage('Title too long')
  .escape(),
  check('blogContent')
  .trim()
  .isLength({ min: 1 }).withMessage('Type in some content.')
  .escape(),
  check('tags')
  .optional()
  .trim()
  .escape(),


async (req, res) => {
  try {
    validationResult(req).throw()
    if (req.user.username.toString() !== 'AaronMikelKey') { return res.status(401).json({ msg: 'Permission denied.'}) }
    let newPost = new Post({
      title: req.body.title,
      blogContent: req.body.blogContent,
      tags: (typeof req.body.tags==='undefined') ? [] :req.body.tags
    }).save()

    return res.json({ msg: 'Posted new post' })
  }
  catch (error) {
    console.log(req.user.username)
    return res.status(404).json({ error: error })
  }
}
]