import { toast } from "react-toastify";
import { instance } from "../api/Api";

export const getCaisher = async () => {
    try {
        const response = await instance.get(`/caisher`);
        return response?.data?.data || []
    } catch (error) {
        return { error: 'Ma\'lumotlar olishda xatolik yuz berdi' };
    }
}

export const postCaisher = async (value) => {
    await instance.post(`/caisher`, value).then(() => toast.success("Kassa qo'shildi"))
}

export const updateCaisher = async (value) => {
    await instance.patch(`/caisher/${value.id}`, value,).then(() => {
        toast.success("Kassa o'zgartirildi");
    });
}

export const deleteCaisher = async (id) => {
    await instance.delete(`/caisher/${id}`)
}