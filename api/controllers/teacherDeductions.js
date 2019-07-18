const TeacherDeduction=require('../models/teacherDeduction');
const Teacher=require('../models/teacher');

//save teacher deductions record
exports.postTeacherDeductions=(req, res) => {
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
}


//update deduction
exports.updateTeacherDeductions=(req, res) => {
    const { deductionType, amount, user, startDate, endDate, comment } = req.body
    TeacherDeduction.findByIdAndUpdate({ _id: req.params.id }, { deductionType, amount, user, startDate, endDate, comment }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
}

//get teacher deductions
exports.getDeductions=(req, res) => {
    TeacherDeduction.find({ active: true }).populate("user").sort('-createdAt').exec((err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
}