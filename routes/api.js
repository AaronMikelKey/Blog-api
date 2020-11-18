const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

//GET API main page
router.get('/', postController.index);

//GET request for creating blog post.  Has to come before any other reqs that use ID
//router.get('/new-post', postController.newPost);

//DELETE request for single post
router.delete('/:id/delete', postController.deletePost);

//GET single blog post
router.get('/:id', postController.blogPost);

//PUT request to update single blog post
router.put('/:id', postController.updatePost);

//POST request for post comment
router.post('/:id/new-comment', postController.commentPost);

module.exports = router;