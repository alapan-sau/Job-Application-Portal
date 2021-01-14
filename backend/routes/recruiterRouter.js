const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Recruiters = require('../model/recruiters');
const authenticate = require('../authenticate')
const recruiterRouter = express.Router();

recruiterRouter.use(bodyParser.json());


recruiterRouter.route('/')
.get((req,res,next) => {
    Recruiters.find({})
    .then((recruiter) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(recruiter);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Recruiter');
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Recruiter');
})

.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Recruiter');
});


recruiterRouter.post('/signup', (req, res, next) => {
    var password = req.body.password;
    delete req.body.password;
    Recruiters.register(new Recruiters(req.body),
    password, (err, recruiter) => {
        if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
        }
        else {
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Registration Successful!'});
            });
        }
    });
 });

recruiterRouter.post('/login', passport.authenticate('recruiterLocal'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


module.exports = recruiterRouter;