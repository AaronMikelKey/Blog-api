var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api', async (req, res) => {
  return res.send('Received a GET HTTP method');
});

/* Redirect / to /api */
router.get('/', (req, res) => {
  res.redirect('/api')
})

module.exports = router;