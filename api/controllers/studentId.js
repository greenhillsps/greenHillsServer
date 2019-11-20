const StudentId = require('../models/StudentId');


//get teacher id
exports.getStudentId=(req, res) => {
    StudentId.find().exec((err, doc) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(doc)
    })
}

//post new teacher id
exports.initiateStudentID=(req, res) => {
    console.log(req.body)
    const newId = new StudentId(req.body);
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
}