import { instance } from "../api/Api";

export const getMe = async () => {
    return await instance
        .get(`/users/profile`, { withCredentials: true })
        .then((res) => {
            console.log("Javob:", res.data); // Javobni konsolga yozish
            return res || {};
        })
        .catch((err) => {
            console.log("Xato:", err.response); // Xatoni konsolga yozish
            return err;
        });
};
