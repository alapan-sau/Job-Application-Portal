const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    sop: {
        type: String,
        required: true
    },
    applier: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    job: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    status:{
        type : String
    },
    rated:{
        type:Boolean
    },
    ratedApplicant:{
        type:Boolean,
        default:false
    },
    dateOfJoining:{
        type:Date
    }
},{
    timestamps: true
});

applicationSchema.index({ applier: 1, job: 1}, { unique: true });

var Applications = mongoose.model('Application', applicationSchema);
module.exports = Applications;