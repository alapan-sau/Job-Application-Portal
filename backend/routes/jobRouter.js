const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Jobs = require('../model/jobs');
const authenticate = require('../authenticate')
const jobRouter = express.Router();

jobRouter.use(bodyParser.json());

// View all Jobs
jobRouter.route('/')
.get(authenticate.verifyUser , (req,res,next) => {
    Jobs.find({}).populate('creator')
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
})

// To Add a Job
.post(authenticate.verifyRecruiter ,(req, res, next) => {
    req.body.creator = req.user._id;
    Jobs.create(req.body)
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
})


// GET all jobs made by self
jobRouter.route('/myjobs')
.get(authenticate.verifyRecruiter, (req,res,next) => {
    Jobs.find({creator : req.user._id})
    .then((jobs)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(jobs);
    },(err)=>next(err))
    .catch((err)=>next(err));
});



jobRouter.route('/:jobid')
.get(authenticate.verifyRecruiter, (req, res, next) => {
    Jobs.findById(req.params.jobid)
    .then((job) => {
        if(job.creator.toString() == req.user._id.toString()){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(job);
        }
        else{
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json('Not allowed');
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyRecruiter, (req, res, next) => {
    Jobs.findById(req.params.jobid)
    .then((job) => {
        if(job.creator.toString() == req.user._id.toString()){
            Jobs.findByIdAndDelete(req.params.jobid)
            .then((job)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(job);
            } ,(err) => next(err))
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

.put(authenticate.verifyRecruiter, (req, res, next) => {
    Jobs.findById(req.params.jobid)
    .then((job) => {
        if(job.creator.toString() == req.user._id.toString()){
            Jobs.findByIdAndUpdate(req.params.jobid,{$set:req.body},{new:true})
            .then((job)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(job);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json('Not allowed');
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = jobRouter;