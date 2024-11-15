import React from "react";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router";
import { instance } from "../api/Api";
import { ToastContainer } from "react-toastify";

export default function Layout() {
  const navigate = useNavigate();
  instance.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if ((error.response && error?.response?.status === 401) || error?.response?.status === 403) {
      ["token", "userProfile"].forEach((item) => {
        sessionStorage.removeItem(item);
      });

      navigate("/login");
    } else if (error.response && error.response.status === 500) {
      navigate("/error-page");
    }

    return Promise.reject(error);
  });

  return (<div className="bg-[#F2F2F2]">
    <div className="sticky top-0 z-20">
      <Navbar />
    </div>
    <div className="flex">
      <div
        className="sticky top-[70px] z-10 whitespace-nowrap"
        style={{ height: "calc(100vh - 70px)" }}
      >
        <Sidebar />
      </div>
      <div className="w-full relative overflow-hidden md:p-4 sx:p-2.5">
        <Outlet />
      </div>
    </div>
  </div>);
}
