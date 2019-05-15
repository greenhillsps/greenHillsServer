const mongoose = require('mongoose');

const increment = mongoose.Schema({
    teacher:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Teacher',
         require:true
    },
     tuitionSalary: {
        type: Number,
        required: true
    },
    transportSalary: {
        type: Number,
        default: 0
    },
    otherSalary: {
        type: Number,
        default: 0
    },
    totalSalary: {
        type: Number,
        required: true
    },
  
      incrementFromMonth:{
          type:Date,
          require:true
      },
        incrementToMoth:{
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

const IncrementSalary = mongoose.model('Increment', increment);

module.exports = IncrementSalary;