import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { APIProvider, Map as GoogleMap, Marker } from '@vis.gl/react-google-maps';


const MapComponent = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      //אם אין טוקן - חזרה למסך הבית
      if (!token) {
        alert("גישה חסומה! נא להתחבר למערכת");
        navigate('/teacher-auth'); 
        return;
      }

      // אם יש טוקן, מנסים למשוך את הנתונים
      try {
        const response = await fetch('http://localhost:3000/api/teachers/all-locations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // אם הטוקן לא תקף או פג תוקף
          if (response.status === 401 || response.status === 403) {
            //ומחיקתו באין אפשרות גישה
            localStorage.removeItem('token'); 
            navigate('/teacher-auth');
          }
          throw new Error('אישור גישה נכשל');
        }

        const data = await response.json();
        //הדפסה ללוג
        console.log("נתונים שהתקבלו מהשרת:", data);
        setStudents(data);
      } catch (error) {
        console.error("שגיאה במשיכת נתונים:", error.message);
      }
    };

    fetchStudents();
  }, [navigate]);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      {/*  התווית שמעל הנעץ */}
      <style>{`
        .id-label {
          background-color: #ffcdd2 !important;
          border: 2px solid black !important;
          border-radius: 2px !important;
          padding: 2px 8px !important;
          font-weight: bold !important;
          font-size: 16px !important;
          color: black !important;
          white-space: nowrap !important;
        }
      `}</style>

      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          defaultZoom={10}
          defaultCenter={{ lat: 31.8928, lng: 35.0110 }}
          gestureHandling={'greedy'}
        >
          {students.map(student => (
            student.lastLocation?.latitude && (
              <Marker
                key={student._id}
                position={{
                  lat: Number(student.lastLocation.latitude),
                  lng: Number(student.lastLocation.longitude)
                }}
                icon={{
                  //נעץ
                  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: { width: 30, height: 30 }
                }}
                label={{
                  text: String(student.id || "ללא תז"),
                  className: 'id-label',
                  color: 'black'
                }}
              />
            )
          ))}
        </GoogleMap>
      </APIProvider>

      {students.length === 0 && (
        <div style={{ textAlign: 'center', padding: '10px', color: 'red', fontWeight: 'bold' }}>
          לא נמצאו מיקומים, ודאי שיש מיקומים מעודכנים
        </div>
      )}
    </div>
  );
};

export default MapComponent;