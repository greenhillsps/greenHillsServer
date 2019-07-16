const {User} = require('../models/user');

//register new user that may be admin or data entry level
 exports.registerUser=(req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) {
            res.status(400).json({
                success: false,
                err
            })
        } else {
            res.status(200).json({
                success: true,
                //userdata:doc
            })
        }
    })
}

//login user
exports.loginUser=(req, res) => {
    //find the email
    //check password
    //generate a token
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (!user) return res.status(400).json({ loginSuccess: false, message: 'Auth failed, email not found' })

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: 'Wrong password' });
            else if (user.blocked) {

                return res.status(400).json({ loginSuccess: false, message: 'Blocked By Admin' });

            }
            else {
                //generate token
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);
                    res.status(200).json(user)
                })
            }
        })
    })
}

//get users
exports.getUsers=(req, res) => {
    User.find({ active: true }).sort('-createdAt').exec((err, data) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(data)
    })
}

//active unActive user
exports.activeUnActiveUser=(req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, { blocked: req.params.block }, { new: true }, (err, user) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(user)
    })
}

//deactivate user
exports.deactivateUser=(req, res) => {
    User.remove({ _id: req.params.id }, (err, user) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(user)
    })
}

//update user
exports.updateUser=(req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, { name: req.body.name, email: req.body.email, role: req.body.role, password: req.body.password }, { new: true }, (err, user) => {
        if (err) res.status(400).json(err)
        else res.status(200).json(user)
    })
}