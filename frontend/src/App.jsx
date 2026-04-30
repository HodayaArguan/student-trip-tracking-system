import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import HomePage from './components/HomePage';
import TeacherAuth from './components/TeacherAuth';
import StudentAuth from './components/StudentAuth';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import MapComponent from './components/MapComponent';
import Footer from './components/Footer';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: '#ecf3f8', 
          position: 'relative'
      }}>
        
        {/* בכל קומפוננטה התוכן יתפוס את המקום*/}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teacher-auth" element={<TeacherAuth />} />
            <Route path="/student-auth" element={<StudentAuth />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/map" element={<div style={{ height: '100vh' }}><MapComponent /></div>} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;