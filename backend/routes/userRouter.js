const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Users = require('../model/users');
const authenticate = require('../authenticate');
const Applications = require('../model/applications');
const userRouter = express.Router();

userRouter.use(bodyParser.json());

// GET all USERS DEV
userRouter.route('/')
.get((req,res,next) => {
    Users.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
})

// SIGNUP as USER
userRouter.post('/signup', (req, res, next) => {
    var password = req.body.password;
    delete req.body.password;
    req.body.totalApplications = 0;
    Users.register(new Users(req.body),
    password, (err, user) => {
        if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        console.log(err); // dev
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


// LOGIN as USER
userRouter.post('/login', passport.authenticate('userLocal'), (req, res) => {
    // req.login();
    // console.log(req.user);
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

// GET info about SELF
userRouter.route('/me')
.get(authenticate.verifyUser,(req,res,next) => {
    Users.findById(req.user._id)
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err))
})

// UPDATE SELF
.put(authenticate.verifyUser,(req,res,next)=>{
    Users.findByIdAndUpdate(req.user._id,{$set: req.body},{new: true})
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    },(err) => next(err))
    .catch((err)=>next(err))
});

userRouter.route('/rate/:appid')
.post(authenticate.verifyRecruiter,(req,res,next)=>{
    Applications.findById(req.params.appid).populate('applier')
    .then((app)=>{
        if(app.ratedApplicant==true){
            err = new Error('Already Rated');
            err.status = 403;
            return next(err);
        }
        totalRater = app.applier.totalRaters;
        currentRating = app.applier.rating;
        console.log(currentRating);
        console.log(req.body.rating);
        newRating = (app.applier.rating*totalRater + Number(req.body.rating))/(totalRater+1);
        console.log(newRating);
        totalRater = totalRater+1;
        Users.findByIdAndUpdate(app.applier._id,{rating: newRating, totalRaters : totalRater },{new: true})
        .then((user)=>{
            console.log(user);
            Applications.findByIdAndUpdate(app._id, {ratedApplicant:true})
            .then(()=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            },(err) => next(err))
            .catch((err)=>next(err))
        },(err) => next(err))
        .catch((err)=>next(err))
    },(err) => next(err))
    .catch((err)=>next(err))
});

module.exports = userRouter;