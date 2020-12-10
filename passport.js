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
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_SECRET,
  callbackURL: "/return",
  enableProof: true,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));
//AuthHeader if present
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_Token
},
  async function (jwtPayload, cb) {

    //find the user in db if needed
    try {
      const user = await User.findById(jwtPayload.user._id);
      return cb(null, jwtPayload);
    } catch (err) {
      return cb(err);
    }
  }
));
//Cookie auth
passport.use(new JWTStrategy({
  jwtFromRequest: req=>req.cookies.access_token,
  secretOrKey: process.env.JWT_Token
},
async function (jwtPayload, cb) {

  //find the user in db if needed
  try {
    const user = await User.findById(jwtPayload.user._id);
    return cb(null, jwtPayload);
  } catch (err) {
    return cb(err);
  }
}
))

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});