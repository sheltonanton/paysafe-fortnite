var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const sessionStoreCreator = require('./session/stores/cookie-session-store');
const store = sessionStoreCreator.getStore();

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

/**
 * Creating session middleware with express-session
 */
const sessionOptions = {
  secret: 'don#otse@ethis$',
  cookie: {}
}
app.use(session(sessionOptions)); //middleware for sending cookies with the request

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('(/*)?', function(req, res, next){
    let sessionCond = (req.baseUrl == "/api/sessions" || req.baseUrl == "/api/register") && (req.method == "POST" || req.method == "post");
    let loginCond = req.baseUrl == "/login";
    let registerCond = req.baseUrl == "/register" && (req.method == "GET" || req.method == "get");
    if(sessionCond || loginCond || registerCond){
        next();
    }else{
        if(req.session.email != null || req.session.email != undefined){
          console.log(req.baseUrl + " " + req.method);
          next();
        }else{
          res.redirect(200, '/login');
        }
    }
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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, 'public') + '/error.html');
});

module.exports = app;