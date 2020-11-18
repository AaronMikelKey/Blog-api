var express = require('express');
var router = express.Router();

const postController = require('../controllers/postController');

//GET API main page
router.get('/api', postController.index);

module.exports = router;