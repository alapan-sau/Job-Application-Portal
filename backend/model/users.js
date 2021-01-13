const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');
var passportLocalMongoose = require('passport-local-mongoose');

var ratingSchema = new Schema({
    rating:{
        type: Number,
        min: 0,
        max: 5
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter'
    }
},  {
        timestamps: true
});

var educationSchema = new Schema({
    startYear:  {
        type: Number,
        min: 1970,
        max: 2021,
        required: true
    },
    endYear:  {
        type: Number,
        min: 1970,
        max: 2030,
        required: true
    },
    instituteName:  {
        type: String,
        required: true
    }
});

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },
    education: [educationSchema],
    rating: [ratingSchema],
    skills: [String],
},{
    timestamps: true
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

var Users = mongoose.model('User', userSchema);
module.exports = Users;