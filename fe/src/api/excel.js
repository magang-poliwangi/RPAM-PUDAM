import { axiosInstance } from "./axios-instance";
const excelApi = {
    exportExcel: async () => {
        const response = await axiosInstance.get("/excel/export", {
            responseType: "blob",
        });
        return response.data;
    },

    importExcel: async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await axiosInstance.post("/excel/import", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },
};

export { excelApi };