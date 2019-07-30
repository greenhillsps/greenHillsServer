const Teacher = require('../models/teacher');
const TeacherId = require('../models/TeacherId');
const { numberOfMonth } = require('../../helper')
//register teacher
exports.registerTeacher = (req, res) => {

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


}

//get teacher data
exports.getTeacherData = (req, res) => {
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
}

//update teacher data
exports.updateTeacherData = (req, res) => {
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
}

//deactivate teacher
exports.deactivateTeacher = (req, res) => {
    Teacher.findByIdAndUpdate({ _id: req.params.id }, { active: false }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
}



//get teachers details by date filter
exports.getTeachersByDateFilter = (req, res) => {
    const { from, to } = req.query;
    console.log(new Date(from))
    Teacher.find({ active: true,
         joiningMonth:{$lte:from}})
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
                incrementDate: {$lte:from},
                //incrementToMonth: {$gte:from}
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
                        let { teacherDeduction, paySalary, salary } = data[k];
                        let td = [];
                        let ps = [];
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
                        
                      
                        data[k].teacherDeduction = td;
                        data[k].paySalary = ps;
                    }
                }
                res.status(200).json(data)

            }
        })
}




//find teacher by id and filtering record by date
exports.getTeacherById = (req, res) => {
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
                    let { teacherDeduction, paySalary, salary } = data[0];
                    let td = [];
                    let ps = [];
                    let filterSalary = []
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
                     if (salary) { 
                            for (var l = 0; l <= salary.length - 1; l++) {
                             if(salary[l].incrementDate<=new Date(to)){
                                 filterSalary.push(salary[l])
                             }
                       
                            }
                        }

                    data[0].teacherDeduction = td;
                    data[0].paySalary = ps;
                   data[0].salary = filterSalary
                }
                res.status(200).json(data)

            }
        })
}