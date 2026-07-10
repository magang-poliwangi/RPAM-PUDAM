import axios from 'axios';

// Catatan: dibuat berdiri sendiri (tidak bergantung ke fitur auth/redux)
// karena scope saat ini cuma modul M6.2. Kalau nanti fitur auth dibangun,
// gampang disambungkan: ganti localStorage.getItem di bawah dengan
// store.getState().auth.token.
const TOKEN_STORAGE_KEY = 'rpam_token';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;