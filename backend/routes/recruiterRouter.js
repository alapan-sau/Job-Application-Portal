const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Recruiters = require('../model/recruiters');
const authenticate = require('../authenticate')
const recruiterRouter = express.Router();

recruiterRouter.use(bodyParser.json());

// GET all RECRUITERS DEV
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


// SIGNUP a new RECRUITER
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
            // passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Registration Successful!'});
            // });
        }
    });
 });


// LOGIN a new RECRUITER
recruiterRouter.post('/login', passport.authenticate('recruiterLocal'), (req, res) => {
    // console.log(req.user);
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


// GET info about SELF
recruiterRouter.route('/me')
.get(authenticate.verifyRecruiter,(req,res,next) => {
    Recruiters.findById(req.user._id)
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err))
})

// UPDATE SELF
.put(authenticate.verifyRecruiter,(req,res,next)=>{
    Recruiters.findByIdAndUpdate(req.user._id,{$set: req.body},{new: true})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    },(err) => next(err))
    .catch((err)=>next(err))
});

module.exports = recruiterRouter;