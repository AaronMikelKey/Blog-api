require('dotenv').config({ path: './.env' });
const passport = require('passport');
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken')
const User = require('./models/users');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs');


//Passport Strats
//Local Strategy for login
passport.use(new LocalStrategy(
  async (username, password, cb) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return cb(null, user, {
            message: 'Logged In Successfully'
          });
        } else {
          return cb(null, false, { msg: 'Incorrect username or password.' });
        }
      });
    } catch (err_1) {
      return cb(err_1);
    }
  }
));

//FB Strategy for login
passport.use(new FacebookStrategy({
  clientID: process.env.FB_APP_ID || process.env.FB_APP_ID2,
  clientSecret: process.env.FB_SECRET || process.env.FB_SECRET2,
  //WHEN DONE TESTING THIS NEEDS TO BE CHANGED TO OTHER URL
  //Local auth route.  This route uses JWT Strat to log user in locally
  callbackURL: "https://blog-front-end-test.herokuapp.com/fb-login",
  enableProof: true,
  profileFields: ['id']
},
  function (accessToken, refreshToken, profile, cb) {
    //Find user if they exist
    User.find({ facebook: { id : profile.id } }, function (err, user) {
      //If user does exist in local DB
      if (user) {
        //Set user facebook token for facebooks graph API calls
        user.facebook.token = accessToken
        //Set and send JSON web token to local auth route
        var token = jwt.sign(user, process.env.JWT_Token)
        user.jwtoken = token
      }
      return cb(err, user);
    });
  }
));

//JWT Strategy for auth from cookie
passport.use('JWToken', new JWTStrategy({
  secretOrKey: process.env.JWT_Token,
  jwtFromRequest: req => req.cookies.jwtoken
}, function (jwt_payload, done) {
  User.find({ _id: jwt_payload.user._id }, function (err, user) {
    if (err) {
      return done(err)
    }
    if (user) {
      user.jwtoken = jwt_payload
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
}))

//Google Strategy for login
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  //WHEN DONE TESTING THIS NEEDS TO BE CHANGED TO OTHER URL
  //Local auth route.  This route uses JWT Strat to log user in locally
  callbackURL: "https://blog-front-end-test.herokuapp.com/google-login"
},
  function (accessToken, refreshToken, profile, cb) {
    //Find user if they exist
    User.find({ google: { id : profile.id } }, function (err, user) {
      //If user does exist in local DB
      if (user) {
        //Set user google token in case we need to use it later
        user.google.token = accessToken
        //Set and send JSON web token to local auth route
        var token = jwt.sign(user, process.env.JWT_Token)
        user.jwtoken = token
      }
      return cb(err, user);
    });
  }
));