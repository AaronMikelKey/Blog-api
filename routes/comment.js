const express = require('express');
const router = express.Router();

const comment = require('../controllers/commentController');

//PUT request for comment
router.put('/:id/update', comment.commentUpdate)

module.exports = router;