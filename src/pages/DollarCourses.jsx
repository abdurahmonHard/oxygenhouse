import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getCurrenciesAll } from "../functions/CurrenciesMethod";
import Loading from "../examples/loading/Loading";
import { format } from "date-fns";

export default function DollarCourses() {
  const { data, isLoading } = useQuery(["GetCoursesRate"], () =>
    getCurrenciesAll()
  );
  const formattedDate = (value) => {
    return format(new Date(value), "yyyy-MM-dd");
  };
  if (isLoading) {
    return <Loading />;
  }
  const hourFormat = (value) => {
    return value ? format(new Date(value), "HH:mm ") : "";
  };

  return (
    <div className="flex flex-col gap-4 w-full sx:w-full overflow-x-auto">
      <h1 className="text-xl font-semibold sx:text-sm">Hisobotlar</h1>
      <div className="flex flex-col w-full sx:w-[1400px] sx:text-sm">
        <div className="grid grid-cols-7 bg-gray-400 p-3 rounded-t-md text-md font-semibold">
          <div className="col-span-1">№</div>
          <div className="col-span-1">Dollar</div>
          <div className="col-span-1">Foydalanuvchi</div>
          <div className="col-span-1">Sum</div>
          <div className="col-span-1">Kiritilgan sana</div>
          <div className="col-span-1">Yangilangan sana</div>
          <div className="col-span-1">Holat</div>
        </div>
        <div className="w-full h-[70vh] overflow-y-scroll flex flex-col justify-start">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div
                className="grid grid-cols-7 p-3 bg-white border-b-2"
                key={index}
              >
                <div className="col-span-1">{index + 1}</div>
                <div className="col-span-1">1$</div>
                <div className="col-span-1">{item?.users?.first_name}</div>
                <div className="col-span-1">{item.rate_value}</div>
                <div className="col-span-1 flex gap-1 items-center">
                  {formattedDate(item.created_at)} {hourFormat(item.created_at)}
                </div>
                <div className="col-span-1 flex gap-1 items-center">
                  {formattedDate(item.updated_at)} {hourFormat(item.updated_at)}
                </div>
                <div className="col-span-1">
                  {item.is_default ? (
                    <span className="text-green">Faol</span>
                  ) : (
                    <span className="text-red-500">Faol Emas</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-center p-3 font-semibold">Malumotlar yo'q</h1>
          )}
        </div>
        <div className="bg-gray-300 p-3 rounded-b-md"></div>
      </div>
    </div>
  );
}
