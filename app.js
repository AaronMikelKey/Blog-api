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
  origin: ['https://blog-front-end-test.herokuapp.com','https://facebook.com', 'facebook.com', 'https://aaron-key-blog-front-end.herokuapp.com'],
  credentials: true,
  secure: true,
  methods: 'POST,PUT,GET,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization,Security-Policy'
}
app.use(cors(corsOptions));




//No auth needed for index, just shows the list of blog posts, auth is the route for signing in.
app.use('/', index);
app.use('/auth', auth);
//Authorize through FB login SDK
app.get('/auth/facebook', passport.authenticate('facebook'))
//FB login callback route, sends the JWT for API auth
app.get('/fb-login', 
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  function(req, res) {
    if (req.user.jwtoken) {
      const token = req.user.jwtoken
      //set cookie with 1 hour lifespan.  httpOnly means only accessible byt the webserver,
      //    secure means it requires https
      res.cookie('jwtoken', token, {maxAge: 3600000, httpOnly: true, secure: true})
      //client side should handle redirect just in case they log in from a post
      res.json({success: true})
    } else {
      //client side will redirect to login just in case
      res.json({success: false})
    }
  });
//Auth needed for these since they handle POSTs, PUTs, and DELETEs
app.use('/api', passport.authenticate('JWToken'), apiRouter);
app.use('/api/user', passport.authenticate('JWToken'), userRouter);
app.use('/api/:postId/comment', passport.authenticate('JWToken'), commentRouter);



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