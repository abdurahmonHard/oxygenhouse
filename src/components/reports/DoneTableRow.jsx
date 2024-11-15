import React, { useContext, useState } from "react";
import "./OderTable.css";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../../functions/OrderMethods";
import ModalTable from "../../examples/modalTable/ModalTable";
import { format } from "date-fns";
import { AuthContext } from "../../context/AuthContext";
import DownloadFile from "../Download/DownloadFile";

const DoneTableRow = ({
  item,
  isSelected,
  handleRowSelection,
  pageParam,
  index,
}) => {
  const { data, isLoading } = useQuery(["getOrderById", item?.id], () =>
    getOrderById(item.id)
  );

  const [openTable, setOpenTable] = useState(false);
  const { profile } = useContext(AuthContext);
  const formattedDate = (value) => {
    return format(new Date(value), "dd-MM-yyyy");
  };

  const [tooltipData, setTooltipData] = useState(null);
  const [tooltip, setTooltip] = useState(false);

  const handleTooltip = (data) => {
    setTooltipData(data);
    setTooltip(true);
  };

  const handleGetContract = (e) => {
    setOpenTable(true);
  };
  return (
    <>
      <div className="w-[1000px] lg:w-full sx:w-[1400px]">
        <div
          key={item?.id}
          className={`hover:bg-white/10 bg-white border text-sm flex gap-2 items-center`}
        >
          {pageParam && (
            <div className="py-4 pl-4 col-span-1 flex items-center gap-3">
              {/* <input
                id={`hs-table-pagination-checkbox-${item?.id}`}
                type="checkbox"
                className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={isSelected}
                onChange={(e) => handleRowSelection(item?.id, e.target.checked)}
              />
              <label
                htmlFor={`hs-table-pagination-checkbox-${item?.id}`}
                className="sr-only"
              >
                Checkbox
              </label> */}
              <div className="col-span-1">
                {(pageParam - 1) * 20 + index + 1}
              </div>
            </div>
          )}
          <div className="gap-2 px-3 grid grid-cols-12 text-center justify-center items-center w-full ">
            <div className="col-span-1">
              {item?.users?.first_name} {item?.users?.last_name}
            </div>
            <div
              onMouseEnter={() => handleTooltip(item)}
              onMouseLeave={() => setTooltip(false)}
              className="col-span-1 flex flex-col items-center justify-center select-none cursor-pointer relative text-primary font-semibold"
            >
              <p>{item?.clients?.first_name}</p>
              <p>{item?.clients?.last_name}</p>

              {/* tooltip */}
              {tooltip && tooltipData && (
                <div className="bg-white shadow-best rounded absolute -top-8 left-[110px] w-[450px] min-h-[110px] tooltip">
                  <div className="flex justify-between">
                    <p>Raqami</p>
                    <p className="text-xs">
                      {tooltipData?.clients?.contact_number}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>JSHSHIR</p>
                    <p className="text-xs">{tooltipData?.clients?.tin}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Manzili</p>
                    <p className="text-xs">{tooltipData?.clients?.address}</p>
                  </div>
                </div>
              )}
            </div>
            <div
              onClick={() => handleGetContract(item.id)}
              className={`cursor-pointer text-center p-1.5 font-semibold rounded ${
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
            </div>
            <div className="col-span-2 flex items-center justify-between px-4">
              <p>{Math.floor(Number(item?.total_amount))?.brm()}</p>
              <p className="text-[#85bb65] font-bold">
                {item?.total_amount_usd?.brm()} $
              </p>
            </div>
            <div className="col-span-2 px-4 flex justify-between">
              <p>{Number(item?.initial_pay)?.brm()}</p>
              <p className="text-[#85bb65] font-bold">
                {Math.floor(
                  Number(item?.initial_pay / item?.currency_value)
                )?.brm()}{" "}
                $
              </p>
            </div>
            <div className="col-span-2 text-green px-4 text-center">
              <p>{item?.clients.contact_number}</p>
            </div>
            <div className="col-span-1 px-4 text-center text-green font-semibold flex gap-2 justify-center">
              <p>
                {item.order_status === "completed"
                  ? "Tugatilgan"
                  : "Tugatilmagan"}
              </p>
            </div>
            <div className="col-span-1 pl-4">
              {formattedDate(item?.created_at)}
            </div>
            <div className="col-span-1 flex justify-center">
              <p>{item.id}</p>
            </div>
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
export default DoneTableRow;
