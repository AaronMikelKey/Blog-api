const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

//POST request for creating blog post. 
router.post('/new-post', postController.createPost);

//DELETE request for single post
router.delete('/:postId', postController.deletePost);

//PUT request to update single blog post
router.put('/:postId', postController.updatePost);

module.exports = router;