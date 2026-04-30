import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, Dialog, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [wasFetched, setWasFetched] = useState(false);

    const teacherClassName = localStorage.getItem('teacherClass');

    useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/teacher-auth');
    }, [navigate]);

    const fetchMyClass = async () => {
        setLoading(true);
        setWasFetched(true);
        try {
            const response = await fetch(`http://localhost:3000/api/teachers/class-students/${teacherClassName}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            if (response.ok) setStudents(data);
        } catch (error) {
            alert("שגיאה בחיבור");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 6, direction: 'rtl', textAlign: 'right' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 1, color: '#333',paddingBottom:2 }}>
                ניהול כיתה {teacherClassName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                <Button variant="contained" disableElevation onClick={fetchMyClass} sx={{ bgcolor: '#2563eb', borderRadius: '8px' }}>
                    הצגת רשימה
                </Button>
                <Button variant="outlined" onClick={() => navigate('/map')} sx={{ borderRadius: '8px', color: '#2563eb' }}>
                    צפייה במפה
                </Button>
            </Box>
            {/* רשימת תלמידות */}
            {wasFetched && (
                <Box>
                    {loading ? <Typography>טוען...</Typography> : (
                        students.length > 0 ? (
                            students.map((s) => (
                                <Box key={s.id} sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    p: 2, 
                                    mb: 1.5, 
                                    border: '1px solid #eee', 
                                    borderRadius: '12px',
                                    bgcolor: '#fff'
                                }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 500 }}>{s.fullName}</Typography>
                                        <Typography variant="body2" sx={{ color: '#888' }}>ת"ז: {s.id}</Typography>
                                    </Box>
                                    <Button size="small" onClick={() => { setSelectedStudent(s); setOpenModal(true); }} sx={{ color: '#2563eb' }}>
                                        לפרטים
                                    </Button>
                                </Box>
                            ))
                        ) : <Typography> לא נמצאו תלמידות בכיתה זו</Typography>
                    )}
                </Box>
            )}

            <Dialog open={openModal} onClose={() => setOpenModal(false)} dir="rtl">
                <Box sx={{ p: 4, minWidth: '300px' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>פרטי תלמידה</Typography>
                    {selectedStudent && (
                        <Box sx={{ lineHeight: 2 }}>
                            <Typography><strong>שם:</strong> {selectedStudent.fullName}</Typography>
                            <Typography><strong>ת"ז:</strong> {selectedStudent.id}</Typography>
                            <Typography><strong>כיתה:</strong> {selectedStudent.className}</Typography>
                        </Box>
                    )}
                    <Button fullWidth onClick={() => setOpenModal(false)} sx={{ mt: 3, bgcolor: '#f5f5f5', color: '#333' }}>
                        סגור
                    </Button>
                </Box>
            </Dialog>
        </Container>
    );
};

export default TeacherDashboard;