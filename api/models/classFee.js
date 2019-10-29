const mongoose = require('mongoose');

const feeIdentity = mongoose.Schema({
    class:{
        type:String,
        require:true,
        unique: 1
    },
    fee:{
        type:Number,
        require:true
    },
},
{timestamps:true} 
)     

const Fee = mongoose.model('ClassFee', feeIdentity);

module.exports = Fee;