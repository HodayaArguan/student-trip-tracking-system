const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

exports.registerTeacher = async (req, res) => {
    try {
        const { fullName, id, className } = req.body;
        
        const newTeacher = new Teacher({
            fullName,
            id,
            className
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
        const student = await Student.findOne({ idNumber: req.params.id });
        if (!student) return res.status(404).json({ message: "תלמידה לא נמצאה" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ idNumber: req.params.id });
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