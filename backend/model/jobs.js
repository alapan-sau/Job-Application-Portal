const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ratingSchema = new Schema({
    rating:{
        type: Number,
        min: 0,
        max: 5
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},  {
        timestamps: true
});

const jobSchema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter'
    },
    title: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    maxAppli: {
        type: Number,
        required: true
    },
    maxPos: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    skill:[String],
    remAppli:{
        type: Number,
        required: true
    },
    remPos:{
        type: Number,
        required: true
    },
    rating:{
        type: Number,
        default: 0,
    },
    totalRaters:{
        type:Number,
        default :0
    }
},{
    timestamps: true
});

var Jobs = mongoose.model('Job', jobSchema);
module.exports = Jobs;