import { axiosInstance } from "./axios-instance";

const bahayakontaminasiApi = (() => {
    const create = async (payload) => {
        const { data } = await axiosInstance.post("/bahaya-kontaminasi", payload);
        console.log(data);
        
        return data;
    };

    const getAll = async (params = {}) => {
        const { data } = await axiosInstance.get("/bahaya-kontaminasi", { params });
        return data;
    };

    const getById = async (id) => {
        const { data } = await axiosInstance.get(`/bahaya-kontaminasi/${id}`);
        return data;
    };

    const update = async (id, payload) => {
        const { data } = await axiosInstance.put(`/bahaya-kontaminasi/${id}`, payload);
        return data;
    };

    const remove = async (id) => {
        const { data } = await axiosInstance.delete(`/bahaya-kontaminasi/${id}`);
        return data;
    };

    return { create, getAll, getById, update, remove };
})();

export { bahayakontaminasiApi };