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
const TeacherDeduction = require('./api/models/teacherDeduction');

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

        if (req.body.password != user.password) {
            return res.status(400).json({ loginSuccess: false, message: 'Wrong password' });

        }

        else if (user.blocked) {

            return res.status(400).json({ loginSuccess: false, message: 'Blocked By Admin' });

        }
        else {
            //generate token
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.status(200).json(user)
            })


        }
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
    console.log(req.body.password)
    User.findByIdAndUpdate({ _id: req.params.id }, { name: req.body.name, email: req.body.email, role: req.body.role, password: req.body.password }, { new: true }, (err, user) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(user)
    })
})


//register teacher
app.post('/api/teacher/registerTeacher', (req, res) => {
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
    const { name, fatherName, cnic, phone, qualification, experience, tuitionSalary, transportSalary, otherSalary, totalSalary, profilePic, joiningDate } = req.body;
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
        profilePic: profilePic
    }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})


//delete teachesr
app.get('/api/teacher-delete/:id', (req, res) => {
    Teacher.findByIdAndUpdate({ _id: req.params.id }, { active: false }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})


//save teacher deductions record
app.post('/api/teacher/deduct', (req, res) => {
    const startDate = new Date(req.body.startDate).setHours(0, 0, 0, 0);
    const endDate = new Date(req.body.endDate).setHours(0, 0, 0, 0)
    req.body.startDate = startDate
    req.body.endDate = endDate

    var saveNewRecord = false;

    TeacherDeduction.find({active:true,deductionType: req.body.deductionType, user: req.body.user }).exec((err, deductions) => {
        if (err) return res.status(400).json(err)
        else {
            if (deductions.length) {
               for(var i=0;i<=deductions.length-1;i++){
                if (new Date(startDate) > new Date(deductions[i].startDate) && new Date(startDate) > new Date(deductions[i].endDate)) {
                    saveNewRecord=true
                }
                else if (new Date(startDate) < new Date(deductions[i].startDate) && new Date(startDate) < new Date(deductions[i].endDate)) {
                    if (new Date(endDate) < new Date(deductions[i].startDate) && new Date(endDate) < new Date(deductions[i].endDate)) {
                        saveNewRecord=true
                    } else {
                        saveNewRecord=false
                        break
                    }
                } else {
                    saveNewRecord=false
                    break
                }
            }
            } else {
                saveNewRecord=true
            }

            //save new deduction
            if(saveNewRecord){
            const teacherDeduction = new TeacherDeduction(req.body);
            teacherDeduction.save((err, doc) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        err
                    })
                } else {
                    Teacher.findByIdAndUpdate({ _id: req.body.user }, { $push: { teacherDeduction: doc._id } }).exec((err, data) => {
                        if (err) res.status(400).json(err)
                        else res.status(200).json(doc)
                    })

                }
            })
            }else{
                return res.status(400).json({message:"Your Entered Date Already Exist"})
            }

        }
    })


})


//delete teacher deduction
app.get('/app/teacher/delete-deduction/:id',(req,res)=>{
 TeacherDeduction.findByIdAndUpdate({ _id: req.params.id }, { active: false }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})

//get all data of teacher
app.get('/api/teacher/fullRecord', (req, res) => {
    Teacher.find({ active: true }).populate("teacherDeduction").lean().exec((err, teachers) => {
        if (err) res.status(4000).json(err)
        else {
            res.status(200).json(teachers)
        }
    })
})


//get deductions
app.get('/api/teacher/deductions', (req, res) => {
    TeacherDeduction.find({active:true}).populate("user").exec((err, data) => {
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