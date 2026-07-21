import { axiosInstance } from "./axios-instance";

const excelApi = (() => {
    const exportExcel = async (payload) => {
        const { data } = await axiosInstance.get("/bahaya-kontaminasi", payload);
        return data;
    };

    const importExcel = async (params = {}) => {
        const { data } = await axiosInstance.post("/bahaya-kontaminasi", { params });
        return data;
    };

})();

export { excelApi };