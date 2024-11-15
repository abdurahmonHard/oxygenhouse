import { instance } from "../api/Api";
import { toast } from "react-toastify";

// towns

export const getCountData = async () => {
  try {
    const response = await instance.get(`/town/get-count`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const getOneTownById = async (id) => {
  try {
    const response = await instance.get(`/town/all-one/${id}`);
    return response?.data?.data || {};
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
}

export const postProject = async (value) => {
  await instance.post("/town/add", value).then(() => {
    toast.success("Majmua yaratildi!");
  });
};

export const deleteTown = async (id) => {
  await instance.delete(`/town/delete/${id}`)
}

export const editTown = async (data) => {
  await instance.patch(`/town/edit/${data.id || 0}`, data).then(() => toast.success("Majmua o'zgartirildi"));
}

export const getHomepage = async () => {
  try {
    const response = await instance.get(`/town/homepage`);
    return response?.data || {};
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};
// buildings
export const getAllBuildings = async (id) => {
  try {
    const response = await instance.get(`/buildings/all/${id}`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const getBuildingById = async (id) => {
  try {
    const response = await instance.get(`/buildings/${id}`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const postBuilding = async (value) => {
  await instance.post("/buildings/add", value).then(() => {
    toast.success("Bino qo'shildi!");
  });
};

export const editBuilding = async (item) => {
  await instance.patch(`/buildings/edit/${item.id}`, item).then(() => {
    toast.success("Bino o'zgartirildi");
  });
};

export const deleteBuilding = async (id) => {
  await instance.delete(`/buildings/delete/${id}`);
};

// regionList
export const getRegionList = async () => {
  try {
    const response = await instance.get(`/regions/regionlist`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

export const getDistrictList = async () => {
  try {
    const response = await instance.get(`/regions/distrlist`);
    return response?.data?.data || [];
  } catch (error) {
    return { error: "Ma'lumotlar olishda xatolik yuz berdi" };
  }
};

// get all customer
export const getAllCustomers = async (pageParam = 1) => {
  return instance
    .get(`/clients/all?page=${pageParam}`)
    .then((res) => {
      return res?.data?.data || [];
    })
    .catch((err) => {
      return err.response.data;
    });
};

// apartments
export const createApartment = async (value) => {
  await instance.post(`/apartments/new/${value.id}`, value).then(() => {
    toast.success("Xona qo'shildi");
  });
};

export const getAppartmentsById = async (id) => {
  return instance
    .get(`/apartments/get/${id}`)
    .then((res) => {
      return res?.data || [];
    })
    .catch((err) => {
      return err.response.data;
    });
};

export const deleteApartmentByFloorId = async (id) => {
  await instance.delete(`/apartments/delete/${id}`);
};

export const editApartment = async (value) => {
  await instance.patch(`/apartments/edit/${value.id}`, value).then(() => {
    toast.success("Xona o'zgartirildi");
  });
};

// entrances
export const postEntrance = async (id) => {
  await instance.post(`/entrances/${id}`).then(() => {
    toast.success("Podyez qo'shildi");
  });
};

export const deleteEntrance = async (id) => {
  await instance.delete(`/entrances/delete/${id}`);
};

export const getAllEntranceById = async (id) => {
  return instance
    .get(`/entrances/all/${id}`)
    .then((res) => {
      return res?.data || [];
    })
    .catch((err) => {
      return err.response.data;
    });
};

// floors

export const postFloor = async (value) => {
  await instance.post(`/floors/${value}`).then(() => {
    toast.success("Qavat qo'shildi");
  });
};

export const deleteFloors = async (id) => {
  await instance.delete(`/floors/delete/${id}`);
};

// apartment info
export const getApartmentsInfo = async (id) => {
  return instance
    .get(`/apartments/info/${id}`)
    .then((res) => {
      return res?.data.data || {};
    })
    .catch((err) => {
      return err.response.data;
    });
};

// file uploads

export const addImage = async (data) => {
  try {
    const response = await instance.post("/file-upload/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Rasm joylandi");
    return response.data.data || {}; // Serverdan qaytarilgan javobni qaytarish
  } catch (error) {
    console.error(error);
    toast.error("Rasm joylanmadi");
    throw error; // Xatoni tashlash, bu xato useMutation tomonidan qaytariladi
  }
};

export const getImage = async (id) => {
  try {
    return await instance
      .get(`/file-upload/${id}`, { responseType: "blob" })
      .then((response) => {
        const blob = response.data;
        const url = window.URL.createObjectURL(new Blob([blob]));
        return url
      })
  } catch (error) {
    return { error: 'Ma\'lumotlar olishda xatolik yuz berdi' };
  }
}

// get paymentType
export const getPaymentType = async (id) => {
  return instance
    .get(`/payment-methods/${id}`)
    .then((res) => {
      return res?.data || [] || {};
    })
    .catch((err) => {
      return err.response.data;
    });
};

// get contract
export const Contract = async (id) => {
  return instance
    .get(`/orders/order-list/${id}`)
    .then((res) => {
      return res?.data.data || [];
    })
    .catch((err) => {
      return err.response.data;
    });
};

// get contract number
export const getContractNumber = async () => {
  return instance
    .get(`/orders/last`)
    .then((res) => {
      return res?.data.data || {};
    })
    .catch((err) => {
      return err.response.data;
    });
};

// post payment
export const postPayment = async (value) => {
  await instance
    .post("/orders/add", value)
    .then((res) => {
      // console.log(res);
      toast.success("Shartnoma qo'shildi");
    })
    .catch(() => {
      toast.error("Shartnoma qo'shishda xatolik");
    });
};

// post bron
export const postBooking = async (value) => {
  await instance.post("/booking/new-booking", value).then(() => {
    toast.success("Xonadon band qilindi");
  })
    .catch(() => {
      toast.success("Band qilishda xatolik");
    })
};

// cancel bron
export const addCanceledBooking = async (value) => {
  await instance.post("/booking/cancel", value).then(() => {
    toast.success("Buyurtma bekor qilindi");
  })

};

// get user by bron appartment

export const getBronUser = async (id) => {
  return instance
    .get(`/booking/${id}`)
    .then((res) => {
      return res?.data?.data || []
    })
    .catch((err) => {
      return err.response.data;
    });
}


// get all booking appartment
export const getBookingAppartment = async (pageParam = 1) => {
  return instance
    .get(`/booking/all?page=${pageParam}`)
    .then((res) => {
      // console.log(res);
      return res?.data?.data || []
    })
    .catch((err) => {
      return err.response.data;
    });
}


export const getBookingById = async (id) => {
  return instance
    .get(`/booking/${id}`)
    .then((res) => {
      return res?.data?.data || []
    })
    .catch((err) => {
      return err.response.data;
    });
}




