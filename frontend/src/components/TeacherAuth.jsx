import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TeacherAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // לכניסה
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  // לרישום
  const [fullName, setFullName] = useState('');
  const [registerId, setRegisterId] = useState('');
  const [className, setClassName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isLogin
      ? 'http://localhost:3000/api/teachers/login'
      : 'http://localhost:3000/api/teachers/register';

    const teacherData = isLogin
      ? { id: idNumber, password: password }
      : {
        fullName: fullName,
        id: registerId,
        className: className,
        password: registerPassword
      };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(isLogin ? "!התחברת בהצלחה" : "!המורה נרשמה בהצלחה");

        if (data.accessToken) {
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('teacherId', data.teacherId);
        }
        if (data.className) {
          localStorage.setItem('teacherClass', data.className);
        }

        if (isLogin) {
          navigate('/teacher-dashboard');
        } else {
          setIsLogin(true);
        }
      } else {
        alert("שגיאה: " + (data.message || data.error || "נסו שוב"));
      }
    } catch (error) {
      alert("שגיאת תקשורת עם השרת");
    }
  };
  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center', direction: 'rtl' }}>
        <Typography variant="h5" gutterBottom>
          {isLogin ? 'כניסת מורה' : 'רישום מורה חדשה'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isLogin ? (
            /* טופס כניסה */
            <>
              <TextField
                label="מספר תעודת זהות"
                fullWidth
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
              />
              <TextField
                label="סיסמה"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          ) : (
            /*טופס רישום */
            <>
              <TextField
                label="שם מלא"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <TextField
                label="מספר תעודת זהות"
                fullWidth
                value={registerId}
                onChange={(e) => setRegisterId(e.target.value)}
                inputProps={{ maxLength: 9 }}
                required
              />
              <TextField
                label="כיתה"
                fullWidth
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
              <TextField
                label="בחרי סיסמה (לפחות 6 תווים)"
                type="password"
                fullWidth
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </>
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth size="large">
            {isLogin ? 'כניסה' : 'הרשמה למערכת'}
          </Button>

          <Button variant="text" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'עדיין לא רשומה? הירשמי' : 'כבר רשומה? היכנסי'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TeacherAuth;