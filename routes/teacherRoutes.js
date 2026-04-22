const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');


router.post('/register', teacherController.registerTeacher);


router.get('/all-users', teacherController.getAllUsers);

router.get('/student/:id', teacherController.getStudentById);

router.get('/specific-teacher/:id', teacherController.getTeacherById);

router.get('/class-students/:className', teacherController.getStudentsInMyClass);

module.exports = router;