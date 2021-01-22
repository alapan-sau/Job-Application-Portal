const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-email');
var passportLocalMongoose = require('passport-local-mongoose');

var educationSchema = new Schema({
    start:  {
        type: Number,
        required: true
    },
    end:  {
        type: Number,
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
    skill: [String],
    totalApplications: {
        type : Number,
        required: true
    },
    rating:{
        type:Number,
        required: true,
        default: 0
    },
    selected:{
        type:Boolean,
        default:false
    },
    totalRaters:{
        type:Number,
        default:0,
        required:true
    }
},{
    timestamps: true
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

var Users = mongoose.model('User', userSchema);
module.exports = Users;