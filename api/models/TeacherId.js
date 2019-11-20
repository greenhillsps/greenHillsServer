const mongoose = require('mongoose');

const teacherIdentity = mongoose.Schema({
    teacherId:{
        type:Number,
        default:0
    },
},
{timestamps:true} 
)     

const TeacherId = mongoose.model('TeacherId', teacherIdentity);

module.exports = TeacherId;