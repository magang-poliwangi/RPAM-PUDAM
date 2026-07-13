import { axiosInstance } from "./axios-instance.js";

const rencanaPerbaikanApi = (() => {
    const create = (payload) => axiosInstance.post("/rencana-perbaikan", payload);

    const getAll = (params = {}) => axiosInstance.get("/rencana-perbaikan", { params });

    const getById = (id) => axiosInstance.get(`/rencana-perbaikan/${id}`);

    const update = (id, payload) => axiosInstance.put(`/rencana-perbaikan/${id}`, payload);

    const remove = (id) => axiosInstance.delete(`/rencana-perbaikan/${id}`);

    return {
        create,
        getAll,
        getById,
        update,
        remove,
    };
})();

export default rencanaPerbaikanApi;
