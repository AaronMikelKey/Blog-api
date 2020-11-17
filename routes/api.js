const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

//GET API main page
router.get('/', postController.index);

//GET single blog post
router.get('/:id', postController.blogPost);

module.exports = router;