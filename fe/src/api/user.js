import { axiosInstance } from "./axios-instance.js";

//  USER 
const userApi = (() => {
    const createUser = async ({ username, password }) => {
        const { data } = await axiosInstance.post("/user", { username, password });
        return data.data.user;
    };

    const getSelf = async () => {
        const { data } = await axiosInstance.get("/user/me");
        return data.data.user;
    };

    const updateUser = async ({ id, username, password }) => {
        const { data } = await axiosInstance.put(`/user/${id}`, { username, password });
        return data.data.user;
    };

    const deleteUser = async (id) => {
        const { data } = await axiosInstance.delete(`/user/${id}`);
        return data.data;
    };

    const activateUser = async (id) => {
        const { data } = await axiosInstance.patch(`/user/active/${id}`);
        return data.data;
    };

    const deactivateUser = async (id) => {
        const { data } = await axiosInstance.patch(`/user/deactive/${id}`);
        return data.data;
    };

    const getAllUser = async () => {
        const { data } = await axiosInstance.get('/user');
        return data.data.users;
    };

    const getDetailUser = async (id) => {
        const { data } = await axiosInstance.get(`/user/${id}`)
        return data.data.user;
    }

    return {
        createUser,
        getAllUser,
        getSelf,
        getDetailUser,
        updateUser,
        deleteUser,
        activateUser,
        deactivateUser,
    }
})();
export default userApi;
