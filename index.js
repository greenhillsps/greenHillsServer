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
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.status(200).json({
                    loginSuccess: true,
                    token: user
                })
            })
        })



    })
})

//get users
app.get('/users', (req, res) => {
    User.find({ active: true }).exec((err, res) => {
        if (err) res.status(400).json({
            message: err
        })
        else res.status(200).json(res)
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
app.put('/updateUser/:id', (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, { name: req.body.name }, (err, res) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(res)
    })
})
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})