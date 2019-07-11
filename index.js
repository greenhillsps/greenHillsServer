const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinary = require('cloudinary');
const formidable = require('express-formidable');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const { countSalary, isSameMonth,numberOfMonth } = require('./helper')


////////// teacher modals //////////////////
const { User } = require('./api/models/user');
const Teacher = require('./api/models/teacher');
const TeacherDeduction = require('./api/models/teacherDeduction');
const PaySalary = require('./api/models/paySalary');
const TeacherId = require('./api/models/TeacherId');
const Increment = require("./api/models/increment");

///ali modal+=============
const { Ali } = require('./api/models/ali');


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


////ali work resgister user data
//regiseter
app.post('/api/nawabmuqsitali/users/register', (req, res) => {
    const user = new Ali(req.body);
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
//ali find user login
//login
app.post('/api/nawabmuqsitali/users/login', (req, res) => {

    //find the email
    //check password
    //generate a token
    Ali.findOne({ 'email': req.body.email }, (err, user) => {
        if (!user) return res.status(400).json({ loginSuccess: false, message: 'Auth failed, email not found' })

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: 'Wrong password' });
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
            if (!isMatch) return res.json({ loginSuccess: false, message: 'Wrong password' });
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



})


//get users
app.get('/api/users', (req, res) => {
    User.find({ active: true }).sort('-createdAt').exec((err, data) => {
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

    TeacherId.findOneAndUpdate({}, { $inc: { teacherId: 1 } }, function (err, id) {
        if (err) res.status(400).json(err)
        else {
            req.body.teacherId = id.teacherId;
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
        }
    })


})



//get teacher id
app.get('/api/teacher/id', (req, res) => {
    TeacherId.find().exec((err, doc) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(doc)
    })
})

//post new teacher id
app.post('/api/teacherId', (req, res) => {
    console.log(req.body)
    const newId = new TeacherId(req.body);
    newId.save((err, doc) => {
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
    Teacher.find({ active: true })
    .populate({
        path: 'salary',
        match: {
            active: true,

        }
    }).sort('-createdAt').exec((err, data) => {
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
    console.log(req.body)
    // const startDate = new Date(req.body.startDate).setHours(0, 0, 0, 0);
    // const endDate = new Date(req.body.endDate).setHours(0, 0, 0, 0)
    // req.body.startDate = startDate
    // req.body.endDate = endDate
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    var saveNewRecord = false;

    TeacherDeduction.find({ active: true, deductionType: req.body.deductionType, user: req.body.user }).exec((err, deductions) => {
        if (err) return res.status(400).json(err)
        else {
            if (deductions.length) {
                for (var i = 0; i <= deductions.length - 1; i++) {
                    if (new Date(startDate) > new Date(deductions[i].startDate) && new Date(startDate) > new Date(deductions[i].endDate)) {
                        saveNewRecord = true
                    }
                    else if (new Date(startDate) < new Date(deductions[i].startDate) && new Date(startDate) < new Date(deductions[i].endDate)) {
                        if (new Date(endDate) < new Date(deductions[i].startDate) && new Date(endDate) < new Date(deductions[i].endDate)) {
                            saveNewRecord = true
                        } else {
                            saveNewRecord = false
                            break
                        }
                    } else {
                        saveNewRecord = false
                        break
                    }
                }
            } else {
                saveNewRecord = true
            }

            //save new deduction
            if (saveNewRecord) {
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
            } else {
                return res.status(400).json({ message: "Your Entered Date Already Exist" })
            }

        }
    })


})


//delete teacher deduction
app.get('/app/teacher/delete-deduction/:id', (req, res) => {
    TeacherDeduction.findByIdAndUpdate({ _id: req.params.id }, { active: false }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})


//update deduction
app.put('/app/teacher/update-deduction/:id', (req, res) => {
    const { deductionType, amount, user, startDate, endDate, comment } = req.body

    TeacherDeduction.findByIdAndUpdate({ _id: req.params.id }, { deductionType, amount, user, startDate, endDate, comment }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})

//get all data of teacher
app.get('/api/teacher/fullRecord', (req, res) => {
    const { from, to } = req.query;
    Teacher.find({ active: true })
        .populate({
            path: 'teacherDeduction',
            match: {
                active: true,

            }
        })
        .populate({
            path: 'paySalary',
            match: {
                active: true,
            }
        })
        .populate({
            path: 'salary',
            match: {
                active: true,

            }
        })
        .lean().exec((err, data) => {
            if (err) res.status(400).json(err)
            else {
                if (from == '' && to == '') {
                    res.status(200).json(data)
                    return
                }
                if (data.length) {
                    for (var k = 0; k <= data.length - 1; k++) {
                        let { teacherDeduction, paySalary,salary } = data[k];
                        let td = [];
                        let ps = [];
                        let filterSalary=[]
                        if (teacherDeduction) {
                            for (var i = 0; i <= teacherDeduction.length - 1; i++) {
                                if (teacherDeduction[i].startDate > new Date(from) && teacherDeduction[i].startDate < new Date(to)) {

                                    td.push(teacherDeduction[i]);
                                }
                            }
                        }
                        if (paySalary) {
                            for (var j = 0; j <= paySalary.length - 1; j++) {
                                if (paySalary[j].paidForMonth >= new Date(from) && paySalary[j].paidForMonth <= new Date(to)) {
                                    ps.push(paySalary[j]);
                                }
                            }
                        }
                        //  if (salary) {
                        //     for (var l = 0; l <= salary.length - 1; l++) {
                        //          if(numberOfMonth(new Date(salary[salary.length-1].incrementFromMonth))<numberOfMonth(new Date(from))){
                        //      break
                        //      return
                        // }
                        // if ((numberOfMonth(new Date(salary[l].incrementFromMonth)) <=numberOfMonth(new Date(from))&&numberOfMonth(new Date(salary[l].incrementToMonth)) >=numberOfMonth(new Date(from))) ) {
                        //     filterSalary.push(salary[l]);
                            
                        // } 
                        //     }
                        // }
                        data[k].teacherDeduction = td;
                        data[k].paySalary = ps;
                        // data[k].salary = filterSalary;
                    }
                }
                res.status(200).json(data)

            }
        })
})




//get deductions
app.get('/api/teacher/deductions', (req, res) => {
    TeacherDeduction.find({ active: true }).populate("user").sort('-createdAt').exec((err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})


//post teacher salary
app.post('/app/teacher/pay-salary', (req, res) => {
    req.body.paidForMonth = new Date(req.body.paidForMonth);
    const paySalary = new PaySalary(req.body);
    paySalary.save((err, doc) => {
        if (err) res.status(400).json(err)
        else {
            Teacher.findByIdAndUpdate({ _id: req.body.teacher }, { $push: { paySalary: doc._id } }).exec((err, data) => {
                if (err) res.status(400).json(err)
                else {
                    res.status(200).json(doc)
                }
            })
        }
    })
})


//get paid all salaries
app.get('/app/teacher/salaries', (req, res) => {
    const { from, to } = req.query;
    PaySalary.find({
        active: true,
    })
        .populate({ path: 'teacher',match:{active:true},
        populate:{path:'salary',match: {active: true}} 
    
    })
        .sort('-createdAt')
        .lean().exec((err, data) => {
            if (err) res.status(400).json(err)
            else {
                var filterDAta = [];
                if (data.length) {
                    for (var i = 0; i <= data.length - 1; i++) {
                        if (data[i].paidForMonth > new Date(from) && data[i].paidForMonth < new Date(to)) {
                            filterDAta.push(data[i]);
                        }
                    }
                }
                res.status(200).json(filterDAta)
            }
        })
})


//delete teacher salary
app.get('/api/teacher-delete/salary/:id', (req, res) => {
    PaySalary.findByIdAndUpdate({ _id: req.params.id }, { active: false }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
})


//find paid salaries record by id and date
app.get('/app/teacher-byId/:id', (req, res) => {
    const { from, to } = req.query;
    Teacher.find({ _id: req.params.id, active: true })
        .populate({
            path: 'teacherDeduction',
            match: {
                active: true,

            }
        })
        .populate({
            path: 'paySalary',
            match: {
                active: true,
            }
        })
        .populate({
            path: 'salary',
            match: {
                active: true,
            }
        })
        .lean().exec((err, data) => {
            if (err) res.status(400).json(err)
            else {

                if (from == '' && to == '') {
                    res.status(200).json(data)
                    return
                }
                if (data.length) {
                    let { teacherDeduction, paySalary,salary } = data[0];
                    let td = [];
                    let ps = [];
                    let filterSalary=[]
                    if (teacherDeduction) {
                        for (var i = 0; i <= teacherDeduction.length - 1; i++) {
                            if (teacherDeduction[i].startDate > new Date(from) && teacherDeduction[i].startDate < new Date(to)) {

                                td.push(teacherDeduction[i]);
                            }
                        }
                    }
                    if (paySalary) {
                        for (var j = 0; j <= paySalary.length - 1; j++) {
                            if (paySalary[j].paidForMonth >= new Date(from) && paySalary[j].paidForMonth <= new Date(to)) {
                                ps.push(paySalary[j]);
                            }
                        }
                    }
                    //  if (salary) {
                    //         for (var l = 0; l <= salary.length - 1; l++) {
                    //              if(numberOfMonth(new Date(salary[salary.length-1].incrementFromMonth))<numberOfMonth(new Date(to))){
                    //          break
                    //          return
                    //     }
                    //     if ((numberOfMonth(new Date(salary[l].incrementFromMonth)) <=numberOfMonth(new Date(to))&&numberOfMonth(new Date(salary[l].incrementToMonth)) >=numberOfMonth(new Date(to))) ) {
                    //         filterSalary.push(salary[l]);
                            
                    //     } 
                    //         }
                    //     }
                    data[0].teacherDeduction = td;
                    data[0].paySalary = ps;
                    //data[0].salary=filterSalary
                }
                res.status(200).json(data)

            }
        })
})


//////////*******************/////////////
//increment salary///
/////////*******************//////////////
app.post('/api/teacher/increment', (req, res) => {
    const { teacher, setPreviousEndDate, incrementFromMonth,grossSalary } = req.body;
    //find by id
    Increment.find({ teacher: teacher, active: true }).lean().exec((err, data) => {
        if (err) res.status(400).json(err)
        else {

            var getData = data.length ? data[data.length - 1] : null;
            
            if (getData != null) {

                if (numberOfMonth(new Date(incrementFromMonth))<=numberOfMonth(new Date(data[data.length-1].incrementFromMonth))) {
                    return res.status(401).json({ message: 'This month already exist' })
            }

                req.body.grossSalary+=data[data.length-1].grossSalary;
                Increment.findByIdAndUpdate({ _id: getData._id }, {
                    incrementToMonth: setPreviousEndDate,
                }, { new: true }, (err, data) => {
                    if (err) res.status(400).json(err)
                 
                })
            }

            const increment = new Increment(req.body);


            increment.save((err, doc) => {
                if (err) res.status(400).json(err)
                else {
                    Teacher.findByIdAndUpdate({ _id: teacher }, { $push: { salary: doc._id } }).exec((err, data) => {
                        if (err) res.status(400).json(err)
                        else {
                            res.status(200).json(doc)
                        }
                    })
                }
            })
        }
    })




})

app.get('/api/teacher/increment', (req, res) => {
    const { from, to } = req.query;
    Increment.find({ active: true })
        .populate({
            path: 'teacher',
            match: {
                active: true,

            }
        }).lean().exec((err, data) => {
            if (err) res.status(400).json(err)
            else {
                var filterData = [];    
                if (data.length) {
                    for (var i = 0; i <= data.length - 1; i++) {
                        if(numberOfMonth(new Date(data[data.length-1].incrementFromMonth))<numberOfMonth(new Date(from))){
                             break
                             return
                        }
                        if ((numberOfMonth(new Date(data[i].incrementFromMonth)) <=numberOfMonth(new Date(from))&&numberOfMonth(new Date(data[i].incrementToMonth)) >=numberOfMonth(new Date(from))) ) {
                           // data[i].grossSalary = countSalary([...filterData,data[i]])
                            filterData.push(data[i]);
                            //console.log(filterData)
                            
                        } 


                    }
                }
                res.status(200).json({lastIndex:data.length?data[data.length-1]:{},data:filterData})
            }
        })
})

//deleting increment data
//delete teachesr
app.get('/api/teacher/increment-delete/:id', (req, res) => {
    Increment.findByIdAndUpdate({ _id: req.params.id }, { active: false }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else {
           var updateDate='';
            Increment.find({active:true}).exec((err,doc)=>{
             if(err) return res.status(400).json(err)
                else{
                  if(doc.length){
                  Increment.findByIdAndUpdate({_id:doc[doc.length-1]._id},{incrementToMonth:doc[doc.length-1].incrementFromMonth},{new:true},(err,upData)=>{
                      if(err) return res.status(400).json(err)
                        else res.status(200).json(upData)
                  })
                  }else{
                      return res.status(200).json(data)
                  }
                }
            })
        }
    })
})

//posting images
app.post('/api/uploadimage', formidable(), (req, res) => {
    cloudinary.uploader.upload(req.files.file.path, (result) => {
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