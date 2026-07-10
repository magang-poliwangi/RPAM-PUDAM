import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth', credentials),
  getProfile: () => axiosClient.get('/auth'),
};
