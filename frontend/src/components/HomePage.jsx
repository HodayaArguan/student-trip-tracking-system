import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Stack, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url("https://images.unsplash.com/photo-1587297069400-6cc5da81658a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") center/cover no-repeat',
            position: 'relative',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            overflowX: 'hidden',
        }}>

            <Container maxWidth="md" sx={{ textAlign: 'center', zIndex: 1 }}>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
                    בנות משה
                </Typography>
                <Typography variant="h5" sx={{ color: '#5c6bc0', mb: 6, letterSpacing: 1 }}>
                    מערכת ניהול ודיווח - טיול שנתי לירושלים
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={4}
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {/* כרטיס מורה */}
                    <Paper
                        elevation={4}
                        onClick={() => navigate('/teacher-auth')}
                        sx={{
                            p: 5, width: 260, borderRadius: 4, cursor: 'pointer', textAlign: 'center',
                            //ריחוף הכרטיס כלפי מעלה בעת מעבר עכבר עליו
                            transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 10 }
                        }}
                    >
                        <MapIcon sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>צוות חינוך</Typography>
                        <Button variant="outlined" fullWidth sx={{ borderRadius: 2, fontWeight: 'bold' }}>
                            כניסת מורה
                        </Button>
                    </Paper>

                    {/* כרטיס תלמידה */}
                    <Paper
                        elevation={4}
                        onClick={() => navigate('/student-auth')}
                        sx={{
                            p: 5, width: 260, borderRadius: 4, cursor: 'pointer', textAlign: 'center',
                            transition: '0.3s', '&:hover': { transform: 'translateY(-10px)', boxShadow: 10 }
                        }}
                    >
                        {/*אייקון פרופיל משתמש */}
                        <AccountCircleIcon sx={{ fontSize: 60, color: '#1a237e', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>תלמידות</Typography>
                        <Button variant="contained" fullWidth sx={{ borderRadius: 2, fontWeight: 'bold' }}>
                            דיווח מיקום
                        </Button>
                    </Paper>

                </Stack>
            </Container>
        </Box>
    );
};

export default HomePage;