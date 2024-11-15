/* eslint-disable react/no-unescaped-entities */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getClientsReport } from "../functions/ReportMethod";
import Loading from "../examples/loading/Loading";

import ExportToExcel from "../components/ExcelDownload/ExcelDownload";

function TableHeader() {
  return (
    <div className="bg-gray-300 w-full sticky top-0 left-0 z-[5]">
      <div className="bg-gray-300 flex items-center divide-x-2 divide-black px-3 justify-between gap-2 text-center text-sx font-bold absolute top-0 left-0 w-full sx:w-[1400px]">
        <div className="py-3 px-1">№</div>
        <div className="text-[13px]  grid grid-cols-12 w-full divide-x-2 divide-black items-center">
          <div className="col-span-1 py-3">Mijoz</div>
          <div className="col-span-1 py-3">Bino</div>
          <div className="col-span-1 py-3">Podyezd</div>
          <div className="col-span-1 py-3">Qavat</div>
          <div className="col-span-1 py-3">Xonadon</div>
          <div className="col-span-1 py-3">Uy hajmi (kv)</div>
          <div className="col-span-2 py-3">Umumiy summa</div>
          <div className="col-span-2 py-3">To'langan pul</div>
          <div className="col-span-2 py-3">Qarzdorlik</div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ index, item }) {
  return (
    <div className="bg-white flex items-center gap-2 hover:bg-white/10 justify-between text-center text-sx border-b-2 px-3">
      <div className="py-3 px-1 text-center">{index + 1}</div>
      <div className="grid grid-cols-12 w-full justify-center items-center text-center text-[14px]">
        <div
          className="col-span-1 flex flex-col items-center justify-center select-none cursor-pointer relative text-primary font-medium text-[13px]"
        >
          <p>{item?.clients_first_name}</p>
          <p>{item?.clients_last_name}</p>

          {/* tooltip
          {tooltip && tooltipData && (
            <div className="bg-white shadow-best rounded absolute left-[190px] w-[450px] min-h-[110px] tooltip z-50">
              <div className="flex justify-between">
                <p>Qavat</p>
                <p>{tooltipData?.floor_floor_number}</p>
              </div>
              <div className="flex justify-between">
                <p>Podyezd</p>
                <p>{tooltipData?.entrance_entrance_number}</p>
              </div>
              <div className="flex justify-between border-b">
                <p>Bino</p>
                <p>{tooltipData?.buildingname}</p>
              </div>
              <div className="flex justify-between">
                <p>Majmua</p>
                <p>{tooltipData?.townname}</p>
              </div>
            </div>
          )} */}
        </div>

        <div className="col-span-1 py-3">{item.townname}<br />{item.buildingname}</div>
        <div className="col-span-1 py-3">{item.entrance_entrance_number}</div>
        <div className="col-span-1 py-3">{item.floor_floor_number}</div>
        <div className="col-span-1 py-3">{item.apartments_room_number}</div>
        <div className="col-span-1 py-3">{item.apartments_room_space}</div>
        <div className="col-span-1 py-3">
          {Math.floor(Number(item.total_amount))?.brm()}
        </div>
        <div className="col-span-1 py-3">
          {Number(item.total_amount_usd)?.brm()} $
        </div>
        <div className="text-green col-span-1 2y-3">
          {Number(item.total_sum_out)?.brm()}
        </div>
        <div className="text-green col-span-1 2y-3">
          {Number(item.total_sum_out_usd)?.brm()} $
        </div>
        <div className="text-red-500 col-span-1 2y-3">
          {Math.floor(Number(item.due_total_sum))?.brm()}
        </div>
        <div className="text-red-500 col-span-1 2y-3">
          {Number(item.due_total_usd)?.brm()}$
        </div>
      </div>
    </div>
  );
}

const SoldOutClientsReports = () => {
  const { data, isLoadig } = useQuery(["ClintesReports"], () =>
    getClientsReport()
  );
  console.log(data);
  const totalRoomSpace = data?.reduce((a, b) => a + b.apartments_room_space, 0);

  if (isLoadig) {
    return <Loading />;
  }

  const handleExportToExcel = () => {
    const exportData = data?.map((item) => ({
      Mijoz: `${item.clients_first_name} ${item.clients_last_name}`,
      Majmua: `${item?.townname}`,
      Bino: `${item?.buildingname}`,
      Podyezd: `${item?.entrance_entrance_number}`,
      Qavat: `${item?.floor_floor_number}`,
      Xonadon: item.apartments_room_number,
      "Xona soni": item.apartments_cells,
      "Uy hajmi": item.apartments_room_space,
      "Umimiy summa": Math.floor(Number(item.total_amount))?.brm(),
      "Umimiy summa $": Number(item.total_amount_usd)?.brm(),
      "To'langan pul": Number(item.total_sum_out)?.brm(),
      "To'langan pul $": Number(item.total_sum_out_usd)?.brm(),
      Qarzdorlik: Math.floor(Number(item.due_total_sum))?.brm(),
      "Qarzdorlik $": Number(item.due_total_usd)?.brm(),
    }));

    ExportToExcel(exportData, "Sotib olgan mijozlar");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold my-2 sx:text-xs">
          Sotib olgan mijozlar haqida hisobot
        </h1>
        <button
          disabled={!data?.length}
          onClick={handleExportToExcel}
          className="bg-blue-500 px-6 py-1.5 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"
        >
          Excel
        </button>
      </div>
      <div className="min-w-full dark:divide-gray-700 relative rounded-md overflow-hidden h-[73vh] bg-white shadow-lg overflow-x-auto sx:w-full">
        <TableHeader />
        <div className="h-full overflow-y-scroll py-12">
          {data?.map((item, index) => (
            <TableRow item={item} key={index} index={index} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[50px] pl-3 grid grid-cols-12 items-center bg-gray-300 sx:w-[1400px]">
          <div className="col-span-6 flex justify-end pr-4">
            <p className="font-semibold text-sm">{totalRoomSpace?.toFixed(3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoldOutClientsReports;
