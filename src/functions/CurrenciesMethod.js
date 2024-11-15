import { toast } from "react-toastify";
import { instance } from "../api/Api";

export const getCurrencies = async () => {
  try {
    const response = await instance.get(`/currency/list`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const getCurrenciesAll = async () => {
  try {
    const response = await instance.get(`/currency/get-rates`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const postCurrencies = async (value) => {
  await instance
    .post(`/currency/add`, value)
    .then(() => toast.success("Pul birligi qo'shildi"));
};

export const updateCurrencies = async (value) => {
  await instance.patch(`/currency/option/${value.id}`, value).then(() => {
    toast.success("To'lov turi o'zgartirildi");
  });
};
