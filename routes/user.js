const express = require('express')
const router = express.Router()
const async = require('async')
const User = require('../models/users')
const Comment = require('../models/comments')

//User page
router.get('/:userId', async (req, res, next) => {
  try {
    async.parallel({ 
      user: (cb) => {
        User.findById(req.params.userId).exec(cb)
      },
      comment_list: (cb) => {
        Comment.find({ user: req.params.userId }).exec(cb)
      },
    }, (error, results) => {
      if (error) { return next(error) }
      return res.json(results)
    })
  }
  catch (error) {
    return res.status(404).json({ error: error })
  }
});
 /* Could add this if we wanted to be able to edit users, but for now all they use is a username and password 

router.put('/:userId', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`,);
});

Could also add this in case we want to let users delete themselves, but need to decide if we want to delete the comments they've posted as
well or just change the username on those comments to 'deleted' or something
 
router.delete('/:userId', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`,);
});
*/
module.exports = router;