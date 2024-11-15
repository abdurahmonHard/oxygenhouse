import React from "react";

import Swal from "sweetalert2";

export const RestoreAlert = async (title, func) => {
  try {
    await Swal.fire({
      title: `${title} Tiklash`,
      text: `Ma'lumotni tiklashga rozimisiz!`,
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ha",
      cancelButtonText: "Yo'q",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("tiklandi !", `${title} muvaffaqqiyatli tiklandi`, "success");
        func();
      }
    });
  } catch (error) {
    console.log(error);
  }
};
