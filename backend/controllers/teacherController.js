const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    try {
        const { fullName, password } = req.body;

        if (!fullName || !password) {
            return res.status(400).json({
                message: 'יש להזין שם מלא וסיסמה'
            });
        }

        const foundTeacher = await Teacher.findOne({ fullName }).lean();

        if (!foundTeacher) {
            return res.status(401).json({ message: 'משתמש לא נמצא' });
        }

        if (!foundTeacher || !foundTeacher.password) { 
             return res.status(401).json({ message: 'משתמש לא נמצא או חסרה סיסמה' });
        }
        const match = await bcrypt.compare(password, foundTeacher.password);

        if (!match) {
            return res.status(401).json({ message: 'סיסמה שגויה' });
        }

        const userInfo = {
            id: foundTeacher._id,
            fullName: foundTeacher.fullName,
            role: 'teacher' 
        };


        const accessToken = jwt.sign(
            userInfo, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '7d' } 
        );

        res.json({ accessToken: accessToken });

    } catch (error) {
        next(error);
    }
};

exports.registerTeacher = async (req, res) => {
    try {
        const { fullName, id, className, password } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = new Teacher({
            fullName,
            id,
            className,
            password: hashedPassword 
        });

        await newTeacher.save();
        res.status(201).json({ message: "המורה נרשמה בהצלחה!" });
    } catch (err) {
        res.status(400).json({ error: "שגיאה ברישום מורה: " + err.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        const students = await Student.find();
        res.json({ teachers, students });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({ id: req.params.id });
        if (!student) return res.status(404).json({ message: "תלמידה לא נמצאה" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ id: req.params.id });
        if (!teacher) {
            return res.status(404).json({ message: "מורה לא נמצאה" });
        }
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getStudentsInMyClass = async (req, res) => {
    try {
        const { className } = req.params; 
        const students = await Student.find({ className: className });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};