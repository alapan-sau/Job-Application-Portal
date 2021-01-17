const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Jobs = require('../model/jobs');
const authenticate = require('../authenticate')
const jobRouter = express.Router();

jobRouter.use(bodyParser.json());

// View all JOBS by USER
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

// Add a JOB by RECRUITER
.post(authenticate.verifyRecruiter ,(req, res, next) => {
    req.body.creator = req.user._id;
    req.body.remAppli = req.body.maxAppli;
    req.body.remPos = req.body.maxPos;
    console.log(req);
    Jobs.create(req.body)
    .then((jobs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(jobs);
    }, (err) => next(err))
    .catch((err) => next(err));
})


// GET all JOBS made by RECRUITER
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


// GET a JOB created by RECRUITER
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

// DELETE a JOB by RECRUITER
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

// MODIFY a JOB by RECRUITER
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