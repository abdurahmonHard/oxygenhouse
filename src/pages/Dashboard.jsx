/* eslint-disable react/no-unescaped-entities */
import { useQuery } from "@tanstack/react-query";
import React, { memo } from "react";
import {
  BsFillBuildingsFill,
  BsFillBuildingFill,
  BsBuildingAdd,
  BsPersonLinesFill,
  BsBuildingCheck,
  BsCashCoin,
  BsBuildingLock,
} from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { getHomepage } from "../functions/ProjectMethods";
import Loading from "../examples/loading/Loading";
import DashboardContainer from "../examples/dashboardContainer/DashboardContainer";

function Dashboard() {
  const { data, isLoading } = useQuery(["getHomepage"], () => getHomepage());

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2">
      <DashboardContainer
        color={"text-blue-500"}
        count={data?.towns}
        description={"Majmualar"}
        icon={<BsFillBuildingsFill />}
      />
      <DashboardContainer
        color={"text-slate-500"}
        count={data?.buildings}
        description={"Binolar"}
        icon={<BsFillBuildingFill />}
      />
      <DashboardContainer
        color={"text-green"}
        count={data?.apartments}
        description={"Xonadonlar"}
        icon={<BsBuildingCheck />}
      />
      <DashboardContainer
        color={"text-dodgerblue"}
        count={data?.clients}
        description={"Mijozlar"}
        icon={<FaUsers />}
      />
      <DashboardContainer
        color={"text-green"}
        count={data?.orders}
        description={"Buyurtmalar"}
        icon={<BsBuildingAdd />}
      />
      <DashboardContainer
        color={"text-primary"}
        count={data?.users}
        description={"Foydalanuvchilar"}
        icon={<BsPersonLinesFill />}
      />
      <DashboardContainer
        color={"text-green"}
        count={data?.payments}
        description={"To'lovlar"}
        icon={<BsCashCoin />}
      />
      <DashboardContainer
        color={"text-red-300"}
        count={data?.bookedApartments}
        description={"Band xonadonlar"}
        icon={<BsBuildingLock />}
      />
    </div>
  );
}

const MemoizeDashboard = memo(Dashboard);
export default MemoizeDashboard;
