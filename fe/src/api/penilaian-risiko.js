import { axiosInstance } from "./axios-instance";

const penilaianRisikoApi = (() => {
    const create = async (payload) => {
        const { data } = await axiosInstance.post("/penilaian-risiko", payload);
        return data;
    };

    const getAll = async (params = {}) => {
        const { data } = await axiosInstance.get("/penilaian-risiko", { params });
        return data;
    };

    const getById = async (id) => {
        const { data } = await axiosInstance.get(`/penilaian-risiko/${id}`);
        return data;
    };

    const update = async (id, payload) => {
        const { data } = await axiosInstance.put(`/penilaian-risiko/${id}`, payload);
        return data;
    };

    const remove = async (id) => {
        const { data } = await axiosInstance.delete(`/penilaian-risiko/${id}`);
        return data;
    };

    return { create, getAll, getById, update, remove };
})();

export { penilaianRisikoApi };