/* eslint-disable react/no-unescaped-entities */
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useState } from "react";
import { getReports } from "../functions/ReportMethod";
import Loading from "../examples/loading/Loading";
import DatePickers from "../components/datePicker/DatePickers";
import ExportToExcel from "../components/ExcelDownload/ExcelDownload";

function TableHeader() {
  return (
    <div className="bg-gray-300 flex items-center divide-x-2 divide-black px-3 justify-between gap-2 text-center text-sx font-bold absolute top-0 left-0 w-full sx:w-[1400px]">
      <div className="py-3">№</div>
      <div className="text-sm  grid grid-cols-10 w-full divide-x-2 divide-black">
        <div className="col-span-1 py-3">Sana</div>
        <div className="col-span-1 py-3">Filial</div>
        <div className="col-span-1 py-3">Kassa</div>
        <div className="col-span-1 py-3">To'lov turi</div>
        <div className="col-span-2 py-3">Kirim</div>
        <div className="col-span-2 py-3">Chiqim</div>
        <div className="col-span-2 py-3">Jami</div>
      </div>
    </div>
  );
}

function TableRow({ index, item }) {
  const paymentMethods = {
    cash: "Naqd",
    card: "Plastik karta",
    bank: "Bank",
  };
  const paymentMethod =
    paymentMethods[item.payments_paymentmethods] || "Hech qanday";
  return (
    <div className="bg-white flex items-center hover:bg-white/10 justify-between text-center text-sx border-b-2 px-3">
      <div className="py-3 w-8">{index + 1}</div>
      <div className="grid grid-cols-10 w-full justify-center items-center">
        <div className="col-span-1 py-3">{item.payment_date}</div>
        <div className="col-span-1 py-3">{item.towns_name}</div>
        <div className="col-span-1 py-3">{item.caishers_caisher_name}</div>
        <div className="col-span-1 py-3">{paymentMethod}</div>
        <div className="text-green col-span-1 py-3">
          {Number(item.total_sum)?.brm()}
        </div>
        <div className="text-green col-span-1 py-3">
          {Number(item.total_usd)?.brm()} $
        </div>
        <div className="text-red-500 col-span-1 py-3">
          {Number(item.total_sum_out)?.brm()}
        </div>
        <div className="text-red-500 col-span-1 py-3">
          {Number(item.total_sum_out_usd)?.brm()} $
        </div>
        <div
          className={
            item.grand_total_sum < 0
              ? "text-red-500"
              : "text-green col-span-1 py-3"
          }
        >
          {Number(item.grand_total_sum)?.brm()}
        </div>
        <div
          className={
            item.grand_total_usd < 0
              ? "text-red-500"
              : "text-green col-span-1 py-3"
          }
        >
          {Number(item.grand_total_usd)?.brm()} $
        </div>
      </div>
    </div>
  );
}

const Reports = () => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // JavaScript months are 0-based
  const year = currentDate.getFullYear();
  const date = `${year}-${month}-${day}`;
  const [selectedDate, setSelectedDate] = useState(`${date}/${date}`);
  const { data, isLoadig, refetch } = useQuery(["Reports", selectedDate], () =>
    getReports(selectedDate)
  );
  if (isLoadig) {
    return <Loading />;
  }
  const sumByKey = (data, key) => {
    return data?.reduce((sum, item) => sum + Number(item[key] || 0), 0);
  };

  const totalSum = sumByKey(data, "total_sum");
  const totalUsd = sumByKey(data, "total_usd");
  const totalOutSum = sumByKey(data, "total_sum_out");
  const totalOutUsd = sumByKey(data, "total_sum_out_usd");
  const totalGrand = sumByKey(data, "grand_total_sum");
  const totalGrandUsd = sumByKey(data, "grand_total_usd");

  const paymentMethods = {
    cash: "Naqd",
    card: "Plastik karta",
    bank: "Bank",
  };
  const handleExportToExcel = () => {
    const exportData = data?.map((item) => ({
      Sana: item.payment_date,
      Filial: item.towns_name,
      Kassa: item.caishers_caisher_name,
      "To'lov turi":
        paymentMethods[item.payments_paymentmethods] || "Hech qanday",
      Kirim: Number(item.total_sum)?.brm(),
      "Kirim $": `${Number(item.total_usd)?.brm()} $`,
      Chiqim: Number(item.total_sum_out)?.brm(),
      "Chiqim $": `${Number(item.total_sum_out_usd)?.brm()} $`,
      Jami: Number(item.grand_total_sum)?.brm(),
      "Jami $": `${Number(item.grand_total_usd)?.brm()} $`,
    }));

    ExportToExcel(exportData, "Hisobotlar");
  };

  return (
    <div className="flex flex-col sx:items-start gap-2">
      <h1 className="text-xl font-semibold md:text-md sx:text-sm">
        Hisobotlar
      </h1>
      <div className="flex items-center justify-end gap-4">
        <button
          disabled={!data?.length}
          onClick={handleExportToExcel}
          className="bg-blue-500 px-6 py-1.5 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"
        >
          Excel
        </button>
        <DatePickers refetch={refetch} set={setSelectedDate} />
      </div>
      <div className="min-w-full dark:divide-gray-700 relative py-12 rounded-md overflow-hidden bg-white overflow-x-auto shadow-lg sx:w-full">
        <TableHeader />
        <div className=" h-[60vh] overflow-y-scroll sx:w-full">
          {data?.map((item, index) => (
            <TableRow item={item} key={index} index={index} />
          ))}
        </div>
        <div className="bg-gray-300 flex items-center text-center text-[14px] w-full sx:w-[1400px] text-sx font-bold absolute bottom-0 left-0">
          <div className="w-12"></div>
          <div className="grid grid-cols-9 w-full">
            <div className="col-span-3"></div>
            <div className="col-span-1 p-3 border-l-2 border-black">
              {Number(totalSum)?.brm()}
            </div>
            <div className="bg-gray-300 flex items-center text-center text-[14px] w-full text-sx font-bold absolute bottom-0 left-0">
              <div className="w-12"></div>
              <div className="grid grid-cols-10 w-full">
                <div className="col-span-4"></div>
                <div className="col-span-1 p-3 border-l-2 border-black">
                  {Number(totalSum)?.brm()}
                </div>
                <div className="col-span-1 p-3 border-l-2 border-black">
                  {Number(totalUsd)?.brm()} $
                </div>
                <div className="col-span-1 p-3 border-l-2 border-black">
                  {Number(totalOutSum)?.brm()}
                </div>
                <div className="col-span-1 p-3 border-l-2 border-black">
                  {Number(totalOutUsd)?.brm()} $
                </div>
                <div className="col-span-1 p-3 border-l-2 border-black">
                  {Number(totalGrand)?.brm()}
                </div>
                <div className="col-span-1 p-3 border-l-2 border-black">
                  {Number(totalGrandUsd)?.brm()} $
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
