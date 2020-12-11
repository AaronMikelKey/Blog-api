require('dotenv').config({ path: './.env' });
const passport = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/users');
const FacebookStrategy = require('passport-facebook').Strategy

passport.use(new LocalStrategy(

  (username, password, cb) => {
    return User.findOne({ username })
      .then(user => {
        if (!user) {
          return cb(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            return cb(null, user, {
              message: 'Logged In Successfully'
            });
          } else {
            return cb(null, false, { msg: 'Incorrect password.' })
          }
        })
      })
      .catch(err => {
        return cb(err);
      });
  }
));

//Passport Strats
//FB Strat
passport.use(new FacebookStrategy({
  clientID: process.env.FB_APP_ID||process.env.FB_APP_ID2,
  clientSecret: process.env.FB_SECRET||process.env.FB_SECRET2,
  callbackURL: "https://aaron-key-blog-front-end.herokuapp.com",
  enableProof: true,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));