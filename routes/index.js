var express = require('express');
var router = express.Router();

/* Redirect / to /api */
router.get('/', (req, res) => {
  res.redirect('/api')
})

module.exports = router;