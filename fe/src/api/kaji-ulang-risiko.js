import { axiosInstance } from "./axios-instance";

const kajiUlangRisikoApi = (() => {
    const create = async (payload) => {
        const { data } = await axiosInstance.post("/kaji-ulang-risiko", payload);
        return data;
    };

    const getAll = async (params = {}) => {
        const { data } = await axiosInstance.get("/kaji-ulang-risiko", { params });
        return data;
    };

    const getById = async (id) => {
        const { data } = await axiosInstance.get(`/kaji-ulang-risiko/${id}`);
        return data;
    };

    const update = async (id, payload) => {
        const { data } = await axiosInstance.put(`/kaji-ulang-risiko/${id}`, payload);
        return data;
    };

    const remove = async (id) => {
        const { data } = await axiosInstance.delete(`/kaji-ulang-risiko/${id}`);
        return data;
    };

    return { create, getAll, getById, update, remove };
})();

export { kajiUlangRisikoApi };