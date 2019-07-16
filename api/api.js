const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Teacher=require('./controllers/teacher');
const TeacherId=require('./controllers/teacherId');
const User =require('./controllers/user');
const TeacherDeductions=require('./controllers/teacherDeductions');
const PaySalary=require('./controllers/paySalary');
const Increment =require('./controllers/increment');
const apiRoutes = express.Router();

//register teacher
apiRoutes.post('/teacher/registerTeacher', Teacher.registerTeacher);
//get teacher id
apiRoutes.get('/teacher/id', TeacherId.getTeacherId);
//initialize teacher id
apiRoutes.post('/teacherId', TeacherId.initiateTeacherID);
//get teacher data
apiRoutes.get('/teacher', Teacher.getTeacherData);
//update teacher data
apiRoutes.put('/updateTeacher/:id', Teacher.updateTeacherData);
//deactivate teacher
apiRoutes.get('/teacher-delete/:id', Teacher.deactivateTeacher);
//register new user
apiRoutes.post('/users/register', User.registerUser);
//register new user
apiRoutes.post('/users/login', User.loginUser);
//get users
apiRoutes.get('/users', User.getUsers);
//active or unActive users
apiRoutes.get('/users-blockUnblock/:id/:block', User.activeUnActiveUser);
//deactivate user
apiRoutes.get('/user-delete/:id', User.deactivateUser);
//deactivate user
apiRoutes.put('/updateUser/:id', User.updateUser);
//deactivate user
apiRoutes.post('/teacher/deduct',TeacherDeductions.postTeacherDeductions);
//deactivate user
apiRoutes.put('/teacher/update-deduction/:id',TeacherDeductions.updateTeacherDeductions);
//get all teacher details by applying date filter
apiRoutes.get('/teacher/fullRecord',Teacher.getTeachersByDateFilter);
//get teacher deductions record
apiRoutes.get('/teacher/deductions',TeacherDeductions.getDeductions);
//pay salary
apiRoutes.post('/teacher/pay-salary',PaySalary.paySalary);
//get salary by filtering date
apiRoutes.get('/teacher/salaries',PaySalary.getSalaryByFilterDate);
//deactivating salary
apiRoutes.get('/teacher-delete/salary/:id',PaySalary.deactivateSalary);
//get teacher by id and filter by date
apiRoutes.get('/teacher-byId/:id',Teacher.getTeacherById);
//post teacher salary increment
apiRoutes.post('/teacher/increment',Increment.postIncrement);
//get all increment records by date filter
apiRoutes.get('/teacher/increment',Increment.getIncrement);
//deactivate teacher increment
apiRoutes.get('/teacher/increment-delete/:id',Increment.deactivateTeacherIncrement);



module.exports = apiRoutes;