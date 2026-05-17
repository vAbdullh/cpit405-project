import { createSlice } from '@reduxjs/toolkit';

const storedToken = localStorage.getItem('token');
let storedUser = null;
try {
  const userJson = localStorage.getItem('user');
  storedUser = userJson ? JSON.parse(userJson) : null;
} catch (e) {
  console.error('Failed to parse user from localStorage on init');
}

const initialState = {
  isAuthenticated: !!storedToken,
  token: storedToken || null,
  user: storedUser || null,
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
    },
    // Action to dynamically update user details in store and localStorage
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
});

export const { loginSuccess, logout, restoreSession, updateUser } = authSlice.actions;

export default authSlice.reducer;
