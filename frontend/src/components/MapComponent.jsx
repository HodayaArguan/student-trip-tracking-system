import React, { useState, useEffect } from 'react';
import { APIProvider, Map as GoogleMap, Marker } from '@vis.gl/react-google-maps';

const MapComponent = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch('http://localhost:3000/api/teachers/all-locations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          throw new Error('אישור גישה נכשל - ודאי שאת מחוברת כמורה');
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("שגיאה במשיכת נתונים:", error.message);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          defaultZoom={13}
          defaultCenter={{ lat: 32.0853, lng: 34.7818 }}
          gestureHandling={'greedy'}
        >
          {students.map(student => (
            student.lastLocation?.latitude && (
              <Marker 
                key={student._id} 
                position={{ 
                  lat: student.lastLocation.latitude, 
                  lng: student.lastLocation.longitude 
                }} 
                title={student.fullName || "תלמידה"} 
              />
            )
          ))}
        </GoogleMap>
      </APIProvider>
    </div>
  );
};

export default MapComponent;