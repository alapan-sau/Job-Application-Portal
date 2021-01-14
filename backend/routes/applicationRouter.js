const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Applications = require('../model/Applications');
const authenticate = require('../authenticate');
const Jobs = require('../model/jobs');
const applicationRouter = express.Router();
applicationRouter.use(bodyParser.json());

applicationRouter.route('/')
.get((req,res,next)=>{
    Applications.find()
    .then((apps)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(apps);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

applicationRouter.route('/myapplication/:jobid')
.get(authenticate.verifyUser, (req,res,next) => {
    Applications.find({job : req.params.jobid, applier : req.user._id})
    .then((app)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(app);
    }, (err) => next(err))
    .catch((err) => next(err));
})

applicationRouter.route('/myapplications/')
.get(authenticate.verifyUser, (req,res,next) => {
    Applications.find({applier : req.user._id})
    .then((apps) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(apps);
    }, (err) => next(err))
    .catch((err) => next(err));
})

applicationRouter.route('/appliedto/:jobid')
.get(authenticate.verifyRecruiter, (req,res,next) => {
    Jobs.findById(req.params.jobid)
    .then((job) => {
        if(job.creator.toString() == req.user._id.toString()){
            Applications.find({job : req.params.jobid}).populate('applier')
            .then((apps)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(apps);
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
        else{
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json('Not allowed');
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

applicationRouter.route('/apply/:jobid')
.post(authenticate.verifyUser,(req,res,next) => {
    req.body.job = req.params.jobid;
    req.body.applier = req.user._id;
    Applications.create(req.body)
    .then((apps) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(apps);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = applicationRouter;