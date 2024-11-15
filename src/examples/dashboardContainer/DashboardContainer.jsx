import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";

const DashboardContainer = ({ icon, count, description, color }) => {
   return <div>
      <div className="h-[190px] select-none bg-white shadow-sm cursor-pointer rounded-lg flex flex-col justify-between p-5 hover:shadow-xl duration-200">
         <div className="flex justify-between">
            <div className={`text-[35px] ${color}`}>
               {icon}
            </div>
            <div className="bg-[#91C715] w-[40px] h-[25px] rounded-[30px] flex justify-center items-center">
               <AiOutlineEye className="text-[18px] text-white" />
            </div>
         </div>
         <div>
            <h1 className="font-bold">{count} dona</h1>
            <p className="text-sm sm:text-md font-semibold text-[#718096]">
               {description}
            </p>
         </div>
      </div>
   </div>;
};

export default DashboardContainer;
