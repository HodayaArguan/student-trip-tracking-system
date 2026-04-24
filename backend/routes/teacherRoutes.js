const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { checkAuth } = require('../middlewares/authMiddleware');
const isTeacher = require('../middlewares/isTeacher');

router.post('/register', teacherController.registerTeacher);
router.post('/login', teacherController.login);


router.get('/all-users',checkAuth, isTeacher, teacherController.getAllUsers);

router.get('/student/:id', checkAuth, isTeacher,teacherController.getStudentById);

router.get('/specific-teacher/:id', checkAuth, isTeacher, teacherController.getTeacherById);

router.get('/class-students/:className', checkAuth, isTeacher, teacherController.getStudentsInMyClass);
router.get('/all-locations', checkAuth, isTeacher, teacherController.getAllLocations);

module.exports = router;