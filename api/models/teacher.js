const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: 1
    },
    fatherName: {
        type: String,
        required: true
    },
    cnic: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    qualification: {
        type: Array,
        required: true
    },
    experience: {
        type: String,
    },
    profilePic: {
        type: String,
    },
    joiningDate: {
        type: Date,
        required: true
    },
    tuitionSalary: {
        type: Number,
        required: true
    },
    transportSalary: {
        type: Number,
        default: 0
    },
    otherSalary: {
        type: Number,
        default: 0
    },
    totalSalary: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    teacherDeduction: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TeacherDeduction'

        }

    ],
    paySalary: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PaySalary'
        }
    ]
})

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;