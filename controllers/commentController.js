const Comment = require('../models/comments')
const async = require('async')
const { check, validationResult } = require('express-validator')

exports.commentPost = [

  check('text')
    .trim()
    .isLength({ min: 1 }).withMessage('Comments must not be empty')
    .escape(),

  async (req, res) => {
    try {
      validationResult(req).throw()

      let newComment = new Comment({
        post: req.params.commentId,
        text: req.body.text,
        user: req.user._id
      }).save()

      return res.json({ msg: 'Comment Posted', post: newComment.post })
    } catch (error) {
      return res.status(404).json({ error: error })
    }
  }
]

exports.commentUpdate = [

  check('text')
    .trim()
    .isLength({ min: 1 }).withMessage('Comments must not be empty')
    .escape(),

  async (req, res) => {
    try {
      validationResult(req).throw()

      Comment.findById(req.params.commentId, (err, comment) => {
        if (err) { return res.json({ error: err }) }
        //Must compare using .toString()
        if (comment.user.toString() !== req.user._id.toString()) { return res.status(401).json({ msg: 'You can only edit your own comments.' }) }
        
        comment.text = req.body.text;
        comment.save((err, comment) => {
          if (err) { return res.json({ error: err }) }
          return res.json(comment)
        })
      })
    } catch (error) {
      return res.status(404).json({ error: error })
    }
  }
]

exports.commentDelete = async (req, res, next) => {
  try {
    await Comment.findById(req.params.commentId, (error, comment) => {
      if (error) { return next(error) }
      if (comment.user !== req.user._id) { return res.status(401).json({ msg: 'You can only delete your own comments.' }) }
      comment.remove()
    })
  }
  catch (error) {
    return res.status(404).json({ error: error })
  }
}