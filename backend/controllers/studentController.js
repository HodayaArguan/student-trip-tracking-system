const { dmsToDecimal } = require('../utils/geo');
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

function parseDms(coord) {
  if (!coord || typeof coord !== 'object') {
    throw new Error('Malformed coordinate object');
  }

  const { degrees, minutes, seconds, direction } = coord;
  return dmsToDecimal(degrees, minutes, seconds, direction);
}

exports.updateStudentLocation = async (req, res) => {
  try {
    const { id: bodyId, ID, coordinates } = req.body;
    const id = bodyId || ID;

    if (!id || !/^\d{9}$/.test(String(id))) {
      return res.status(400).json({ error: 'ID must be a 9-digit string or number.' });
    }

    if (!coordinates || typeof coordinates !== 'object') {
      return res.status(400).json({ error: 'Coordinates object is required.' });
    }

    const { latitude, longitude, time } = coordinates;

    const latDecimal = parseDms(latitude);
    const lngDecimal = parseDms(longitude);

    const timestamp = time ? new Date(time) : new Date();
    if (Number.isNaN(timestamp.getTime())) {
      return res.status(400).json({ error: 'Invalid Time value.' });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { id: String(id) },
      {
        lastLocation: {
          latitude: latDecimal,
          longitude: lngDecimal,
          timestamp,
        },
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.json({ message: 'Student location updated successfully.', student: updatedStudent });
  } catch (err) {
    res.status(400).json({ error: 'Error updating location: ' + err.message });
  }
};
exports.loginStudent = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "נא להזין תעודת זהות" });
        }

        const student = await Student.findOne({ id: String(id) });

        if (!student) {
            return res.status(404).json({ error: "תלמידה לא נמצאה. יש להירשם קודם." });
        }

        res.json({ 
            message: "התחברת בהצלחה!", 
            student: {
                fullName: student.fullName,
                id: student.id,
                className: student.className
            }
        });
    } catch (err) {
        res.status(500).json({ error: "שגיאה בשרת: " + err.message });
    }
};