import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreSession } from './store/authSlice';
import AppRoutes from './routes/AppRoutes';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });

    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token) {
      let user = null;
      try {
        user = userJson ? JSON.parse(userJson) : null;
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
      
      dispatch(restoreSession({ token, user }));
    }
  }, [dispatch]);

  return (
    <AppRoutes />
  );
}

export default App;
