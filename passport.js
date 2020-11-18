require('dotenv').config({ path: './.env' });
const passport = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/users');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},

  (email, password, cb) => {
    //Assume there is a DB module pproviding a global UserModel
    return User.findOne({ email })
      .then(user => {
        if (!user) {
          return cb(null, false, { message: 'Incorrect email.' });
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

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_Token
},
  async function (jwtPayload, cb) {

    //find the user in db if needed
    try {
      const user = await User.findById(jwtPayload.user._id);
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));