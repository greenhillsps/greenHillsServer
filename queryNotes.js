//populate withen populate
//find paid salaries record by id and date
app.get('/app/teacher/salaries-byDateAndId/:id', (req, res) => {

    PaySalary.find({
        teacher: req.params.id,
        paidForMonth: { $gte: new Date(req.query.from) },
        paidForMonth: { $lte: new Date(req.query.to) }
    })
        .populate({
            path: 'teacher', match: { active: true },
            populate: [{ path: 'teacherDeduction', match: { active: true } },
            { path: 'paySalary', match: { active: true } }]
        })
        .exec((err, data) => {
            if (err) res.status(400).json(err)
            else res.status(200).json(data)
        })
})