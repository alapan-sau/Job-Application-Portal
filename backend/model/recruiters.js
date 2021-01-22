const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


const recruiterSchema = new Schema({
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
    telnum: {
        type: Number,
    },
    bio:{
        type: String,
        min: 1
    },
},{
    timestamps: true
});

recruiterSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

var Recruiters = mongoose.model('Recruiter', recruiterSchema);
module.exports = Recruiters;