const mongoose = require('mongoose');

const studentIdentity = mongoose.Schema({
    studentId:{
        type:Number,
        default:0
    },
},
{timestamps:true} 
)     

const StudentId = mongoose.model('StudentId', studentIdentity);

module.exports = StudentId;