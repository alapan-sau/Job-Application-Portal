const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');
var passportLocalMongoose = require('passport-local-mongoose');

var educationSchema = new Schema({
    start:  {
        type: Number,
        min: 1970,
        max: 2021,
        required: true
    },
    end:  {
        type: Number,
        min: 1970,
        max: 2030,
        required: true
    },
    institute:  {
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
    rating:{
        type: Number
    },
    skills: [String],
    totalApplications: {
        type : Number,
        required: true
    }
},{
    timestamps: true
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

var Users = mongoose.model('User', userSchema);
module.exports = Users;