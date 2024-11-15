/* eslint-disable react/no-unescaped-entities */
import { useQuery } from "@tanstack/react-query";
import React, {useState} from "react";
import { getCaisherReport } from "../functions/ReportMethod";
import Loading from "../examples/loading/Loading";
import DatePickers from "../components/datePicker/DatePickers.jsx";

function TableHeader() {
  return (
    <div className="bg-gray-300 flex items-center divide-x-2 divide-black px-3 justify-between gap-2 text-center text-sx font-bold absolute top-0 left-0 w-full sx:w-[1400px]">
      <div className="py-3">№</div>
      <div className="text-sm  grid grid-cols-10 w-full divide-x-2 divide-black items-center">
        <div className="col-span-2 py-3">Kassir</div>
        {/*<div className="col-span-1 py-3">To'lov turi</div>*/}
        <div className="col-span-1 py-3">Kassa nomi</div>
        <div className="col-span-2 py-3">Kirim</div>
        <div className="col-span-2 py-3">Chiqim</div>
        <div className="col-span-2">Jami</div>
      </div>
    </div>
  );
}

function TableRow({ index, item }) {
  const paymentMethods = {
    cash: "Naqd",
    card: "Plastik karta",
    bank: "Bank",
    usd: "Dollar",
  };
  const paymentMethod =
    paymentMethods[item.payments_paymentmethods] || "Hech qanday";
  return (
    <div className="bg-white flex items-center hover:bg-white/10 justify-between text-center text-sx border-b-2 px-3">
      <div className="py-3 w-8">{index + 1}</div>
      <div className="grid grid-cols-10 w-full justify-center items-center">
        <div className="col-span-2 py-3 flex gap-2 justify-center">
          <p>{item.first_name}</p>
          <p>{item.last_name}</p>
        </div>
        {/*<div className="col-span-1 py-3">{paymentMethod}</div>*/}
        <div className="col-span-1 py-3">{item.caishers_caisher_name}</div>
        <div className="col-span-1 py-3 text-green">
          {Number(item.total_sum)?.brm()}
        </div>
        <div className="col-span-1 py-3 text-green">
          {Number(item.total_usd)?.brm()}$
        </div>
        <div className="text-red-500 col-span-1 2y-3">
          {Number(item.total_sum_out)?.brm()}
        </div>
        <div className="text-red-500 col-span-1 2y-3">
          {Number(item.total_sum_out_usd)?.brm()}$
        </div>
        <div className="text-green col-span-1 2y-3">
          {Number(item.grand_total_sum)?.brm()}
        </div>
        <div className="text-green col-span-1 2y-3">
          {Number(item.grand_total_usd)?.brm()}$
        </div>
      </div>
    </div>
  );
}

const CaisherReport = () => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // JavaScript months are 0-based
  const year = currentDate.getFullYear();
  const date = `${year}-${month}-${day}`;
  const [selectedDate, setSelectedDate] = useState(`${date}/${date}`);
  const { data, isLoadig,refetch } = useQuery(["CaisherReport",selectedDate], () =>
    getCaisherReport(selectedDate)
  );
  // console.log(data);
  if (isLoadig) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold my-2 md:text-lg sx:text-sm">
        Kassa Hisoboti
      </h1>
      <div className="flex items-center justify-end gap-4">
        {/*<button*/}
        {/*    disabled={!data?.length}*/}
        {/*    onClick={handleExportToExcel}*/}
        {/*    className="bg-blue-500 px-6 py-1.5 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"*/}
        {/*>*/}
        {/*  Excel*/}
        {/*</button>*/}
        <DatePickers refetch={refetch} set={setSelectedDate} />
      </div>
      <div className="min-w-full dark:divide-gray-700 relative py-12 rounded-md overflow-hidden overflow-x-auto bg-white shadow-lg sx:w-full">

        <TableHeader />
        <div className=" h-[65vh] overflow-y-scroll sx:w-[1400px] sx:text-sm">
          {data?.map((item, index) => (
            <TableRow item={item} key={index} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaisherReport;
