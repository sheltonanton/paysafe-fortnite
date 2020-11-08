var createError = require('http-errors');
var express = require('express');
var compression = require('compression');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');

var apiRouter = require('./routes/api');
var app = express();

/**
 * Creating session middleware with express-session
 */
const sessionOptions = {
  key: "fproiim",
  secret: 'don#otse@ethis$',
  cookie: {}
}
app.use(session(sessionOptions)); //middleware for sending cookies with the request
app.use(compression({filter: function(req, res){
  if(req.headers['x-no-compression']){
    return false;
  }
  return compression.filter(req, res);
}}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//if there is no server session, send it to login page
let sessionChecker = (req, res, next) => {

  let isSessionAPI = (req.baseUrl == '/api/sessions' || req.baseUrl == '/api/register') &&
                      (req.method == "POST" || req.metohd == "POST");
  let isLoginAPI = req.baseUrl == '/login';
  let isRegisterAPI = req.baseUrl == '/register' && (req.method == "GET" || req.method == "get");
  if(isSessionAPI || isLoginAPI || isRegisterAPI){
    next();
  }else{
    //check if the session is still present or not for that request
    if(req.session && req.session.email && req.cookies && req.cookies['fproiim']){
      next();
    }else{
      res.status(403).json({error: "NOT AUTHORIZED", message: "User is not authorized"});
    }
  }
}

app.use('(/*)?', sessionChecker, function(req, res, next){
    next();
});

app.use('/api', apiRouter);
app.get('(/*)?', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({error: "SERVER ERROR", message: "There is an internal server error"});
});

module.exports = app;