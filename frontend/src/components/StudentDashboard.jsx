import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';

const StudentDashboard = () => {
    const [regData, setRegData] = useState({ fullName: '', id: '', className: '' });
    const [studentId, setStudentId] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    // פונקציית עזר להמרת מספר עשרוני למבנה שהשרת דורש
    const convertToDMS = (decimal, type) => {
        const absolute = Math.abs(decimal);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
        
        let direction = '';
        if (type === 'lat') direction = decimal >= 0 ? 'N' : 'S';
        if (type === 'lng') direction = decimal >= 0 ? 'E' : 'W';

        return { degrees, minutes, seconds, direction };
    };

    const handleUpdateLocation = () => {
        if (!navigator.geolocation) {
            setMessage({ text: "הדפדפן לא תומך במיקום", type: 'error' });
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            //איסוף הנתונים למבנה המתאים לשרת שאותם יקבל
            const payload = {
                id: studentId,
                coordinates: {
                    latitude: convertToDMS(latitude, 'lat'),
                    longitude: convertToDMS(longitude, 'lng'),
                    time: new Date().toISOString()
                }
            };

            try {
                const response = await fetch('http://localhost:3000/api/students/location', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                if (response.ok) {
                    setMessage({ text: "!המיקום עודכן בהצלחה", type: 'success' });
                } else {
                    throw new Error(data.error);
                }
            } catch (err) {
                setMessage({ text: ":שגיאה בעדכון" + err.message, type: 'error' });
            }
        });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>Student Dashboard</Typography>
            
            {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">עדכון מיקום מהיר</Typography>
                <TextField 
                    fullWidth 
                    label="הקלידי תעודת זהות" 
                    variant="outlined" 
                    margin="normal"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={handleUpdateLocation}
                    sx={{ mt: 2 }}
                >
                    שלחי מיקום נוכחי
                </Button>
            </Paper>
        </Container>
    );
};

export default StudentDashboard;