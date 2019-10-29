const mongoose = require('mongoose');

const studentFeeSchema = mongoose.Schema({
     currentFee: {
        type: Number,
        required: true,
    },
    totalFee: {
        type: Number,
        required: true,
    },
    submitFee: {
        type: Number,
        required: true
    },
    discount:{
     type:Number,
     default:0
    },
    submittedBy: {
        type: String,
        required: true
    },
    feeForMonth: {
        type: String,
        require:true
    },
   
    student: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'

        }

    ],
    active:{
        type:Boolean,
        default:true
       },
    
   
},{timestamps:true} )

const StudentFee = mongoose.model('StudentFee', studentFeeSchema);

module.exports = StudentFee;