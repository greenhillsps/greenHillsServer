const Increment=require('../models/increment');
const Teacher=require('../models/teacher');
const { numberOfMonth } = require('../../helper')

//post increment record
exports.postIncrement=(req, res) => {
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
}

//get increment by date filter
exports.getIncrement=(req, res) => {
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
}

//deactivate teacher increment
 exports.deactivateTeacherIncrement=(req, res) => {
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
}