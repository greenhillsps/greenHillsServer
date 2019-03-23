const mongoose = require('mongoose');
const bcrypt =require('bcrypt');
const jwt=require('jsonwebtoken');
const SALT_I=10;
require('dotenv').config();

const userSchema = mongoose.Schema({
    name:{
     required:true,
     type:String
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        require: true,
        minlength: 5,

    },
  
    role:{
        type:Number,
        default:0,
    },
    token:{
        type:String
    },
    active:{
        type:Boolean,
        default:true
    },
    blocked:{
        type:Boolean,
        default:false
    }
    

})

//this run before save and then next run the save function
userSchema.pre('save',function(next){
    var user=this;
 if(user.isModified('password')){
     bcrypt.genSalt(SALT_I,function(err,salt){

        if(err){
            next(err)
        }else{
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err){
                    next(err)
                }else{
                    user.password=hash;
                    next();
                }
            })
        }
    })
 }else{
     next();
 }
    
})


//when login password incrypt
userSchema.methods.comparePassword=function(candidatePassword,cb)//cb for call back
{
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch)
    })
}

//generate token when login
userSchema.methods.generateToken=function(cb){
var user=this;
var token=jwt.sign(user._id.toHexString(),process.env.SECRET);
user.token=token;
user.save(function(err,user){
    if(err) return cb(err);
    cb(null,user)
})
}


//token verifying 
userSchema.statics.findByToken=function(token,cb){
    var user=this;

    jwt.verify(token,process.env.SECRET,function(err,decode){
        user.findOne({"_id":decode,"token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user) 
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }