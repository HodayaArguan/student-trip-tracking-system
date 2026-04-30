import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper,  Box, Alert, Tab, Tabs, CircularProgress } from '@mui/material';

const StudentAuth = () => {
  //סטטוס :0  - כניסה | 1- רישום
  const [mode, setMode] = useState(0); 
  const [formData, setFormData] = useState({ fullName: '', id: '', className: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // פונקצייה לאימות 
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const endpoint = mode === 1 ? 'register' : 'login';

    try {
      const response = await fetch(`http://localhost:3000/api/students/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        //שמירת המידע מקומית לשימוש בדשבורד
        localStorage.setItem('studentId', formData.id);
        if (data.student?.fullName) {
          localStorage.setItem('studentName', data.student.fullName);
        }

        setMessage({ 
          text: mode === 1 ? "נרשמת בהצלחה! ..." : "התחברת בהצלחה!", 
          type: 'success' 
        });

        // מעבר לדשבורד אחרי השהיה של שנייה וחצי
        setTimeout(() => {
          navigate('/student-dashboard');
        }, 1500);
      } else {
        throw new Error(data.error || "שגיאה בתהליך האימות");
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          
          {/*בחירה בין כניסה/רישום */}
          <Tabs 
            value={mode} 
            onChange={(e, newValue) => setMode(newValue)} 
            centered 
            sx={{ mb: 3 }}
          >
            <Tab label="כניסה" />
            <Tab label="רישום" />
          </Tabs>

          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            {mode === 1 ? "רישום תלמידה" : "כניסת תלמידה"}
          </Typography>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleAuth}>
            {mode === 1 && (
              <TextField
                fullWidth
                label="שם מלא"
                name="fullName"
                margin="normal"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            )}

            {/* שדה תעודת זהות - מופיע תמיד */}
            <TextField
              fullWidth
              label="תעודת זהות"
              name="id"
              margin="normal"
              required
              value={formData.id}
              onChange={handleChange}
              slotProps={{
                htmlInput: { maxLength: 9 } 
              }}
            />

            
            {mode === 1 && (
              <TextField
                fullWidth
                label="כיתה"
                name="className"
                margin="normal"
                required
                value={formData.className}
                onChange={handleChange}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.2, fontSize: '1rem' }}
            >
              {loading ? <CircularProgress size={24} /> : (mode === 1 ? "הירשמי" : "כניסה")}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default StudentAuth;