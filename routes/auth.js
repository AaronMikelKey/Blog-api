const express = require('express');
const router = express.Router();
const passport = require('passport');


/* POST local login. */
router.post('/login', async (req, res, next) => {
//This might need to be changed to FB auth
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      });
    }

    req.login(user, { session: false }, async (err) => {
      if (err) {
        res.send(err);
      }
      let body = {
        _id: user._id,
        username: user.username
      }
      const token = jwt.sign(JSON.stringify(body), process.env.JWT_Token);
      res.cookie('access_token', 'Bearer ' + token,
        {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: router.get("env") === "development" ? true : "none"
        })
      return res.json({ body, token });
    });
  })
    (req, res, next)
});

module.exports = router;