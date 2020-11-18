var express = require('express');
var router = express.Router();

const postController = require('../controllers/postController');

//index redirects to api
router.get('/', (req, res) => {
  res.redirect('/api');
});

//GET API main page
router.get('/api', postController.index);

//GET single blog post
router.get('/api/:id', postController.blogPost);

module.exports = router;