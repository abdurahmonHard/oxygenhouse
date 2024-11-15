/* eslint-disable react/no-unescaped-entities */
import { useQuery } from "@tanstack/react-query";
import React, { memo } from "react";
import { getCountData } from "../functions/ProjectMethods";
import { styles } from "../assets/styles/styles";
import { format } from "date-fns";
import Loading from "../examples/loading/Loading";
import { Link } from "react-router-dom";
import projectImage from "../assets/images/project-icon.png";

const SalesDepartments = () => {
  const { data, isLoading } = useQuery(["getCountData"], () => getCountData());
  const formattedDate = (value) => {
    return format(new Date(value), "yyyy-MM-dd");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-4">
      {data.length > 0 ? (
        data?.map((item) => {
          const houses = data?.filter((town) => town.id === item.id)[0];
          return (
            <Link
              to={`/sales-department/details`}
              state={item}
              key={item.id}
              className={`h-[200px] bg-white ${styles.shadowRounded} pt-12 pb-4 px-4 flex flex-col justify-between`}
            >
              <div className="flex justify-between">
                <div className="border w-[80px] h-[80px] flex items-center justify-center rounded-full">
                  <img
                    width={50}
                    className="opacity-90"
                    src={projectImage}
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex text-end">
                    <p className="text-lg font-semibold text-center">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-bold text-gray-500">
                      Yaratildi
                    </p>
                    <p className="text-[12px] font-bold text-gray-500">
                      {formattedDate(item.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 justify-start pl-4 items-center border border-t-0 border-b-0 border-l-0 border-r-primary w-1/2">
                  <p className="text-sm text-primary">Binolar:</p>
                  <p className="text-[13px] font-bold text-primary">
                    {houses?.buildingCount}
                  </p>
                </div>
                <div className="flex gap-2 justify-end pr-2 items-center w-1/2">
                  <p className="text-sm text-primary">Xonadonlar:</p>
                  <p className="text-[13px] font-bold text-primary">
                    {houses?.apartmentCount}
                  </p>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="col-span-4 flex items-center justify-center h-[85vh]">
          <h1 className="font-semibold text-xl">Ma'lumotlar yo'q</h1>
        </div>
      )}
    </div>
  );
};

const MemoizeSalesDepartments = memo(SalesDepartments);
export default MemoizeSalesDepartments;
