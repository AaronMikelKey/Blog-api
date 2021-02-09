require('dotenv').config({ path: './.env' });
require('./passport');
const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const index = require('./routes/index');
const apiRouter = require('./routes/api')
const auth = require('./routes/auth');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const PORT = process.env.PORT || '3000';
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
const mongoDB = process.env.Mongo_DB;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser(process.env.JWT_Token));
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Options for CORS usage.  Change origin once project is finished
const corsOptions = {
  origin: ['https://aaron-key-blog-front-end.herokuapp.com','https://facebook.com', 'facebook.com', 'https://blog-front-end-test.herokuapp.com'],
  credentials: true,
  secure: true,
  methods: 'POST,PUT,GET,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization,Security-Policy'
}
app.use(cors(corsOptions));


// ROUTES

//No auth needed for index, just shows the list of blog posts, auth is the route for signing in.
app.use('/', index);
app.use('/auth', auth);
//Facebook Auth process, user logs in with FB and is sent auth token from API
app.get('/auth/facebook', passport.authenticate('facebook', { session: false }))
app.get('/fb-login', 
  passport.authenticate('facebook', { session: false, failureRedirect: 'https://aaron-key-blog-front-end.herokuapp.com/login' }),
  function(req, res) {
    res.redirect('https://aaron-key-blog-front-end.herokuapp.com');
  });

  

//Auth needed for these since they handle POSTs, PUTs, and DELETEs
app.use('/api', passport.authenticate('local'), apiRouter);
app.use('/api/user', passport.authenticate('local'), userRouter);
app.use('/api/:postId/comment', passport.authenticate('local'), commentRouter);

// END ROUTES


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


module.exports = app;