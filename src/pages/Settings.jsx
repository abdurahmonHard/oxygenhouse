import React from "react";
import { instance } from "../api/Api";

const Settings = () => {
  const downloadFile = () => {
    instance
      .get("/wordexport/export", { responseType: "blob" })
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
    <div>
      <button onClick={() => downloadFile()}>Download</button>
    </div>
  );
};

export default Settings;
