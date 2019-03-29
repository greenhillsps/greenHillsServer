const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TeacherDeductionSchema=new Schema({
 deductionType:{
     type:String,
     enum:['absentees','advance','other']
 },
    amount:{
       type:Number,
       required:true
    },
    comment:{
     type:String
    },
    user:{
        type: ObjectId,
        ref: 'Teacher',
        required:true
    },
    date:{
        type:Date,
        required:false
    }
   
})

const Teacher=mongoose.model('TeacherDeduction',TeacherDeductionSchema);

module.exports=Teacher;