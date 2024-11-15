/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getAllUsers } from "../../functions/UserMethodes";
import Loading from "../../examples/loading/Loading";
import { format } from "date-fns";
import UpdateUser from "../users/UpdateUser";
import DeleteUser from "../users/DeleteUser";
import { BsSearch } from "react-icons/bs";
import MemoizeAddUser from "../users/AddUser";
import ExportToExcel from "../ExcelDownload/ExcelDownload";
import RecoverUser from "../users/RecoverUser";
import DownloadFile from "../Download/DownloadFile";

function TableHeader({ selectAll, handleSelectAll }) {
  return (
    <thead className="bg-gray-300">
      <tr className="text-sm">
        <th scope="col" className="py-3 px-4 pr-0">
          <input
            id="hs-table-pagination-checkbox-all"
            type="checkbox"
            className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <label htmlFor="hs-table-pagination-checkbox-all" className="sr-only">
            Checkbox
          </label>
        </th>
        <th>№</th>
        <th>Ismi</th>
        <th>Familiyasi</th>
        <th>Nomi</th>
        <th>Tel raqami</th>
        <th>Holati</th>
        <th>Kiritilgan sana</th>
        <th>Yangilangan sana</th>
        <th>Lavozimi</th>
        <th></th>
      </tr>
    </thead>
  );
}

function TableRow({ index, item, isSelected, handleRowSelection }) {
  const formattedDate = (value) => {
    return format(new Date(value), "yyyy-MM-dd");
  };

  return (
    <tr
      key={item.id}
      className={` text-sm ${item.user_is_deleted
        ? "bg-gray-100 opacity-30 select-none"
        : "bg-white hover:bg-white/10"
        }`}
    >
      <td className={`py-3 pl-4`}>
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
      </td>
      <td>{index + 1}</td>
      <td>{item.first_name}</td>
      <td>{item.last_name}</td>
      <td>{item.username}</td>
      <td>{item.phone_number}</td>
      <td className={item.is_active ? "text-green" : "text-red-500"}>
        {item.is_active ? "Faol" : "Faol Emas"}
      </td>
      <td>{formattedDate(item.created_at)}</td>
      <td>{formattedDate(item.updated_at)}</td>
      <td>
        {item.roles.role_name === "SuperAdmin"
          ? "Administrator"
          : item.roles.role_name === "Seller"
            ? "Sotuvchi"
            : item.roles.role_name === "manager"
              ? "Menejer"
              : "Operator"}
      </td>
      <td>{item.user_is_deleted ? <></> : <UpdateUser object={item} />}</td>
    </tr>
  );
}

function SearchTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const id = 0;
  const { data, isLoading } = useQuery(["Users", id], () => getAllUsers(id));
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
      // Avvaliga faqat user_is_deleted xususiyati false bo'lgan objectlarni tanlaymiz
      let selectedRows = data
        .filter((item) => !item.user_is_deleted)
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
    ? data?.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : data;

  // const handleExportToExcel = () => {
  //   const exportData = filteredData.map((item) => ({
  //     Ismi: item.first_name,
  //     Familiyasi: item.last_name,
  //     Nomi: item.username,
  //     "Tel raqami": item.phone_number,
  //     Holati: item.is_active ? "Faol" : "Faol Emas",
  //     "Kiritilgan sana": format(new Date(item.created_at), "yyyy-MM-dd"),
  //     "Yangilangan sana": format(new Date(item.updated_at), "yyyy-MM-dd"),
  //     Lavozimi: item.roles?.role_name,
  //   }));

  //   ExportToExcel(exportData, "Foydalanuvchilar");
  // };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col sx:w-full overflow-x-auto">
      <div className="py-3">
        <div className="flex md:flex-row sx:flex-col md:gap-[50px] sx:gap-[20px] justify-between items-center md:items-center sx:items-start">
          <div className="flex md:flex-row sx:flex-col md:items-center sx:items-start md:gap-[50px] sx:gap-[20px] justify-between">
            <h1 className="font-semibold md:text-md sx:text-sm">Foydalanuvchilar</h1>
            <div className="flex w-[350px] h-[40px] items-center gap-3 border pl-3 bg-white border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue">
              <input
                value={searchTerm}
                type="text"
                className="w-full h-full focus:ring-0 focus:outline-none rounded-md bg-transparent delay-100"
                required
                placeholder="Mijozlarni izlash"
                onChange={handleSearchChange}
              />
              <button className="border rounded-md bg-[#1E90FF] text-white p-2 h-full">
                <BsSearch className="text-lg" />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center gap-3">
            <div>
              {selectedRows.length > 0 && (
                <div>
                  {filteredData.some(
                    (item) =>
                      selectedRows.includes(item.id) && item.user_is_deleted
                  ) ? (
                    <RecoverUser id={selectedRows} set={setSelectedRows} />
                  ) : (
                    <DeleteUser id={selectedRows} set={setSelectedRows} />
                  )}
                </div>
              )}
            </div>
            {/* <button
              disabled={!data?.length}
              onClick={handleExportToExcel}
              className="bg-blue-500 px-2 py-1.5 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"
            >
              Excelga eksport qilish
            </button> */}
            <MemoizeAddUser />
          </div>
        </div>
      </div>
      <div className="overflow-y-auto  rounded-md h-[73vh] shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center sx:w-[1400px]">
          <TableHeader
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
          />
          <tbody className="divide-y divide-gray-400 ">
            {filteredData.length > 0 ? (
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
              <tr>
                <td colSpan={12} className="py-4">
                  <h1 className="text-xl font-semibold">Malumotlar Yo'q</h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SearchTable;
