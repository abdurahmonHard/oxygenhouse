/* eslint-disable react/prop-types */
import React from "react";
import { instance } from "../../api/Api";
import { FiDownload } from "react-icons/fi"

export default function DownloadFile({ id }) {
   const downloadFile = () => {
      instance
         .get(`/wordexport/export/${id}`, { responseType: "blob" })
         .then((response) => {
            const blob = response.data;
            // Faylni avtomatik ravishda yuklab olish uchun link yaratamiz
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "contract.docx"); // Faylni nomi
            document.body.appendChild(link);
            link.click();

            // URL ni bo'shatamiz
            window.URL.revokeObjectURL(url);
         })
         .catch((error) => {
            console.error("Error:", error);
         });
   };
   return (
      <button className={`w-[32px] h-[32px] bg-primary rounded-full text-white flex justify-center items-center`} onClick={() => downloadFile()}>
         <FiDownload />
      </button>
   );
}
