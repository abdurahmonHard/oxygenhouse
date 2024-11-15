import React from "react";
import { useNavigate } from "react-router";

export default function ServerErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-center">
      <div className="flex flex-col justify-center items-center gap-5">
        <img
          src="https://i.imgur.com/qIufhof.png"
          className="w-64 h-56 mx-auto"
          alt="Error Image"
        />
        <h1 className="mt-4 text-7xl text-red-500">500</h1>
        <p className="text-xl font-semibold">Serverdagi ichki xatolik</p>
        <button
          onClick={() => navigate("/")}
          type="button"
          className="disabled:bg-gray-400 flex items-center border border-slate-300 gap-2 bg-primary text-white text-sm p-[6px] rounded whitespace-nowrap px-5 hover:opacity-90 duration-200"
        >
          <p>Bosh Sahifa</p>
        </button>
      </div>
    </div>
  );
}
