const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinary = require('cloudinary');
const formidable = require('express-formidable');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();


const { User } = require('./api/models/user');
const Teacher = require('./api/models/teacher');
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
app.use(cors())
//cloudinary config use for uploading iamges and videos

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


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
                res.status(200).json(user)
            })
        })



    })
})

//get users
app.get('/api/users', (req, res) => {
    User.find({ active: true }).exec((err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})

//blocked unblocked users
app.get('/api/users-blockUnblock/:id/:block', (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, { blocked: req.params.block }, { new: true }, (err, user) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(user)
    })
})

//delete users
app.get('/api/user-delete/:id', (req, res) => {
    User.remove({ _id: req.params.id }, (err, user) => {
        if (err) res.status(400).json(err)
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
app.put('/api/updateUser/:id', (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, { name: req.body.name, email: req.body.email, role: req.body.role, password: req.body.password }, { new: true }, (err, user) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(user)
    })
})


//register teacher
app.post('/api/teacher/registerTeacher', (req, res) => {
    console.log(req.body)
    const teacher = new Teacher(req.body);
    teacher.save((err, doc) => {
        if (err) {
            res.status(400).json({
                success: false,
                err
            })
        } else {
            res.status(200).json({
                success: true,
                data: doc
            })
        }
    })
})

//get teacher data
app.get('/api/teacher', (req, res) => {
    Teacher.find({ active: true }).exec((err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})

//update teacher 
app.put('/api/updateTeacher/:id', (req, res) => {
    const { name,fatherName,cnic,phone,qualification,experience,tuitionSalary,transportSalary,otherSalary,totalSalary,profilePic,joiningDate }=req.body;
    Teacher.findByIdAndUpdate({ _id: req.params.id }, {
        name: name,
        fatherName: fatherName,
        cnic: cnic,
        phone: phone,
        qualification: qualification,
        experience: experience,
        joiningDate: joiningDate,
        tuitionSalary: tuitionSalary,
        transportSalary: transportSalary,
        otherSalary: otherSalary,
        totalSalary: totalSalary,
        profilePic:profilePic
    }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})

//posting images
app.post('/api/uploadimage', formidable(), (req, res) => {
    cloudinary.uploader.upload(req.files.file.path, (result) => {
        console.log(result);
        res.status(200).send({
            public_id: result.public_id,
            url: result.url
        })
    }, {
            public_id: `${Date.now()}`,
            resource_type: 'auto'
        })
})


const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})