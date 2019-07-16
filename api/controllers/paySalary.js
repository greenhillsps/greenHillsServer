const PaySalary=require('../models/paySalary');
const Teacher=require('../models/teacher');

//post teacher salary
exports.paySalary=(req, res) => {
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
}


//get salary by filter date
exports.getSalaryByFilterDate=(req, res) => {
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
}


//deactivating teacher paid salary
exports.deactivateSalary=(req, res) => {
    PaySalary.findByIdAndUpdate({ _id: req.params.id }, { active: false }, { new: true }, (err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
}