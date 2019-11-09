const StudentFeeModal=require('../models/studentFee');
//submit student fee
exports.submitStudentFee=(req,res)=>{
    const newStudentFeeModal=new StudentFeeModal(req.body);
    newStudentFeeModal.save((err,doc)=>{
        if(err)
        res.status(200).json(err)
        else
        res.status(200).json(doc)
    })
}

//get student submitted fee record
exports.getStudentFeeRecord=(req,res)=>{
    StudentFeeModal.find({active:true})
    
    .populate({
        path: 'student', match: { active: true },
        populate: [{ path: 'fee'},
       ]
    }).sort('-createdAt').exec((err,doc)=>{
        if(err)
        res.status(400).json(err)
        else
        res.status(200).json(doc)
    })
}

//get student submitted fee record by id
exports.getStudentFeeRecordById=(req,res)=>{
    StudentFeeModal.find({active:true,student:req.params.id})
    .sort('-createdAt').exec((err,doc)=>{
        if(err)
        res.status(400).json(err)
        else
        res.status(200).json(doc)
    })
}