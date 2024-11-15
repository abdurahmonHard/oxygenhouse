import { toast } from "react-toastify";
import { instance } from "../api/Api";

export const getAllOrders = async (id) => {
  try {
    const response = await instance.get(`/orders/order-list/${id}`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};
export const getOrdersByAppartmentID = async (id) => {
  try {
    const response = await instance.get(`/orders/orderlistapartment/${id}`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const getOrderListDue = async (value) => {
  try {
    const response = await instance.post(`/orders/listdue`, value);
    return response?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await instance.get(`/credit-plan/all/${id}`);
    return response?.data?.data || {};
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const deleteOrders = async (id) => {
  await instance.post(`/orders/delete`, id);
};

// booking appartments
export const bookingAppartments = async (id) => {
  await instance
    .patch(`/apartments/bron/${id}`)
    .then((res) => {
      res?.data.success
        ? toast.success("Kvartira band qilindi")
        : toast.success("Band qilishda xatolik");
    })
    .then(() => {});
};

// canceled orders

export const addCanceledOrders = async (id) => {
  await instance
    .post(`/orders/cancel`, id)
    .then(() => toast.success("Shartnoma bekor qilindi!"));
};

export const getCanceledOrders = async (id) => {
  try {
    const response = await instance.get(`/orders/canceled-orders/${id}`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const getComplatedOrders = async (id) => {
  try {
    const response = await instance.get(`/orders/done-orders/${id}`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};
