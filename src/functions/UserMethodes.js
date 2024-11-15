import { toast } from "react-toastify";
import { instance } from "../api/Api";

export const getAllUsers = async (id) => {
  return await instance
    .get(`/users/list/${id}/`)
    .then((res) => {
      return res?.data.data || {};
    })
    .catch((err) => {
      return err;
    });
};

export const addUser = async (value) => {
  await instance
    .post("/users/save", value)
    .then((res) =>
      res
        ? toast.success("Foydalanuvchi qo'shildi")
        : toast.error("Foydalanuvchi qo'shilmadi")
    )
    .catch((err) => toast.error("Foydalanuvchi qo'shishda xatolik: ", err));
};

export const updateUser = async (value) => {
  await instance
    .patch(`/users/update/${value.id}`, value)
    .then((res) => {
      res
        ? toast.success("Foydalanuvchi o'zgartirildi")
        : toast.error("Foydalanuvchi o'zgartirilmadi");
    })
    .catch((err) => {
      toast.error(`Foydalanuvchini o'zgartirishda xatolik: ${err}`);
    });
};

export const deleteUser = async (value) => {
  await instance
    .post(`/users/delete`, value)
    .then((res) => {
      res
        ? toast.success("Foydalanuvchi o'chirildi")
        : toast.error("Foydalanuvchi o'chirilmadi");
    })
    .catch((err) => {
      toast.error(`Foydalanuvchini o'chirishda xatolik: ${err}`);
    });
};

export const restoreUser = async (value) => {
  await instance
    .post(`/users/recover`, value)
    .then((res) => {
      res
        ? toast.success("Foydalanuvchi tiklandi")
        : toast.error("Foydalanuvchi tiklanmadi");
    })
    .catch((err) => {
      toast.error(`Foydalanuvchini tiklashda xatolik: ${err}`);
    });
};
// currency
export const getCurrencyList = async () => {
  try {
    const response = await instance.get(`/currency/list`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const addCurrencies = async (value) => {
  await instance
    .post(`/currency/exchange-rate/new`, value)
    .then(() => toast.success("Kurs o'zgartirildi!"));
};

export const getLastCurrency = async () => {
  try {
    const response = await instance.get(`/currency/exchange-rate/last`);
    return response?.data?.data || [] || {};
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};
