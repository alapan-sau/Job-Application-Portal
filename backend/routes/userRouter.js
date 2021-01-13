const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Users = require('../model/users');

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter.route('/')
.get((req,res,next) => {
    Users.find({})
    .then((users) => {
        console.log('yay\n');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    Users.create(req.body)
    .then((user) => {
        console.log('User Created ', user);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err) => {
        next(err)
    })
    .catch((err) => {
        next(err);
    })
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Users');
})

.delete((req, res, next) => {
    Users.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});



userRouter.route('/:UserId')
.get((req,res,next) => {
    Users.findById(req.params.UserId)
    .then((User) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(User);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Users/'+ req.params.UserId);
})
.put((req, res, next) => {
    Users.findByIdAndUpdate(req.params.UserId, {
        $set: req.body
    }, { new: true })
    .then((User) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(User);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Users.findByIdAndRemove(req.params.UserId)
    .then((resp) => {x
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = userRouter;