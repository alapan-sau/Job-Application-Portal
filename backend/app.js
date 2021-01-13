var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');


var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/userRouter');

var app = express();

app.use(passport.initialize());

// Connect to Mongodb
const url = 'mongodb://localhost:27017/jobPortal';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected to database successfully!\n");
}, (err) => {
  console.log(err);
})


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
