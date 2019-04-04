const mongoose = require('mongoose');

const paySalary = mongoose.Schema({
    teacher:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Teacher',
         require:true
    },
      paidAmount:{
          type:Number,
          require:true
      },
      paidForMonth:{
          type:Date,
          require:true
      },
        active:{
          type:Boolean,
           default:true
        },
},
{timestamps:true} 
)     

const PaySalary = mongoose.model('PaySalary', paySalary);

module.exports = PaySalary;