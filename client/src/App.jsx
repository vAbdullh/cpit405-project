import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreSession } from './store/authSlice';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
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
