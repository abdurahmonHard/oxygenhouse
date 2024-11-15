import { instance } from "../api/Api";

export const getReports = async (date) => {
  return await instance
    .get(`/report/all-payment/${date}`)
    .then((res) => {
      return res?.data.data || {};
    })
    .catch((err) => {
      return err;
    });
};

export const getOrderAppartments = async () => {
  return await instance
    .get(`/report/order-apartments`)
    .then((res) => {
      return res?.data.data || {};
    })
    .catch((err) => {
      return err;
    });
};

export const getCaisherReport = async (date) => {
  return await instance
    .get(`/report/caisher-report/${date}`)
    .then((res) => {
      return res?.data.data || {};
    })
    .catch((err) => {
      return err;
    });
};

export const getClientsReport = async () => {
  return await instance
    .get(`/report/client-apartment`)
    .then((res) => {
      return res?.data.data || {};
    })
    .catch((err) => {
      return err;
    });
};


export const getSummaryReport = async () => {
  return await instance
    .get(`/report/summary-report`)
    .then((res) => {
      return res?.data?.data || [];
    })
    .catch((err) => {
      return err;
    });
}