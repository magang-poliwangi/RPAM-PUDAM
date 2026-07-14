import { axiosInstance } from "./axios-instance";

const lokasiSpamApi = (() => {
    const create = async (payload) => {
        const { data } = await axiosInstance.post("/lokasi-spam", payload);
        return data;
    };

    const getAll = async (params = {}) => {
        const { data } = await axiosInstance.get("/lokasi-spam", { params });
        return data;
    };

    const getById = async (id) => {
        const { data } = await axiosInstance.get(`/lokasi-spam/${id}`);
        return data;
    };

    const update = async (id, payload) => {
        const { data } = await axiosInstance.put(`/lokasi-spam/${id}`, payload);
        return data;
    };

    const remove = async (id) => {
        const { data } = await axiosInstance.delete(`/lokasi-spam/${id}`);
        return data;
    };

    return { create, getAll, getById, update, remove };
})();

export { lokasiSpamApi };