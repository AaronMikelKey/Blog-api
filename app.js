require('dotenv').config({ path: './main.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const User = require('./models/user');

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.Mongo_DB;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true,  });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use('/auth', auth);


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, 
function (email, password, cb) {
  //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
  return User.findOne({email, password})
     .then(user => {
         if (!user) {
             return cb(null, false, {message: 'Incorrect email or password.'});
         }
         return cb(null, user, {message: 'Logged In Successfully'});
    })
    .catch(err => cb(err));
}
));