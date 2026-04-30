const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    try {
        const { id, password } = req.body;

        if (!id || !password) {
            return res.status(400).json({
                message: 'יש להזין מספר תעודת זהות וסיסמה'
            });
        }

        const foundTeacher = await Teacher.findOne({ id }).lean();

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
            className: foundTeacher.className,
            role: 'teacher'
        };


        const accessToken = jwt.sign(
            userInfo,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            accessToken: accessToken,
            className: foundTeacher.className,
            teacherId: foundTeacher.id 
        });

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

exports.getAllLocations = async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTeacherLocation = (req, res) => {
    const { teacherId, coordinates } = req.body;
    if (!teacherId) {
        return res.status(400).json({ error: 'Teacher ID is required.' });
    }
    if (!coordinates) {
        return res.status(400).json({ error: 'Coordinates object is required.' });
    }
    const { latitude, longitude, time } = coordinates;
    const latDecimal = parseDms(latitude);
    const lngDecimal = parseDms(longitude);

    const timestamp = time ? new Date(time) : new Date();
    if (Number.isNaN(timestamp.getTime())) {
        return res.status(400).json({ error: 'Invalid Time value.' });
    }
    Teacher.findOneAndUpdate(
        { id: String(teacherId) },
        {
            lastLocation: {
                latitude: latDecimal,
                longitude: lngDecimal,
                timestamp,
            },
        },
        { new: true }
    )
        .then((updatedTeacher) => {
            if (!updatedTeacher) {
                return res.status(404).json({ error: 'Teacher not found.' });
            }
            res.json({ message: 'Teacher location updated successfully.', teacher: updatedTeacher });
        })
        .catch((err) => {
            res.status(400).json({ error: 'Error updating location: ' + err.message });
        });
};


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
// פונקציית עזר להמרת קואורדינטות עבור המורה
function parseDms(coord) {
    if (!coord || typeof coord !== 'object') return 0;
    const { degrees, minutes, seconds, direction } = coord;
    let decimal = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') decimal = -decimal;
    return decimal;
}
exports.checkNearbyStudents = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ id: req.user.id });
        const students = await Student.find({ className: teacher.className });

        const teacherLat = teacher.lastLocation.latitude;
        const teacherLng = teacher.lastLocation.longitude;

        const results = students.map(student => {
            const sLat = student.lastLocation.latitude;
            const sLng = student.lastLocation.longitude;

            const distance = calculateDistance(teacherLat, teacherLng, sLat, sLng);

            return {
                id: student.id,
                fullName: student.fullName,
                distance: distance.toFixed(2),
                isTooFar: distance > 3
            };
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
