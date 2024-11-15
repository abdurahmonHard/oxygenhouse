import React, { useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";

const TABLE_HEAD = [
  "sotuvchi",
  "mijoz",
  "tel raqam",
  "zakolat so'm",
  "zakolat $",
  "xonadon raqami",
  "xonadon hajmi",
  "band qilingan kun",
  "tugash muddati",
];

const TableHead = ({ detail, selectAll, handleSelectAll }) => {
  const { profile } = useContext(AuthContext);

  const tableHeaders = useMemo(
    () =>
      TABLE_HEAD.map((item, idx) => (
        <div
          key={idx}
          className="col-span-1 text-center font-semibold px-2 py-2"
        >
          {item}
        </div>
      )),
    []
  );
  return (
    <div className="uppercase text-xs bg-gray-300 w-full z-5">
      <div className="border-b border-black flex justify-center items-center">
        {!detail && (
          <div className="flex items-center px-5 py-2 gap-3">
            <input
              id="hs-table-pagination-checkbox-all"
              type="checkbox"
              className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <div className="text-center font-semibold">№</div>
          </div>
        )}
        <div
          className={`grid ${
            detail ? "grid-cols-9" : "grid-cols-10"
          } w-full items-center cols`}
        >
          {tableHeaders}
          {profile?.roles?.role_name !== "Seller" && !detail && (
            <div className="text-center font-semibold px-8 py-2">sotuv</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableHead;
