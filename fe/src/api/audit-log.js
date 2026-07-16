import { axiosInstance } from "./axios-instance";

const getAll = async (params = {}) => {
    const { data } = await axiosInstance.get('/audit-log', { params });
    return data;
};

export const auditLogApi = { getAll };