const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Jobs = require('../model/jobs');
const authenticate = require('../authenticate');
const Applications = require('../model/applications');
const Users = require('../model/users');
const jobRouter = express.Router();

jobRouter.use(bodyParser.json());

// View all JOBS by USER
jobRouter.route('/')
.get(authenticate.verifyUser , (req,res,next) => {
    // console.log(req.user.email);
    // console.log(req.user);
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
    // console.log(req.user.email);
    // console.log(req.user);
    req.body.creator = req.user._id;
    req.body.remAppli = req.body.maxAppli;
    req.body.remPos = req.body.maxPos;
    req.body.totalRaters = 0;
    req.body.rating = 0;
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
    // console.log(req.user);
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
    // console.log(req.user);
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
            Applications.find({job:req.params.jobid}).populate('applier')
            .then((apps)=>{
                console.log(apps);

                apps = apps.filter((app)=>{
                    return(app.applier.status!=='rejected')
                })
                let users = apps.map((element) => {
                    return element.applier._id;
                });
                selectedApps = apps.filter((element) => {
                    return (element.status==="selected");
                });

                let selectedUsers = apps.map((element)=>{
                    return element.applier._id;
                })
                let deletingStatus = ['pending','selected','shortlisted']
                Users.updateMany({"_id": {"$in":users}, "status":{"$in":deletingStatus}},{$inc:{ totalApplications: -1}})
                .then(()=>{
                    Users.updateMany({"_id": {"$in":selectedUsers}}, {selected:false})
                    .then(()=>{
                        Applications.deleteMany({job: req.params.jobid})
                        .then(()=>{
                            Jobs.findByIdAndDelete(req.params.jobid)
                            .then(()=>{
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json("Done");
                            }, (err) => next(err))
                            .catch((err) => next(err));
                        }, (err) => next(err))
                        .catch((err) => next(err));
                    }, (err) => next(err))
                    .catch((err) => next(err));
                },(err) => next(err))
                .catch((err) => next(err));
            },(err) => next(err))
            .catch((err) => next(err));
        }
        else{
            err = new Error("Unauthorised");
            err.status(401);
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})



// MODIFY a JOB by RECRUITER
.put(authenticate.verifyRecruiter, (req, res, next) => {
    Jobs.findById(req.params.jobid)
    .then((job) => {
        if(job.creator.toString() == req.user._id.toString()){
            if(job.maxAppli - job.remAppli > req.body.maxAppli){
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json('Making Maximim Application less than Current Applications');
            }
            if(job.maxPos - job.remPos >= req.body.maxPos){
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json('Making Maximum Position less than/equal to Current filled Positions');
            }
            req.body.remPos = req.body.maxPos-(job.maxPos - job.remPos);
            req.body.remAppli = req.body.maxAppli-(job.maxAppli - job.remAppli);
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


jobRouter.route('/rate/:appid')
// RATE a JOB
.post(authenticate.verifyUser, (req, res, next) => {
    // console.log(req.body);
    Applications.findByIdAndUpdate(req.params.appid,{rated:true}).populate('job')
    .then((app) => {
        jobid = app.job._id;
        jobrater = Number(app.job.totalRaters);
        jobrating = Number(app.job.rating);
        newrate = Number(req.body.rate);

        console.log(jobrater,jobrating, newrate);

        console.log(newrate);
        if(jobrating===0 || jobrating===null){
            console.log("here")
            jobrating = newrate;
            jobrater=jobrater+1;
            console.log(jobrating);
        }
        else{
            console.log("here else")

            jobrating = (jobrating*jobrater + newrate)/(jobrater+1);
            jobrater = jobrater+1;
        }
        Jobs.findByIdAndUpdate(jobid,{rating : jobrating , totalRaters: jobrater})
        .then(()=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json('Rating Done');
        },(err)=>next(err))
        .catch((err)=>next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = jobRouter;