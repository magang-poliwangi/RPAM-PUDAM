import { putAccessToken } from "../utils/local-storage.js";
import { axiosInstance } from "./axios-instance.js";


//  AUTH 
const authApi = (() => {
    const login = async ({ username, password }) => {
        const { data } = await axiosInstance.post("/auth", { username, password });
        console.log("tes auth login");
        
        putAccessToken(data.data.accessToken);
        return data.data;
    };

    const logout = async () => {
        const { data } = await axiosInstance.delete("/auth");
        putAccessToken(null);
        return data;
    };
    return {
        login,
        logout
    }
})();

export default authApi;




