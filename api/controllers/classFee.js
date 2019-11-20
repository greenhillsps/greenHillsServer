const ClassFeeModal =require('../models/classFee')

//add new fee of the class
exports.AddClassFee=(req,res)=>{
    console.log(req.body)
    const newFee=new ClassFeeModal(req.body);
    newFee.save((err,doc)=>{
        if(err)
        res.status(400).json(err)
        else{
            res.status(200).json(doc)
        }
    })
}

//get all doc of the class fee
exports.getClassFee=(req,res)=>{
  ClassFeeModal.find((err,doc)=>{
      if(err)
      res.status(400).json(err)
      else
      res.status(200).json(doc)
  })
}

//delete class fee doc
exports.deleteClassFee=(req,res)=>{
ClassFeeModal.deleteOne({_id:req.params.id},(err,doc)=>{
    if(err)
    res.status(400).json(err)
    else
    res.status(200).json(doc)
})
}

//update class fee
exports.updateClassFee=(req,res)=>{
    ClassFeeModal.findByIdAndUpdate({_id:req.params.id},req.body,{new:true},(err,doc)=>{
    if(err)
    res.status(400).json(err)
    else
    res.status(200).json(doc)
    })
}