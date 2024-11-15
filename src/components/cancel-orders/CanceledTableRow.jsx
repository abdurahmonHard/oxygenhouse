import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderById, getOrderListDue } from "../../functions/OrderMethods";
import ModalTable from "../../examples/modalTable/ModalTable";
import { format } from "date-fns";
import { AuthContext } from "../../context/AuthContext";

const CanceledTableRow = ({ item, isSelected, handleRowSelection, index }) => {
  const { data, isLoading } = useQuery(["getOrderById", item?.id], () =>
    getOrderById(item.id)
  );

  const [openTable, setOpenTable] = useState(false);
  const { profile } = useContext(AuthContext);
  const formattedDate = (value) => {
    return format(new Date(value), "dd-MM-yyyy");
  };
  // console.log(item);

  const handleGetContract = (e) => {
    setOpenTable(true);
  };
  return (
    <>
      <div className="w-[1000px] lg:w-full">
        <div
          key={item?.id}
          className={`hover:bg-white/10 bg-white border text-sm flex gap-2 items-center ${
            item?.order_status === "refunded"
              ? "opacity-40 cursor-default select-none"
              : ""
          }`}
        >
          {/* <div className="py-5 pl-4 col-span-1 flex items-center gap-3">
                  <input
                     id={`hs-table-pagination-checkbox-${item?.id}`}
                     type="checkbox"
                     className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-default"
                     checked={isSelected}
                     onChange={(e) => handleRowSelection(item?.id, e.target.checked)}
                     disabled={item?.order_status === "refunded"}
                  />
                  <label
                     htmlFor={`hs-table-pagination-checkbox-${item?.id}`}
                     className="sr-only"
                  >
                     Checkbox
                  </label>
                  <div className="col-span-1">{index + 1}</div>
               </div> */}
          <div className="gap-2 px-3 grid grid-cols-12 py-3 text-center items-center w-full">
            <div className="col-span-1">{index + 1}</div>
            <div className="col-span-1 flex flex-wrap">
              {item.users?.first_name} {item?.users?.last_name}
            </div>
            <div className="col-span-1 flex items-center justify-center gap-2 flex-wrap">
              <p>{item?.clients?.first_name}</p>
              <p>{item?.clients?.last_name}</p>
            </div>
            <button
              onClick={() => handleGetContract(item.id)}
              className={`cursor-pointer col-span-1 text-center p-1.5 font-semibold rounded ${
                item?.paymentMethods?.name_alias === "naqd"
                  ? "border border-primary text-primary bg-primary bg-opacity-10"
                  : item?.paymentMethods?.name_alias === "ipoteka"
                  ? "border border-violet-500 text-violet-500 bg-violet-500 bg-opacity-10"
                  : item?.paymentMethods?.name_alias === "subsidia"
                  ? "border border-orange text-orange bg-orange bg-opacity-10"
                  : "border border-[#85bb65] text-[#85bb65] bg-[#85bb65] bg-opacity-10"
              }`}
            >
              {item?.paymentMethods?.name_alias}
            </button>
            <div className="col-span-2 flex items-center justify-between p-2">
              <p>{Number(item?.total_amount)?.brm()}</p>
              <p className="text-[#85bb65] font-bold">
                {item?.total_amount_usd?.brm()} $
              </p>
            </div>
            <div className="col-span-2 p-2 flex justify-between">
              <p>{Number(item?.initial_pay)?.brm()}</p>
              <p className="text-[#85bb65] font-bold">
                {Math.floor(
                  Number(item?.initial_pay / item?.currency_value)
                )?.brm()}{" "}
                $
              </p>
            </div>
            <div className="col-span-2 p-2 flex justify-between">
              <p>{Number(item?.left_amount)?.brm()}</p>
              <p className="text-[#85bb65] font-bold">
                {Math.floor(
                  Number(item?.left_amount / item?.currency_value)
                )?.brm()}{" "}
                $
              </p>
            </div>
            <div className="col-span-1">{formattedDate(item?.created_at)}</div>
          </div>
        </div>
      </div>
      {profile?.roles?.role_name !== "Seller" ? (
        <ModalTable
          loading={isLoading}
          isOpen={openTable}
          onClose={setOpenTable}
          title={
            item?.paymentMethods?.name_alias === "naqd"
              ? "Naqd to'lash"
              : item?.paymentMethods?.name_alias === "ipoteka"
              ? "Ipoteka to'lash"
              : item?.paymentMethods?.name_alias === "subsidia"
              ? "Subsidia to'lash"
              : "Dollar to'lash"
          }
          data={data}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default CanceledTableRow;
