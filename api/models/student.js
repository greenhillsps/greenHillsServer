const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    fatherName: {
        type: String,
        required: true
    },
    studentId: {
        type: Number,
        unique:1
    },
    dateOfBirth: {
        type: String,
    },
    cnic: {
        type: String,
        required: false
    },
    address: {
        type: String,
    },
   
    profilePic: {
        type: String,
    },
    inClass:{
     type:String
    },
    guardianName: {
        type: String,
        required: false
    },
    guardianContact: {
        type:String,
        required: false
    },
    previousSchoolName: {
        type:String,
    },
    admissionDate: {
        type:String,
    },
  
    active: {
        type: Boolean,
        default: true,
    },
    
    
    fee: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Fee'

        }

    ],
    
   
},{timestamps:true} )

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;