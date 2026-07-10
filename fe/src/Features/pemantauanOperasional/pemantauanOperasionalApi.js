import axiosClient from '../../api/axiosClient.js';

const BASE = '/pemantauan'; // sesuai api.md §5.5 — BUKAN /pemantauan-operasional

const getAll = (params) => axiosClient.get(BASE, { params });

const getById = (id) => axiosClient.get(`${BASE}/${id}`);

const create = (payload) => axiosClient.post(BASE, payload);

const update = (id, payload) => axiosClient.put(`${BASE}/${id}`, payload);

const remove = (id) => axiosClient.delete(`${BASE}/${id}`);

const getDropdownKajiUlangRisiko = () => axiosClient.get(`${BASE}/dropdown/kaji-ulang-risiko`);

export {
  getAll, getById, create, update, remove, getDropdownKajiUlangRisiko,
};