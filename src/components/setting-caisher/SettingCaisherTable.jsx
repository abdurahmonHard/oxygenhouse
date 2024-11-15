/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";
import Loading from "../../examples/loading/Loading";
import { format } from "date-fns";
import { BsSearch } from "react-icons/bs";
import SettingCaisherUpdate from "./SettingCaisherUpdate";
import SettingCaisherPost from "./SettingCaisherPost";
import SettingCaisherDelete from './SettingCaisherDelete'

function SettingCaisherTableHead() {
  return (
    <thead className="bg-gray-300">
      <tr className="text-sm">
        <th scope="col" className="py-3 px-4 pr-0">№</th>
        <th>Filial</th>
        <th>Kassa nomi</th>
        <th>Statusi</th>
        <th>Yaratilgan</th>
        <th>Yangilangan</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
  );
}

function TableRow({ item, index }) {
  const formattedDate = useCallback((value) => {
    return format(new Date(value), "dd-MM-yyyy");
  }, []);

  // console.log(item);

  return (
    <>
      <tr key={item.id} className="hover:bg-white/10 bg-white text-sm">
        <td className="py-3 pl-4">{index + 1}</td>
        <td>{item?.towns?.name}</td>
        <td>{item?.caisher_name}</td>
        <td className={item?.is_active ? "text-green" : "text-red-500"}>{item?.is_active ? "Faol" : "Faol emas"}</td>
        <td>{formattedDate(item?.created_at)}</td>
        <td>{formattedDate(item?.updated_at)}</td>
        <td>
          <SettingCaisherUpdate object={item} />
        </td>
        <td>
          <SettingCaisherDelete data={item} />
        </td>
      </tr>
    </>
  );
}

export function SettingCaisherTable({ data, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return <Loading />;
  }

  const filteredData = searchTerm
    ? data?.filter((item) =>
      (item?.caisher_name.toLowerCase().includes(searchTerm.toLowerCase())))
    : data;

  return (
    <div className="flex flex-col">
      <div className="py-3 px-4 sx:px-1">
        <div className="flex justify-between items-center mb-4">
          <div className="w-full md:flex-row sx:flex-col flex items-center sx:items-start gap-[50px] sx:gap-[20px] justify-between">
            <div className="flex md:flex-row sx:flex-col items-center sx:items-start gap-[50px] sx:gap-[20px]">
              <h1 className="font-semibold sx:text-sm">Kassalar ro'yxati</h1>
              <div className="flex w-[350px] sx:w-[250px] h-[40px] items-center gap-3 border pl-3 bg-white border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue">
                <input
                  type="text"
                  className="w-full h-full focus:ring-0 focus:outline-none rounded-md bg-transparent delay-100"
                  required
                  placeholder={`Kassani izlash`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="border rounded-md bg-[#1E90FF] text-white p-2 h-full">
                  <BsSearch className="text-lg" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <SettingCaisherPost />
            </div>
          </div>

        </div>
      </div>
      <div className="overflow-hidden min-h-[73vh] rounded-md overflow-x-auto sx:w-full">
        <table className="min-w-full  divide-y divide-gray-200 dark:divide-gray-700 text-center sx:w-[1400px]">
          <SettingCaisherTableHead
          />
          <tbody className="divide-y divide-gray-400 ">
            {filteredData ? filteredData?.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow
                  key={item.id}
                  index={index}
                  item={item}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={12}
                  className="py-4"
                >
                  <h1 className="text-xl font-semibold">Malumotlar Yo'q</h1>
                </td>
              </tr>
            ) : <Loading />}
          </tbody>
        </table>
      </div>
    </div>
  );
}