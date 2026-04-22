const Student = require('../models/Student');


exports.registerStudent = async (req, res) => {
    try {
        const { fullName, id, className } = req.body;
        
        const newStudent = new Student({
            fullName,
            id,
            className
        });

        await newStudent.save();
        res.status(201).json({ message: "התלמידה נרשמה בהצלחה!" });
    } catch (err) {
        res.status(400).json({ error: "שגיאה ברישום: " + err.message });
    }
};