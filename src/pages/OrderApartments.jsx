/* eslint-disable react/no-unescaped-entities */
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getOrderAppartments } from "../functions/ReportMethod";
import Loading from "../examples/loading/Loading";

function TableHeader() {
  return (
    <div className="bg-gray-300 flex items-center divide-x-2 divide-black rounded-tl-md rounded-tr-md px-3 justify-between gap-2 text-center text-sx font-bold absolute top-0 left-0 w-full sx:w-[1400px]">
      <div className="py-3">№</div>
      <div className="text-sm  grid grid-cols-4 divide-x-2 w-full divide-black">
        <div className="col-span-1 py-3">Maskan nomi</div>
        <div className="col-span-1 py-3">Bino</div>
        <div className="col-span-1 py-3">Qavat</div>
        {/* <div className="col-span-1 py-3">Xona raqami</div> */}
        <div className="col-span-1 py-3">Xona maydoni</div>
      </div>
    </div>
  );
}

function TableRow({ index, item }) {
  
  return (
    <div className="bg-white flex items-center hover:bg-white/10 justify-between text-center text-sx border-b-2 px-3">
      <div className="py-3 w-8">{index + 1}</div>
      <div className="grid grid-cols-4 w-full justify-center items-center">
        <div className="col-span-1 py-3">{item.towns_name}</div>
        <div className="col-span-1 py-3">{item.buildings_name}</div>
        <div className="col-span-1 py-3">{item.floor_floor_number}</div>
        <div className="text-green col-span-1 py-3">
          {Number(item.all_room_space).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

const OrderApartments = () => {
  const { data, isLoadig } = useQuery(["OrderApartments"], () =>
    getOrderAppartments()
  );
  // console.log(data);
  if (isLoadig) {
    return <Loading />;
  }
  const sumByKey = (data, key) => {
    return data?.reduce((sum, item) => sum + Number(item[key] || 0), 0);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold my-2 sx:text-sm">
        Sotilgan Xonadonlar
      </h1>
      <div className="dark:divide-gray-700 relative py-12 rounded-md bg-white overflow-x-auto sx:w-full">
        <TableHeader />
        <div className=" h-[60vh] overflow-y-scroll sx:w-[1400px] sx:text-sm">
          {data?.map((item, index) => (
            <TableRow item={item} key={index} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderApartments;
