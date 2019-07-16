const TeacherId = require('../models/TeacherId');


//get teacher id
exports.getTeacherId=(req, res) => {
    TeacherId.find().exec((err, doc) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(doc)
    })
}

//post new teacher id
exports.initiateTeacherID=(req, res) => {
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
}