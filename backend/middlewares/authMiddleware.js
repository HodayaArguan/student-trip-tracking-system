const jwt = require('jsonwebtoken');
const auth = (err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Something broke!");
};
const checkAuth = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "אימות נכשל - חסר טוקן בבקשה" });
        }
        const token = req.headers.authorization.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        
        req.userData = { userId: decodedToken.id };
        req.user = {
            fullName: decodedToken.fullName,
            role: decodedToken.role
        };
        next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "פג התוקף של הטוקן, נא להתחבר מחדש" });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "טוקן לא תקין או שגוי" });
        }

        return res.status(401).json({ message: "אימות נכשל" });
    }
};

module.exports = { auth, checkAuth }