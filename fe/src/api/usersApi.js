import axiosClient from './axiosClient';

export const usersApi = {
  getAll: (params) => axiosClient.get('/users', { params }),
  getById: (id) => axiosClient.get(`/users/${id}`),
  create: (data) => axiosClient.post('/users', data),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  remove: (id) => axiosClient.delete(`/users/${id}`),
  changeRole: (id, role) => axiosClient.patch(`/users/${id}/role`, { role }),
  activate: (id) => axiosClient.patch(`/users/${id}/activate`),
  deactivate: (id) => axiosClient.patch(`/users/${id}/deactivate`),
};
