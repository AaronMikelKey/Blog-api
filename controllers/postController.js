const Post = require('../models/posts');
const async = require('async');

exports.index = async function(req, res, next) {
  Post.find().lean().exec(function(err, posts) {
    return res.end(JSON.stringify(posts));
  });
};