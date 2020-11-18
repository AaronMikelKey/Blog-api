const express = require('express');
const router  = express.Router();

const bcrypt = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const passport = require('passport');


/* POST login. */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {session: false}, (err, user, info) => {
        console.log(err);
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
            const body = {
              _id: user._id,
              username: user.username
            }

            const token = jwt.sign({user: body}, process.env.JWT_Token);
            res.cookie('auth', token, 
              { 
                path: '/',
                secure: true,
                httpOnly: true,
                sameSite: "none"
                });
            return res.json({user, token});
        });
    })
    (req, res);

});

module.exports = router;