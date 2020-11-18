const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const postController = require('../controllers/postController');
const comment = require('../routes/comment')

//GET request for creating blog post.  Has to come before any other reqs that use ID
//router.get('/new-post', postController.newPost);

//DELETE request for single post
router.delete('/:postId/delete', postController.deletePost);

//PUT request to update single blog post
router.put('/:postId', postController.updatePost);

module.exports = router;