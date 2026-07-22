import { axiosInstance } from "./axios-instance";

const pemantauanOperasionalApi = (() => {
    const create = async (payload) => {
        const { data } = await axiosInstance.post("/pemantauan-operasional", payload);
        return data;
    };

    const getAll = async (params = {}) => {
        const { data } = await axiosInstance.get("/pemantauan-operasional", { params });
        return data;
    };

    const getById = async (id) => {
        const { data } = await axiosInstance.get(`/pemantauan-operasional/${id}`);
        return data;
    };

    const update = async (id, payload) => {
        const { data } = await axiosInstance.put(`/pemantauan-operasional/${id}`, payload);
        return data;
    };

    const remove = async (id) => {
        const { data } = await axiosInstance.delete(`/pemantauan-operasional/${id}`);
        return data;
    };

    const getOptions = async () => {
        const { data } = await axiosInstance.get(
            "/pemantauan-operasional/options"
        );

        return data;
    };

    return { create, getAll, getOptions, getById, update, remove };
})();

export { pemantauanOperasionalApi };