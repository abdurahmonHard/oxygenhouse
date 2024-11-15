import React, { useCallback, useContext, useState } from "react";
import Loading from "../../examples/loading/Loading";
import { format } from "date-fns";
import {
  BsArrowLeftSquare,
  BsArrowRightSquare,
  BsSearch,
} from "react-icons/bs";
import CassierPost from "./CassierPost";
// import CassierDelete from "./CassierDelete";
import ExportToExcel from "../ExcelDownload/ExcelDownload";
import { HiEye } from "react-icons/hi";
import { FiX } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext.jsx";
import CassierRestore from "./CassierRestore";
import { styles } from "../../assets/styles/styles.js";
// import CassierOutPost from "./CassierOutPost";

function CassierTable({ selectAll, handleSelectAll }) {
  const { profile } = useContext(AuthContext);

  return (
    <div className="bg-gray-300 absolute w-full top-0 left-0 sx:w-[1400px]">
      <div className="text-sm grid grid-cols-12 items-center font-semibold">
        {/* <div className="py-2 px-4 pr-0 flex items-center gap-3 col-span-1">
               {profile?.roles?.role_name === "Seller" ? (
                  <></>
               ) : (
                  <>
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
                  </>
               )}
               <span>№</span>
            </div> */}
        <div className="grid grid-cols-9 col-span-12 py-2">
          <div className="col-span-1">№</div>
          <div className="col-span-1">Mijoz nomi</div>
          <div className="col-span-1">Kassa nomi</div>
          {/* <div className="col-span-1">Umumiy summa</div>
                    <div className="col-span-1">Boshlang'ich tolov</div> */}
          <div className="col-span-1">To'langan so'm</div>
          <div className="col-span-1">To'langan $</div>
          <div className="col-span-1">To'lov turi</div>
          <div className="col-span-1">To'lov sanasi</div>
          <div className="col-span-1">To'lov tipi</div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ item, index, isSelected, handleRowSelection, pageParam }) {
  const formattedDate = useCallback((value) => {
    return format(new Date(value), "yyyy-MM-dd");
  }, []);

  const [viewData, setViewData] = useState(null);
  const [isModal, setIsModal] = useState(false);

  return (
    <div className="w-full">
      <div
        key={item.id}
        className={`hover:bg-white/10 ${item.is_deleted
          ? "bg-gray-100 opacity-30 select-none"
          : "bg-white hover:bg-white/10"
          } bg-white text-sm grid grid-cols-12 items-center w-full`}
      >
        {/* <div className="py-3 pl-4 col-span-1 flex items-center gap-3">
               <input
                  id={`hs-table-pagination-checkbox-${item.id}`}
                  type="checkbox"
                  className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={isSelected}
                  onChange={(e) => handleRowSelection(item.id, e.target.checked)}
               />
               <label
                  htmlFor={`hs-table-pagination-checkbox-${item.id}`}
                  className="sr-only"
               >
                  Checkbox
               </label>
               <div className="col-span-1">{(pageParam - 1) * 20 + index + 1}</div>
            </div> */}
        <div className="col-span-12 grid grid-cols-9 items-center py-2">
          <div className="col-span-1">{(pageParam - 1) * 20 + index + 1}</div>
          <div className="col-span-1 flex gap-1 justify-center">
            <p>{item?.orders?.clients?.first_name}</p>
            <p> {item?.orders?.clients?.last_name}</p>
          </div>
          <div className="col-span-1">{item?.caishers?.caisher_name}</div>
          <div className="col-span-1  py-2 flex flex-col justify-between">
            <p>{Number(item?.amount)?.brm()}</p>
          </div>
          <div className="col-span-1  py-2 flex flex-col justify-between">
            <p className="text-[#85bb65] font-bold text-[15px]">
              {Math.floor(Number(item?.amount_usd))?.brm()} $
            </p>
          </div>
          <div className="col-span-1">
            {item?.paymentmethods === "cash"
              ? "Naqd"
              : item?.paymentmethods === "card"
                ? "Plastik karta" :
                item?.paymentmethods === "usd" ? "Dollar"
                  : "Bank"}
          </div>
          <div className="col-span-1">{formattedDate(item?.payment_date)}</div>
          <div
            className={`col-span-1 ${item?.caisher_type === "in" ? "text-green" : "text-red-500"
              }`}
          >
            {item?.caisher_type === "in" ? "Kirim" : "Chiqim"}
          </div>
          <div>
            <button
              disabled={item.is_deleted}
              onClick={() => {
                setViewData(item);
                setIsModal(true);
              }}
              className="text-sm bg-green text-white py-1 px-3 rounded-xl"
            >
              <HiEye className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {isModal && (
        <div>
          <div
            className={`fixed rounded-md p-10 sx:p-7 sx:text-sm top-1/2 left-1/2 transform md:w-1/2 sx:w-[90%] -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg z-50 origin-center ${isModal
              ? "transition-transform scale-100 opacity-100 duration-300 ease-in-out"
              : "transition-transform scale-0 opacity-0 duration-300 ease-in-out"
              }`}
          >
            <FiX
              onClick={() => setIsModal(false)}
              className="absolute right-2 cursor-pointer top-2 text-lg"
            />
            <div className="flex items-center justify-between bg-gray-200 p-3">
              <p className="font-semibold mr-2">Mijoz:</p>
              <div className="flex gap-1 text-gray-600">
                <p>{viewData?.orders?.clients?.first_name}</p>
                <p>{viewData?.orders?.clients?.last_name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3">
              <p className="font-semibold mr-2">Kassa:</p>
              <p className=" text-gray-600">
                {viewData?.caishers?.caisher_name}
              </p>
            </div>
            <div className="flex items-center justify-between bg-gray-200 p-3">
              <p className="font-semibold mr-2">To'lov - so'm:</p>
              <p className=" text-gray-600">
                {Number(Number(viewData?.amount))?.brm()}
              </p>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3">
              <p className="font-semibold mr-2">To'lov - $:</p>
              <p className=" text-[#85bb65]">
                {Math.floor(Number(viewData?.amount / item?.currency_value))?.brm()} $
              </p>
            </div>
            <div className="flex items-center justify-between bg-gray-200 p-3">
              <p className="font-semibold mr-2">To'lov turi:</p>
              <p className=" text-gray-600">
                {item?.paymentmethods === "cash"
                  ? "Naqd pul orqali"
                  : item?.paymentmethods === "card"
                    ? "Plastik karta orqali"
                    : item?.paymentmethods === "usd"
                      ? "Dollar orqali"
                      : "Bank orqali"}
              </p>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3">
              <p className="font-semibold mr-2">Sana:</p>
              <p className=" text-gray-600">
                {formattedDate(viewData?.payment_date)} da
              </p>
            </div>
            <div className="flex items-center justify-between bg-gray-200 p-3">
              <p className="font-semibold mr-2">To'lov tipi:</p>
              <p className=" text-green">
                {viewData?.caisher_type === "in" ? "Kirim" : "Chiqim"}
              </p>
            </div>
            {/* <div className="flex items-center justify-between bg-gray-50 p-3">
                     <p className="font-semibold mr-2">Izoh:</p>
                     <p className=" text-gray-600">{viewData?.pay_note}</p>
                  </div> */}
          </div>
          <div
            onClick={() => setIsModal(false)}
            className={`fixed right-0 top-0 w-full h-full bg-black bg-opacity-50 z-30 ${isModal
              ? "transition-opacity opacity-100 duration-300 ease-in-out"
              : "transition-opacity opacity-0 pointer-events-none duration-300 ease-in-out"
              }`}
          ></div>
        </div>
      )}
    </div>
  );
}

export function SearchTable({ data, isLoading, setPageParam, pageParam }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const [tableSort, setTableSort] = useState("all")
  console.log(tableSort);

  const [selectedRows, setSelectedRows] = useState([]);
  const formattedDate = useCallback((value) => {
    return format(new Date(value), "yyyy-MM-dd");
  }, []);
  const { profile } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  }

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
      // Avvaliga faqat user_is_deleted xususiyati false bo'lgan objectlarni tanlaymiz
      let selectedRows = data
        .filter((item) => !item.is_deleted)
        .map((item) => item.id);

      // Agar barcha objectlarning user_is_deleted xususiyatlari true bo'lsa,
      // barcha qatorlarni tanlaymiz
      if (data.length > 0 && selectedRows.length === 0) {
        selectedRows = data.map((item) => item.id);
      }

      setSelectedRows(selectedRows);
    }
    setSelectAll(!selectAll);
  };

  const filteredData = searchTerm
    ? data?.filter(
      (item) =>
        item?.orders?.clients?.first_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item?.orders?.clients?.last_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    : tableSort !== "all" ? data?.filter((item) => item.caisher_type === tableSort) : data

  // console.log(filteredData);; caisher_type

  const totalIn = filteredData?.filter(a => a.caisher_type === "in")?.reduce((a, b) => +a + +b?.amount, 0);
  const totalOut = filteredData?.filter(a => a.caisher_type === "out")?.reduce((a, b) => +a + +b?.amount, 0);

  const totalSumSom = totalIn - totalOut
  const totalSumUsd = Math.floor(filteredData?.reduce((a, b) => +a + +b?.amount_usd, 0));

  const handleExportToExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      "№": index + 1,
      Mijoz: `${item?.orders?.clients?.first_name} ${item?.orders?.clients?.last_name}`,
      "Kassa nomi": item?.caishers?.caisher_name,
      "To'lov sanasi": formattedDate(item?.payment_date),
      "To'lov summasi so'm": `${+item?.amount} so'm`,
      "To'lov summasi $": `${Math.floor(
        Number(item?.amount_usd)
      )} $`,
      "To'lov turi":
        item?.paymentmethods === "cash"
          ? "Naqd"
          : item?.paymentmethods === "card"
            ? "Plastik karta"
            : "Bank",
      "To'lov tipi": item?.caisher_type === "in" ? "Kirim" : "Chiqim",
    }));

    // Jami summa ob'ektini exportData massiviga qo'shish
    exportData.push({
      "№": `Jami summa: ${totalSumSom} so'm ${totalSumUsd} $`,
      "To'lov summasi so'm": `${tableSort === "all" ? totalSumSom?.brm() : tableSort === "in" ? totalIn?.brm() : tableSort === "out" ? totalOut?.brm() : ""}`,
      "To'lov summasi $": `${totalSumUsd}`,
    });

    ExportToExcel(exportData, "To'lovlar");
  };

  return (
    <div className="flex flex-col ">
      <div className="py-3 md:px-4 sx:px-0 mb-4">
        <div className="w-full flex md:flex-row sx:flex-col items-center md:items-center sx:items-start md:gap-[50px] sx:gap-[20px] justify-between">
          <div className="flex md:flex-row sx:w-full sx:flex-col items-center md:items-center sx:items-start md:gap-[50px] sx:gap-[20px]">
            <h1 className="font-semibold">To'lovlar ro'yxati</h1>
            <div className="flex md:w-[330px] sx:w-full w-[350px] h-[40px] items-center gap-3 border pl-3 bg-white border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue">
              <input
                value={searchTerm}
                type="text"
                className="w-full h-full focus:ring-0 focus:outline-none rounded-md bg-transparent delay-100"
                required
                placeholder={`To'lovlarni izlash`}
                onChange={handleSearchChange}
              />
              <button className="border rounded-md bg-[#1E90FF] text-white p-2 h-full">
                <BsSearch className="text-lg" />
              </button>
            </div>
            <select value={tableSort} onChange={(e) => setTableSort(e.target.value)} className={`cursor-pointer h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100 w-[150px]`}>
              <option value="all">Barchasi</option>
              <option value="in">Kirim</option>
              <option value="out">Chiqim</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {profile?.roles?.role_name === "Seller" ? (
              <></>
            ) : (
              <button
                disabled={!data?.length > 0}
                onClick={() => handleExportToExcel()}
                className="bg-blue-500 px-6 py-1.5 text-white rounded text-sm flex items-center disabled:cursor-default disabled:opacity-70"
              >
                Excel
              </button>
            )}

            <div className="flex justify-between items-center gap-3">
              {selectedRows.length > 0 && (
                <div>
                  {filteredData.some(
                    (item) =>
                      selectedRows.includes(item.id) && item.is_deleted
                  ) && (
                      <CassierRestore id={selectedRows} set={setSelectedRows} />
                    )}
                  {/* <CassierDelete id={selectedRows} set={setSelectedRows} /> */}
                </div>
              )}
            </div>
            <CassierPost />
          </div>
        </div>
      </div>
      <div className="overflow-auto md:w-full sx:w-full rounded-md relative">
        {data && (
          <div className="absolute bottom-0 left-0 bg-gray-300 p-2 flex items-center justify-end gap-4 w-full md:w-full sx:w-[1400px]">
            <div className="grid grid-cols-12 items-center w-full ml-16">
              <div className="col-span-4">
                <p className="font-bold md:text-md sx:text-sm" >Jami:</p>
              </div>
              <div className="col-span-2 flex justify-between border-black gap-4">
                <p className="text-sm font-semibold">
                  {tableSort === "all" ? totalSumSom?.brm() : tableSort === "in" ? totalIn?.brm() : tableSort === "out" ? totalOut?.brm() : ""}
                </p>
                <p className="text-sm font-semibold">{totalSumUsd?.brm()} $</p>
              </div>
              {/* <div className="col-span-2 flex justify-evenly border-l-2 border-black gap-4">
                        <p className="text-sm font-semibold">{totalInitialSom?.brm()}</p>
                        <p className="text-sm font-semibold">{totalInitialUsd?.brm()}</p>
                     </div>
                     <div className="col-span-2 flex justify-evenly border-l-2 border-black gap-4">
                        <p className="text-sm font-semibold">{totalDebitSom?.brm()}</p>
                        <p className="text-sm font-semibold">{totalDebitUsd?.brm()}</p>
                     </div>
                     <div className="col-span-2 flex justify-evenly border-l-2 border-black gap-4">
                        <p className="text-sm font-semibold">{totalSumOfPaymentsSom?.brm()}</p>
                        <p className="text-sm font-semibold">{totalSumOfPaymentsUsd?.brm()}</p>
                     </div> */}
              <div className="flex gap-2 items-center justify-end col-span-6 pr-6">
                <button
                  className="disabled:text-gray-200 text-primary"
                  disabled={pageParam === 1 ? true : false}
                  onClick={() => setPageParam((prev) => prev - 1)}
                >
                  <BsArrowLeftSquare className="text-xl" />
                </button>
                <button
                  className="disabled:text-gray-200 text-primary"
                  disabled={filteredData.length < 20 ? true : false}
                  onClick={() => setPageParam((prev) => prev + 1)}
                >
                  <BsArrowRightSquare className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="h-[73vh] overflow-auto py-9 w-full sx:w-[1400px]">
          <div className="divide-y divide-gray-200 dark:divide-gray-700 text-center sx:w-[1400px]">
            <CassierTable
              selectAll={selectAll}
              handleSelectAll={handleSelectAll}
            />
            <div className="divide-y divide-gray-400">
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
}
