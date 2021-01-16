var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
const cors = require('cors');
var userRouter = require('./routes/userRouter');
var recruiterRouter = require('./routes/recruiterRouter');
var jobRouter = require('./routes/jobRouter');
var applicationRouter = require('./routes/applicationRouter');
var app = express();


// Connect to the MongoDB
const url = 'mongodb://localhost:27017/jobPortal';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected to database successfully!\n");
}, (err) => {
  console.log(err);
})

// Middlewares
app.use(cors());
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/users', userRouter);
app.use('/recruiters', recruiterRouter);
app.use('/jobs', jobRouter);
app.use('/applications', applicationRouter);

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
