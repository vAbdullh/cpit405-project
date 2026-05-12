import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    // Action to restore session from localStorage on app load
    restoreSession: (state, action) => {
      if (action.payload.token) {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
      }
    }
  },
});

export const { loginSuccess, logout, restoreSession } = authSlice.actions;

export default authSlice.reducer;
