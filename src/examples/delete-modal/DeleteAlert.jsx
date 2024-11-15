import React from "react";

import Swal from "sweetalert2";

export const DeleteAlert = async (title, func) => {

    try {
        await Swal.fire({
            title: `${title} O'chirish`,
            text: `Ma'lumotni o'chirishga rozimisiz!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ha, o'chirish",
            cancelButtonText: "Bekor qilish",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    "O'chirildi!",
                    `${title} muvaffaqqiyatli o'chirildi`,
                    "success"
                );
                func()
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
