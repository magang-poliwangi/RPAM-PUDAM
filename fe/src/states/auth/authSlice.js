import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';

export const loginThunk = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authApi.login(credentials);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login gagal');
  }
});

export const getProfileThunk = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.getProfile();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Gagal memuat profil');
  }
});

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: { id: 1, username: 'admin', role: 'ADMIN' },
    token: 'mock-admin-token',
    isAuthenticated: true,
    status: 'succeeded',
    error: null,
  },
  reducers: {
    logout(state) {
      // Do nothing to keep the user permanently logged in
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export default authSlice.reducer;
