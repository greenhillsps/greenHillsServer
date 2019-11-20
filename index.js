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

const { countSalary, isSameMonth, numberOfMonth } = require('./helper')


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