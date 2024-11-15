import React, { useState } from "react";
import Loading from "../../examples/loading/Loading";
import { BsSearch } from "react-icons/bs";
import { BsArrowLeftSquare, BsArrowRightSquare } from "react-icons/bs";
import OrdersTable from "./CanceledOrdersTable";
import TableRow from "./CanceledTableRow";
import CancelOrderPost from "./PostCanceledOrder";
import ExportToExcel from "../ExcelDownload/ExcelDownload";
import { format } from "date-fns";

const GetCancelOrders = ({ data, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  // console.log(data);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRowSelection = (id, checked) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else if (data) {
      setSelectedRows(data.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const filteredData = searchTerm
    ? data?.filter((item) => {
        if (item.clients) {
          const clientNames = `${item.clients.first_name} ${item.clients.last_name}`;
          return clientNames.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    : data;
  const formattedDate = (value) => {
    return format(new Date(value), "dd-MM-yyyy");
  };

  // console.log();

  if (isLoading) {
    return <Loading />;
  }
  const handleExportToExcel = () => {
    const exportData = filteredData?.map((item) => ({
      Sotuvchi: `${item?.users?.first_name} ${item?.users?.last_name}`,
      Mijoz: `${item.clients.first_name} ${item.clients.last_name}`,
      "To'lov turi": item?.paymentMethods?.name_alias,
      "Jami summa": Number(item?.total_amount)?.brm(),
      "Jami summa $": `${item?.total_amount_usd?.brm()} $`,
      "Boshlang'ich to'lov $": `${Math.floor(
        Number(item?.initial_pay / item?.currency_value)  
      )?.brm()} $`,
      "Boshlang'ich to'lov $": Number(item?.initial_pay)?.brm(),
      Qarzimiz: Number(item?.left_amount)?.brm(),
      "Qarzimizk $": `${Math.floor(
        Number(item?.left_amount / item?.currency_value)
      )?.brm()} $`,
      Yaratilgan: formattedDate(item?.created_at),
    }));

    ExportToExcel(exportData, "Bekor qilingan shartnomalar");
  };

  return (
    <div className="flex flex-col">
      <div className="py-3 px-4 ">
        <div className="flex justify-between items-center mb-4">
          <div className="w-full md:flex-row sx:flex-col flex items-center sx:items-start gap-[50px] sx:gap-[20px] justify-between">
            <div className="flex md:flex-row sx:flex-col items-center sx:items-start gap-[50px] sx:gap-[20px]">
              <h1 className="font-semibold sx:text-sm">
                Bekor qilingan shartnomalar
              </h1>
              <div className="flex w-[350px] sx:w-[250px] h-[40px] items-center gap-3 border pl-3 bg-white border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue">
                <input
                  value={searchTerm}
                  type="text"
                  className="w-full h-full focus:ring-0 focus:outline-none rounded-md bg-transparent delay-100"
                  required
                  placeholder={`Shartnomalarni izlash`}
                  onChange={handleSearchChange}
                />
                <button className="border rounded-md bg-[#1E90FF] text-white p-2 h-full">
                  <BsSearch className="text-lg" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {selectedRows?.length > 0 && (
                <button
                  className={`bg-red-500 px-2 py-1.5 text-white rounded text-sm flex items-center gap-1 active:bg-red-600`}
                >
                  <p className="text-md">O'chirish</p>
                </button>
              )}
              <button
                disabled={!data?.length}
                onClick={handleExportToExcel}
                className="bg-blue-500 px-6 py-1.5 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"
              >
                Excel
              </button>
              <CancelOrderPost data={data} />
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-md relative sx:w-full overflow-x-auto">
        <div className="absolute bottom-0 left-0 bg-gray-300 z-10 p-2 flex items-center justify-end gap-4 w-full sx:w-[1400px]">
          <button className="disabled:text-gray-200 text-primary">
            <BsArrowLeftSquare className="text-xl" />
          </button>
          <button
            className="disabled:text-gray-200 text-primary"
            disabled={filteredData?.length < 20 ? true : false}
          >
            <BsArrowRightSquare className="text-xl" />
          </button>
        </div>
        <div className="h-[73vh] overflow-y-auto sx:w-[1400px]">
          <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center">
            <OrdersTable
              selectAll={selectAll}
              handleSelectAll={handleSelectAll}
            />
            <div className="divide-y py-14 divide-gray-400 sx:text-sm">
              {filteredData ? (
                filteredData?.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow
                      key={item.id}
                      index={index}
                      item={item}
                      isSelected={selectedRows.includes(item.id)}
                      handleRowSelection={handleRowSelection}
                    />
                  ))
                ) : (
                  <div className="flex justify-center items-center">
                    <div className="py-4">
                      <h1 className="text-xl font-semibold">Malumotlar Yo'q</h1>
                    </div>
                  </div>
                )
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetCancelOrders;
