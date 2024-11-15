import { toast } from "react-toastify";
import { instance } from "../api/Api";

export const getAllPayments = async (pageParam = 1) => {
  try {
    const response = await instance.get(`/payments/list?page=${pageParam}`);
    return response?.data.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const addPayment = async (item) => {
  await instance
    .post("/payments/new-payment", item)
    .then(() => toast.success("To'lov amalga oshirildi"));
};

export const deletePayment = async (id) => {
  await instance.post(`/payments/delete`, id);
};

export const restorePayment = async (id) => {
  await instance.post(`/payments/recover`, id);
};

export const updatePayment = async (data) => {
  await instance
    .delete(`/payments/update/${data.id}`, data)
    .then(() => toast.success("To'lov o'zgartirildi"));
};
