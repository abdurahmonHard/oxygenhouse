import React from "react";
import { LiaFileDownloadSolid } from "react-icons/lia";

const OrdersTable = ({ selectAll, handleSelectAll }) => {
  return (
    <div className="bg-gray-300  w-full  py-3 sticky top-0 left-0 z-[5]">
      <div
        className={`text-sm ${
          !handleSelectAll && ""
        } flex gap-2 items-center font-semibold px-2 `}
      >
        {handleSelectAll && (
          <div className="py-2 px-2 flex items-center gap-3 col-span-1 ">
            <input
              id="hs-table-pagination-checkbox-all"
              type="checkbox"
              className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <label
              htmlFor="hs-table-pagination-checkbox-all"
              className="sr-only"
            >
              Checkbox
            </label>
            <span>№</span>
          </div>
        )}
        <div className="grid grid-cols-12 items-center text-center divide-x-2 divide-black w-full ">
          <div className="col-span-1">Sotuvchi</div>
          <div className="col-span-1">Mijoz</div>
          <div className="col-span-1">To'lov turi</div>
          <div className="col-span-2">Jami qiymat</div>
          <div className="col-span-2">Boshlang'ich to'lov</div>
          <div className="col-span-2">Qarzdorlik</div>
          <div className="col-span-2">To'langan</div>
          <div className="col-span-1">Yaratilgan</div>
        </div>
        <div>
          <LiaFileDownloadSolid className="text-xl" />
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
