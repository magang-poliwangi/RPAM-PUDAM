import { axiosInstance } from "./axios-instance";

const identifikasiDanKejadianBahayaApi = (() => {
    const create = async (payload) => {
        const { data } = await axiosInstance.post("/identifikasi-dan-kejadian-bahaya", payload);
        return data;
    };

    const getAll = async (params = {}) => {
        const { data } = await axiosInstance.get("/identifikasi-dan-kejadian-bahaya", { params });
        return data;
    };

    const getById = async (id) => {
        const { data } = await axiosInstance.get(`/identifikasi-dan-kejadian-bahaya/${id}`);
        return data;
    };

    const update = async (id, payload) => {
        const { data } = await axiosInstance.put(`/identifikasi-dan-kejadian-bahaya/${id}`, payload);
        return data;
    };

    const remove = async (id) => {
        const { data } = await axiosInstance.delete(`/identifikasi-dan-kejadian-bahaya/${id}`);
        return data;
    };

    return { create, getAll, getById, update, remove };
})();

export { identifikasiDanKejadianBahayaApi };