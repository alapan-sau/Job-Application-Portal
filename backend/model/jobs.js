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

    },
    type: {
        type: String,

    },
    salary: {
        type: Number,

    },
    maxAppli: {
        type: Number,

    },
    maxPos: {
        type: Number,

    },
    duration: {
        type: Number,

    },
    rating:[ratingSchema]
},{
    timestamps: true
});

var Jobs = mongoose.model('Job', jobSchema);
module.exports = Jobs;