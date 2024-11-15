/* eslint-disable react/no-unescaped-entities */
import React, { memo } from "react";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllBuildings } from "../functions/ProjectMethods";
import Loading from "../examples/loading-department/LoadingDepartment";
import EntranceManage from "../components/apartments/EntranceManage";

const Apartments = () => {
  const { state } = useLocation();
  const { data } = useQuery(["getAllBuildings"], () =>
    getAllBuildings(state.id)
  );

  return (
    <div>
      <div className="w-full min-h-14  flex items-center border-dashed border-2 border-gray-300 mb-4 pl-10 py-2 sx:pl-2">
        <h1 className="font-medium text-sm sx:text-xs text-gray-500">
          Ushbu sahifada siz xoxlagan uyni qo'shish yoki
          o'zgartirishingiz yoki o'chirishingiz mumkin
        </h1>
      </div>
      <div className="bg-white rounded-md mt-8 sx:mt-2">
        {data ? <EntranceManage data={data} /> : <Loading />}
      </div>
    </div>
  );
};

const MemoizeApartments = memo(Apartments);
export default MemoizeApartments;
