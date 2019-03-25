const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const formidable = require('express-formidable');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();


const { User } = require('./api/models/user');

//mongoose connections
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, (err => {
    if (err) {
        console.log(process.env.DATABASE)
        console.log("mongodb connection failed!!!!")
    } else {
        console.log("mongodb connected success")
    }
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//regiseter
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) {
            res.status(400).json({
                success: false,
                err
            })
        } else {
            res.status(200).json({
                success: true,
                //userdata:doc
            })
        }
    })
})


//login
app.post('/api/users/login', (req, res) => {
    //find the email
    //check password
    //generate a token
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (!user) return res.status(400).json({ loginSuccess: false, message: 'Auth failed, email not found' })

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.status(400).json({ loginSuccess: false, message: 'Wrong password' });

            //generate token
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.status(200).json(user)
            })
        })



    })
})

    //get users
    app.get('/api/users',(req,res)=>{
    User.find({active:true}).exec((err,data)=>{
      if(err)res.status(400).json(err)
        else res.status(200).json(data)
    })
    })

    //blocked unblocked users
    app.get('/api/users-blockUnblock/:id/:block',(req,res)=>{
        User.findByIdAndUpdate({_id:req.params.id},{blocked:req.params.block}, {new:true},(err,user)=>{
            if(err) res.status(400).json(err)
                else res.status(200).json(user)
        })
    })

    //delete users
    app.get('/api/user-delete/:id',(req,res)=>{
        User.remove({_id:req.params.id},(err,user)=>{
            if(err) res.status(400).json(err)
                else res.status(200).json(user)
        })
    })
    
    // //get students
    // app.get('/students/:name',(req,res)=>{
    // User.find({active:true, name: new RegExp(req.params.name, "i")}).exec((err,res)=>{
    //   if(err)res.status(400).json({
    //       message:err
    //   })
    //     else res.status(200).json(res)
    // })
    // })

//update user
app.put('/api/updateUser/:id',(req,res)=>{
    User.findByIdAndUpdate({_id:req.params.id},{name:req.body.name,email:req.body.email,role:req.body.role,password:req.body.password},{new:true},(err,user)=>{
        if(err) res.status(400).json(err)
            else res.status(200).json(user)
    })
})
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})