const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Users = require('../model/users');
const authenticate = require('../authenticate')
const userRouter = express.Router();

userRouter.use(bodyParser.json());


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

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Users');
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Users');
})

.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Users');
});


userRouter.post('/signup', (req, res, next) => {
    var password = req.body.password;
    delete req.body.password;
    Users.register(new Users(req.body),
    password, (err, user) => {
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

userRouter.post('/login', passport.authenticate('userLocal'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


module.exports = userRouter;