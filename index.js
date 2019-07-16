const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinary = require('cloudinary');
const formidable = require('express-formidable');
const apiRoutes = require("./api/api");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const { countSalary, isSameMonth,numberOfMonth } = require('./helper')


//mongoose connections
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, (err => {
    if (err) {
        console.log(process.env.DATABASE)
        console.log("mongodb connection failed!!!!")
    } else {
        console.log("mongodb connected success")
    }
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//cloudinary config use for uploading iamges and videos
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})



app.use('/api', apiRoutes);


////ali work resgister user data
//regiseter
const { Ali } = require('./api/models/ali');
app.post('/api/nawabmuqsitali/users/register', (req, res) => {
    const user = new Ali(req.body);
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
})
//ali find user login
//login
app.post('/api/nawabmuqsitali/users/login', (req, res) => {

    //find the email
    //check password
    //generate a token
    Ali.findOne({ 'email': req.body.email }, (err, user) => {
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

})

          

//posting images
app.post('/api/uploadimage', formidable(), (req, res) => {
    cloudinary.uploader.upload(req.files.file.path, (result) => {
        res.status(200).send({
            public_id: result.public_id,
            url: result.url
        })
    }, {
            public_id: `${Date.now()}`,
            resource_type: 'auto'
        })
})



const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})