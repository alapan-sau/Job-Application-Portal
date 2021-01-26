const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Applications = require('../model/applications');
const authenticate = require('../authenticate');
const Jobs = require('../model/jobs');
const Users = require('../model/users');
const applicationRouter = express.Router();
applicationRouter.use(bodyParser.json());

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ssad.jap@gmail.com',
      pass: 'kolkata123*'
    }
  });


// GET all APP DEV
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


// POST all APP DEV
applicationRouter.route('/')
.post((req,res,next)=>{
    Applications.create(req.body)
    .then((apps)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(apps);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

// GET an APP by USER
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

// GET all USER'S applied APPS
applicationRouter.route('/myapplications/')
.get(authenticate.verifyUser, (req,res,next) => {
    Applications.find({applier : req.user._id}).populate('job')
    .then((apps) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(apps);
    }, (err) => next(err))
    .catch((err) => next(err));
})

// GET all APPLICATINS to a JOB by RECRUITER
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

// APPLY to a JOB by USER
applicationRouter.route('/apply/:jobid')
.post(authenticate.verifyUser,(req,res,next) => {
    Users.findById(req.user._id)
    .then((user)=>{
        if(user.selected==true){
            err = new Error('Already Selected');
            err.status = 403;
            return next(err);
        }
        if(user.totalApplications >= 10){
            err = new Error('Already reached maximum number of applications');
            err.status = 403;
            return next(err);
        }
        Jobs.findById(req.params.jobid)
        .then((job)=>{
            if(job.remAppli <= 0){
                err = new Error('Already reached maximum number of Positions');
                err.status = 403;
                return next(err);
            }
            req.body.job = req.params.jobid;
            req.body.applier = req.user._id;
            req.body.rated = false;
            req.body.status = 'pending';
            Applications.create(req.body)
            .then((apps) => {
                var newApplicationsNumber = user.totalApplications+1;
                Users.findByIdAndUpdate(req.user._id ,{ totalApplications: newApplicationsNumber })
                .then(()=>{
                    var rem = job.remAppli - 1;
                    Jobs.findByIdAndUpdate(job._id,{remAppli:rem})
                    .then(()=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(apps);
                    }, (err) => next(err))
                    .catch((err) => next(err));
                }, (err) => next(err))
                .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }, (err)=>next(err))
        .catch((err)=>next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
});



// Update a STATUS of Application
applicationRouter.route('/status/:appid')
.put(authenticate.verifyRecruiter, (req,res,next) => {
    console.log(req.body);
    if(req.body.status==='selected'){
        Applications.findById(req.params.appid)
        .then((app)=>{
            Applications.updateMany({applier:app.applier},{status:'rejected'}).populate('applier')
            .then(()=>{
                Users.findByIdAndUpdate(app.applier, {totalApplications:1, selected:true})
                .then(()=>{
                    let today = Date.now();
                    Applications.findByIdAndUpdate(req.params.appid,{status:'selected', dateOfJoining: today},{new:true}).populate('job').populate('applier')
                    .then((appl)=>{
                        Jobs.findByIdAndUpdate(appl.job._id,{remPos : Number(appl.job.remPos)-1},{new:true}).populate('creator')
                        .then((job)=>{
                            var mailOptions = {
                                from: 'ssad.jap@gmail.com',
                                to: `${appl.applier.email}`,
                                subject: 'Job selection',
                                text: 'You have been selected by '+ job.creator.firstName + " (recruiter) for  the role of " + job.title
                            }
                            console.log(mailOptions);
                            transporter.sendMail(mailOptions)
                            .then((info)=>{
                                console.log(info);
                                if(job.remPos==0){
                                    console.log("YOu are lucky");
                                    let currStatus = ['pending','shortlisted'];
                                    Applications.find({job : job._id, status: {'$in': currStatus}}).populate('applier')
                                    .then((x)=>{
                                        Applications.updateMany({job : job._id, status: {'$in': currStatus}},{status:'rejected'})
                                        .then(()=>{
                                            let removedUsers = x.map((element)=>{
                                                return element.applier._id;
                                            })
                                            console.log(x);
                                            Users.updateMany({_id:{'$in':removedUsers}},{$inc : {"totalApplications" : -1}})
                                            .then(()=>{
                                                res.statusCode = 200;
                                                res.setHeader('Content-Type', 'application/json');
                                                res.json(appl);
                                            },(err) => next(err))
                                            .catch((err) => next(err))
                                        },(err) => next(err))
                                        .catch((err) => next(err))
                                    },(err) => next(err))
                                    .catch((err) => next(err))
                                }
                                else{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(appl);
                                }
                            },(err) => next(err))
                            .catch((err) => next(err))
                        },(err) => next(err))
                        .catch((err) => next(err))
                    },(err) => next(err))
                    .catch((err) => next(err))
                },(err) => next(err))
                .catch((err) => next(err))
            },(err) => next(err))
            .catch((err) => next(err))
        },(err) => next(err))
        .catch((err) => next(err))
    }
    else if(req.body.status==='rejected'){
        Applications.findByIdAndUpdate(req.params.appid, {status: req.body.status}).populate('applier')
        .then((app)=>{
            Users.findByIdAndUpdate(app.applier._id,{totalApplications: (Number(app.applier.totalApplications)-1) , selected: false})
            .then(()=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json('Done');
            },(err) => next(err))
            .catch((err) => next(err))
        },(err) => next(err))
        .catch((err) => next(err))
    }
    else{
        Applications.findByIdAndUpdate(req.params.appid, {status: req.body.status},{new:true})
        .then((app)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(app);
        },(err) => next(err))
        .catch((err) => next(err));
    }
});

// GET the SELECTED APPLICATIONS for every JOB RECRUITER
applicationRouter.route('/selected')
.get(authenticate.verifyRecruiter, (req,res,next) => {
    Jobs.find({creator: req.user._id})
    .then((jobs)=>{
        jobid = jobs.map((job)=>{
            return job._id;
        })
        Applications.find({job: {'$in':jobid}, status:'selected'}).populate('job').populate('applier')
        .then((apps)=>{
            console.log(apps);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(apps);
        },(err) => next(err))
        .catch((err) => next(err))
    },(err) => next(err))
    .catch((err) => next(err))
})

module.exports = applicationRouter;