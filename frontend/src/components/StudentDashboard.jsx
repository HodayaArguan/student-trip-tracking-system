import React, { useState, useEffect } from 'react'; 
import { Container, TextField, Button, Typography, Paper, Box, Alert } from '@mui/material';

const StudentDashboard = () => {
    const [studentId, setStudentId] = useState(localStorage.getItem('studentId') || '');
    const [message, setMessage] = useState({ text: '', type: '' });

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

    const sendLocationUpdate = () => {
        if (!navigator.geolocation) {
            console.error("הדפדפן לא תומך במיקום");
            return;
        }
        const currentId = studentId || localStorage.getItem('studentId');
        if (!currentId) return;

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            const payload = {
                id: currentId,
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
                if (response.ok) {
                    console.log("מיקום עודכן אוטומטית בהצלחה");
                }
            } catch (err) {
                console.error("שגיאה בעדכון אוטומטי:", err);
            }
        });
    };

    useEffect(() => {
        sendLocationUpdate();

        const interval = setInterval(() => {
            sendLocationUpdate();
        }, 60000);

        return () => clearInterval(interval);
    }, []); 

    const handleManualUpdate = () => {
        sendLocationUpdate();
        setMessage({ text: "בקשת עדכון נשלחה...", type: 'info' });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, direction: 'rtl' }}>
            <Typography variant="h3" align="center" gutterBottom>שלום {localStorage.getItem('studentName') || 'תלמידה'}</Typography>
            
            {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>מערכת איכון אוטומטית פעילה</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    המיקום שלך נשלח לשרת באופן אוטומטי בכל דקה.
                </Typography>
                
                <TextField 
                    fullWidth 
                    label="תעודת זהות מאומתת" 
                    variant="outlined" 
                    margin="normal"
                    disabled
                    value={studentId}
                />
                
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={handleManualUpdate}
                    sx={{ mt: 2 }}
                >
                    עדכני מיקום עכשיו (ידני)
                </Button>
            </Paper>
        </Container>
    );
};

export default StudentDashboard;