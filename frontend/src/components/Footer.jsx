import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ 
            width: '100%', 
            //הקטנת הפוטר כדי שלא יסתיר בדף הבית
            py: 1, 
            textAlign: 'center', 
            //ה-footer לא תופס מקום
            position: 'absolute', 
            bottom: 0,
            left: 0,
            //סידור השכבות שלא יסתירו אחת את השנייה
            zIndex: 1000,
            background: 'linear-gradient(transparent, rgba(255, 255, 255, 0.5))' 
        }}>
            <Typography variant="caption" sx={{ color: '#333', fontWeight: 'bold' }}>
                 תשפ"ו | בית הספר בנות משה    
            </Typography>
        </Box>
    );
};

export default Footer;