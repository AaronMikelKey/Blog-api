const express = require('express');
const router  = express.Router();
const app = express();
const jwt      = require('jsonwebtoken');
const passport = require('passport');


/* POST login. */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            let body = {
              _id: user._id,
              username: user.username
            }
            const token = jwt.sign({user: body}, process.env.JWT_Token);
            res.cookie('access_token', 'Bearer ' + token, 
              { 
                path: '/',
                httpOnly: true,
                secure: false,
                sameSite: router.get("env") === "development" ? true : "none"
                })
            console.log(res.cookie);
            return res.json({user, token});
        });
    })
    (req, res);

});

module.exports = router;