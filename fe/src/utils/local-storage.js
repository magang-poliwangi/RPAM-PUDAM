export const getToken = () => localStorage.getItem("token");
export const putAccessToken = (token) => {
    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
};
