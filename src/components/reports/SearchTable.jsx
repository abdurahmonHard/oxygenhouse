import React, { useContext, useState } from "react";
import Loading from "../../examples/loading/Loading";
import { format } from "date-fns";
import { BsSearch } from "react-icons/bs";
import { BsArrowLeftSquare, BsArrowRightSquare } from "react-icons/bs";
import DeleteOrders from "./DeleteOrders";
import ExportToExcel from "../ExcelDownload/ExcelDownload";
import OrdersTable from "./OrdersTable";
import TableRow from "./TableRow";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCanceledOrders } from "../../functions/OrderMethods";

const SearchTable = ({ data, isLoading, pageParam, setPageParam }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const { profile } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const postCanceledOrders = useMutation({
    mutationFn: addCanceledOrders,
    onSuccess: () => {
      ["getAllOrders", "getCanceledOrders"].forEach((cache) => {
        queryClient.invalidateQueries(cache);
      });
    },
  });

  const canceledContract = async (id) => {
    await postCanceledOrders.mutate(id);
  };

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
    return format(new Date(value), "yyyy-MM-dd");
  };

  // jami summa
  const totalSumSom = filteredData?.reduce((a, b) => +a + +b.total_amount, 0);
  const totalSumUsd = Math.floor(
    filteredData?.reduce((a, b) => +a + +b.total_amount_usd, 0)
  );

  // jami boshlang'ich summa
  const totalInitialSom = filteredData?.reduce(
    (a, b) => +a + +b.initial_pay,
    0
  );
  const totalInitialUsd = Math.floor(
    filteredData?.reduce((a, b) => +a + +b.initial_pay / b.currency_value, 0)
  );

  // jami qarzdorlik
  const totalDebitSom = filteredData?.reduce(
    (a, b) => +a + +b.total_amount - +b.sumOfpayments,
    0
  );
  const totalDebitUsd = Math.floor(
    filteredData?.reduce(
      (a, b) => +a + (+b.total_amount - +b.sumOfpayments) / +b.currency_value,
      0
    )
  );

  // jami to'langan summa
  const totalSumOfPaymentsSom = filteredData?.reduce(
    (a, b) => +a + +b.sumOfpayments,
    0
  );
  const totalSumOfPaymentsUsd = Math.floor(
    filteredData?.reduce((a, b) => +a + +b.sumOfpayments / +b.currency_value, 0)
  );

  const handleExportToExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      "№": index + 1,
      Sotuvchi: `${item?.users?.first_name} ${item?.users?.last_name}`,
      Mijoz: `${item?.clients?.first_name} ${item?.clients?.last_name}`,
      "Sotuv turi": item?.paymentMethods?.name_alias,
      "Shartnoma sanasi": formattedDate(item?.order_date),
      "Umumiy summa so'm": `${Number(item?.total_amount)}`,
      "Umumiy summa $": `${Number(item?.total_amount_usd)}`,
      "Boshlang'ich tolov so'm": `${Number(item?.initial_pay)}`,
      "Boshlang'ich tolov $": `${Math.floor(
        item?.initial_pay / item?.currency_value
      )}`,
      "Qarzdorlik so'm": `${Number(item?.total_amount) - item?.sumOfpayments}`,
      "Qarzdorlik $": `${Math.floor(
        (Number(item?.total_amount) - item?.sumOfpayments) /
        item?.currency_value
      )}`,
      "To'langan summa so'm": `${item?.sumOfpayments}`,
      "To'langan summa $": `${Math.floor(
        Number(item?.sumOfpayments / item?.currency_value)
      )}`,
      Yaratilgan: `${formattedDate(item?.created_at)}`,
    }));

    // Jami summa ob'ektini exportData massiviga qo'shish
    exportData.push({
      "№": "Jami:",
      "Umumiy summa so'm": `${totalSumSom}`,
      "Umumiy summa $": `${totalSumUsd}`,
      "Boshlang'ich tolov so'm": `${totalInitialSom}`,
      "Boshlang'ich tolov $": `${totalInitialUsd}`,
      "Qarzdorlik so'm": `${totalDebitSom}`,
      "Qarzdorlik $": `${totalDebitUsd}`,
      "To'langan summa so'm": `${totalSumOfPaymentsSom}`,
      "To'langan summa $": `${totalSumOfPaymentsUsd}`,
    });

    ExportToExcel(exportData, "Shartnomalar");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col">
      <div className="py-3 px-4 flex flex-col gap-3 lg:flex-row  lg:justify-between lg:items-center">
        <div className="flex flex-wrap items-center gap-[50px] sx:gap-[20px] justify-between mb-4">
          <h1 className="font-semibold sx:text-sm">Shartnomalar</h1>
          <div className="flex w-full sm:w-[400px]  lg:w-[350px]h-[40px] items-center gap-3 border pl-3 bg-white border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue">
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
        <div className="flex flex-wrap justify-end sx:justify-start items-center gap-3">
          {selectedRows?.length > 0 && (
            <button
              onClick={() => canceledContract(selectedRows)}
              className="bg-orange px-2 py-1.5 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"
            >
              Bekor qilish
            </button>
          )}
          {/* {selectedRows?.length > 0 && (
                        <DeleteOrders id={selectedRows} set={setSelectedRows} />
                     )} */}
          {profile?.roles?.role_name === "Seller" ? (
            <></>
          ) : (
            <button
              disabled={!data?.length}
              onClick={() => handleExportToExcel()}
              className="bg-blue-500 px-6 py-1.5 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"
            >
              Excel
            </button>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded shadow-md overflow-x-scroll">
        <div className="relative  w-[1300px] xl:w-[1380px] 2xl:w-full">
          <div className="absolute bottom-0 left-0 z-[5] bg-gray-300 p-2 flex items-center justify-end w-full">
            <div className="grid grid-cols-12 items-center w-full ml-16">
              <div className="col-span-3">
                <p className="font-bold">Jami:</p>
              </div>
              <div className="col-span-2 flex justify-between border-black gap-4">
                <p className="text-sm font-semibold">
                  {Math.floor(totalSumSom)?.brm()}
                </p>
                <p className="text-sm font-semibold mr-6">{totalSumUsd?.brm()} $</p>
              </div>
              <div className="col-span-2 flex justify-between border-black gap-4">
                <p className="text-sm font-semibold">
                  {totalInitialSom?.brm()}
                </p>
                <p className="text-sm font-semibold mr-8">
                  {totalInitialUsd?.brm()} $
                </p>
              </div>
              <div className="col-span-2 flex justify-between border-black gap-4">
                <p className="text-sm font-semibold">
                  {Math.floor(totalDebitSom)?.brm()}
                </p>
                <p className="text-sm font-semibold mr-12">
                  {totalDebitUsd?.brm()} $
                </p>
              </div>
              <div className="col-span-2 flex justify-between border-black gap-4">
                <p className="text-sm font-semibold">
                  {totalSumOfPaymentsSom?.brm()}
                </p>
                <p className="text-sm font-semibold mr-10">
                  {totalSumOfPaymentsUsd?.brm()} $
                </p>
              </div>
              <div className="flex gap-2 items-center justify-end col-span-1 pr-4">
                <button
                  className="disabled:text-gray-200 text-primary"
                  disabled={pageParam === 1 ? true : false}
                  onClick={() => setPageParam((prev) => prev - 1)}
                >
                  <BsArrowLeftSquare className="text-xl" />
                </button>
                <button
                  className="disabled:text-gray-200 text-primary"
                  disabled={filteredData?.length < 20 ? true : false}
                  onClick={() => setPageParam((prev) => prev + 1)}
                >
                  <BsArrowRightSquare className="text-xl" />
                </button>
              </div>
            </div>
          </div>
          <div className="h-[73vh] pb-10 overflow-y-auto">
            <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center">
              <OrdersTable
                selectAll={selectAll}
                handleSelectAll={handleSelectAll}
              />
              <div className="divide-y divide-gray-400 ">
                {filteredData ? (
                  filteredData?.length > 0 ? (
                    filteredData.map((item, index) => (
                      <TableRow
                        key={item.id}
                        index={index}
                        item={item}
                        isSelected={selectedRows.includes(item.id)}
                        handleRowSelection={handleRowSelection}
                        pageParam={pageParam}
                      />
                    ))
                  ) : (
                    <div className="flex justify-center items-center">
                      <div className="py-4">
                        <h1 className="text-xl font-semibold">
                          Malumotlar Yo'q
                        </h1>
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
    </div>
  );
};

export default SearchTable;
