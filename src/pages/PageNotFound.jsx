import React from "react";
import notFoundImage from "../assets/images/404-page.gif";
import { Link } from "react-router-dom";

function PageNotFound() {
    return (
        <div className=" flex flex-col items-center justify-center w-screen h-screen">
            <img src={notFoundImage} alt="" />
            <h1 className="mb-10 sm:text-[22px] md:text-3xl">
                Kechirasiz, Sahifa Topilmadi!
            </h1>
            <Link
                className="border p-2 px-3 text-white rounded-md bg-primary"
                to={"/"}
            >
                Bosh Sahifaga Qaytish
            </Link>
        </div>
    );
}

export default PageNotFound;
