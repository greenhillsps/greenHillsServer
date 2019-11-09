const Student = require('../models/student');
const StudentIdModal = require('../models/StudentId');

exports.registerStudent=(req,res)=>{
    StudentIdModal.findOneAndUpdate({}, { $inc: {studentId: 1 } }, function (err, id) {
        if (err) res.status(400).json(err)
        else {
            req.body.studentId = id.studentId;
            const student = new Student(req.body);
            student.save((err, doc) => {
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

}


//get student data
exports.getStudentData = (req, res) => {
    Student.find({ active: true })
    
        .populate({
            path: 'fee',
            match: {
               // active: true,

            }
        }).sort('-createdAt').exec((err, data) => {
            if (err) res.status(400).json(err)
            else res.status(200).json(data)
        })
}

//get student by id
exports.getStudentById=(req,res)=>{
    Student.find({_id:req.params.id,active: true })
    
    .populate({
        path: 'fee',
        match: {
           // active: true,

        }
    }).exec((err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
}
//deactivate teacher
exports.deactivateStudent = (req, res) => {
    Student.findByIdAndUpdate({ _id: req.params.id }, { active: false }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
}


//update student data
exports.updateStudentData = (req, res) => {
    Student.findByIdAndUpdate({ _id: req.params.id },req.body, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
}