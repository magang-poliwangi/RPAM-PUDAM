import axiosClient from './axiosClient';

export const identifikasiBahayaApi = {
  getAll: (params) => axiosClient.get('/identifikasi-bahaya', { params }),
  getById: (id) => axiosClient.get(`/identifikasi-bahaya/${id}`),
  create: (data) => axiosClient.post('/identifikasi-bahaya', data),
  update: (id, data) => axiosClient.put(`/identifikasi-bahaya/${id}`, data),
  remove: (id) => axiosClient.delete(`/identifikasi-bahaya/${id}`),
};

export const penilaianRisikoApi = {
  getAll: (params) => axiosClient.get('/penilaian-risiko', { params }),
  getById: (id) => axiosClient.get(`/penilaian-risiko/${id}`),
  create: (data) => axiosClient.post('/penilaian-risiko', data),
  update: (id, data) => axiosClient.put(`/penilaian-risiko/${id}`, data),
  remove: (id) => axiosClient.delete(`/penilaian-risiko/${id}`),
};

export const kajiUlangApi = {
  getAll: (params) => axiosClient.get('/m4', { params }),
  getById: (id) => axiosClient.get(`/m4/${id}`),
  create: (data) => axiosClient.post('/m4', data),
  update: (id, data) => axiosClient.put(`/m4/${id}`, data),
  remove: (id) => axiosClient.delete(`/m4/${id}`),
};

export const rencanaPerbaikanApi = {
  getAll: (params) => axiosClient.get('/m5', { params }),
  getById: (id) => axiosClient.get(`/m5/${id}`),
  create: (data) => axiosClient.post('/m5', data),
  update: (id, data) => axiosClient.put(`/m5/${id}`, data),
  remove: (id) => axiosClient.delete(`/m5/${id}`),
};

export const pemantauanApi = {
  getAll: (params) => axiosClient.get('/pemantauan', { params }),
  getById: (id) => axiosClient.get(`/pemantauan/${id}`),
  create: (data) => axiosClient.post('/pemantauan', data),
  update: (id, data) => axiosClient.put(`/pemantauan/${id}`, data),
  remove: (id) => axiosClient.delete(`/pemantauan/${id}`),
};

export const dashboardApi = {
  get: () => axiosClient.get('/dashboard'),
};

export const auditLogApi = {
  getAll: (params) => axiosClient.get('/audit-logs', { params }),
};

export const importApi = {
  importModule: (module, file) => {
    const form = new FormData();
    form.append('file', file);
    return axiosClient.post(`/import/${module}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const exportApi = {
  exportModule: (module, params) =>
    axiosClient.get(`/export/${module}`, { params, responseType: 'blob' }),
  exportAll: (params) =>
    axiosClient.get('/export/all', { params, responseType: 'blob' }),
};
