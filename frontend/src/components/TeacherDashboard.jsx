import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, List, ListItem, ListItemText, Box, Alert, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();
    const teacherClass = localStorage.getItem('teacherClass');
    const token = localStorage.getItem('token');

    const handleUpdateAndCheck = async () => {
        if (!navigator.geolocation) {
            setMessage({ text: "הדפדפן לא תומך במיקום", type: 'error' });
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const response = await fetch('http://localhost:3000/api/teachers/update-location', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        coordinates: {
                            latitude: latitude,
                            longitude: longitude
                        }
                    })
                });


                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `שגיאת שרת: ${response.status}`);
                }

                const data = await response.json();
                setStudents(data.nearbyStudents || []);
                setMessage({ text: "מיקומך עודכן והרשימה עודכנה", type: 'success' });
            } catch (err) {
                console.error("Error:", err);
                setMessage({ text: "שגיאה בתקשורת עם השרת: " + err.message, type: 'error' });
            }
        });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, direction: 'rtl' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                    ניהול כיתה {teacherClass}
                </Typography>

                {message.text && (
                    <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
                    <Button variant="contained" color="success" size="large" onClick={handleUpdateAndCheck}>
                        עדכני מיקום ובדקי מרחק תלמידות
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/map')}>
                        צפייה במפה
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" align="right" gutterBottom>
                    תלמידות בקרבת מקום (רדיוס 50 מטר):
                </Typography>

                <List>
                    {students.length > 0 ? students.map((student) => (
                        <ListItem key={student.id} divider>
                            <ListItemText 
                                primary={student.fullName} 
                                secondary={`ת"ז: ${student.id}`} 
                                sx={{ textAlign: 'right' }}
                            />
                        </ListItem>
                    )) : (
                        <Typography color="textSecondary">לא נמצאו תלמידות בטווח הקרוב</Typography>
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default TeacherDashboard;