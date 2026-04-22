require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 

const app = express();

app.get('/test', (req, res) => {
    res.send('The server is alive!');
});

app.use(express.json());


app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));

const dbURI =process.env.dbURI;
const port = 3000 ;
mongoose.connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });



// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose'); 

// const app = express();

// // 1. זה חייב להיות ראשון!
// app.use(express.json());

// // 2. בדיקת דופק פשוטה
// app.get('/test', (req, res) => {
//     res.send('The server is alive and working!');
// });

// // 3. חיבור הראוטים
// app.use('/api/teachers', require('./routes/teacherRoutes'));
// app.use('/api/students', require('./routes/studentRoutes'));

// const dbURI = process.env.dbURI;
// const port = 3000; // בואי ננעל על 3000 כי זה מה שמופיע לך בטרמינל

// mongoose.connect(dbURI)
//   .then(() => {
//     console.log("Connected to MongoDB successfully!");
//     app.listen(port, () => {
//       console.log("Server is running on port " + port);
//     });
//   })
//   .catch((err) => {
//     console.log("Connection error:", err);
//   });