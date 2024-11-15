import React from 'react'

import { useQuery } from "@tanstack/react-query";
import { getSummaryReport } from "../functions/ReportMethod";
import Loading from "../examples/loading/Loading";

function TableHeader() {
  return (
    <div className="bg-gray-300 w-full sticky top-0 left-0 z-[5]">
      <div className="bg-gray-300 flex items-center divide-x-2 divide-black px-3 justify-between gap-2 text-center text-sx font-bold absolute top-0 left-0 w-full sx:w-[1400px]">
        <div className="text-[13px]  grid grid-cols-12 w-full divide-x-2 divide-black items-center">
          <div className="col-span-2 py-3">BINO</div>
          <div className="col-span-3 py-3">UMUMIY SUMMA</div>
          <div className="col-span-2 py-3">NAQD</div>
          <div className="col-span-3 py-3">BANK</div>
          <div className="col-span-2 py-3">QARZ</div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ item }) {
  return (
    <div className="bg-white flex items-center gap-2 hover:bg-white/10 justify-between text-center text-sx border-b-2 px-3">
      <div className="grid grid-cols-12 w-full justify-center items-center text-center text-[14px]">
        <div className="col-span-2 py-3">{item?.townname} <br /> {item?.buildingname}</div>
        <div className="col-span-3 py-3">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'UZS' }).format(item?.total_amount).split(".").join(" ").replace(/\sUZS$/, '')}</div>
        <div className="col-span-2 py-3">{item?.total_sum_cash?.brm()}</div>
        <div className="col-span-3 py-3">{item?.total_sum_bank?.brm()}</div>
        <div className="col-span-2 py-3">{item?.total_sum_due?.brm()}</div>
      </div>
    </div>
  );
}

const SummaryReport = () => {
  const { data, isLoadig } = useQuery(["ClintesReports"], () =>
    getSummaryReport()
  );

  const totalAmount = data?.reduce((a, b) => a + +b.total_amount, 0)
  const totalSumCash = data?.reduce((a, b) => a + +b.total_sum_cash, 0)
  const totalSumBank = data?.reduce((a, b) => a + +b.total_sum_bank, 0)
  const totalSumDue = data?.reduce((a, b) => a + +b.total_sum_due, 0)

  if (isLoadig) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold my-2 sx:text-xs">
          Savdo hisoboti
        </h1>
      </div>
      <div className="min-w-full dark:divide-gray-700 relative rounded-md overflow-hidden h-[73vh] bg-white shadow-lg overflow-x-auto sx:w-full">
        <TableHeader />
        <div className="h-full overflow-y-scroll py-12">
          {data?.map((item, index) => (
            <TableRow item={item} key={index} index={index} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[50px] grid grid-cols-12 items-center bg-gray-300 sx:w-[1400px]">
          <div className="col-span-2 flex justify-center font-bold">Jami:</div>
          <div className="col-span-3 flex justify-center">
            <p className="font-semibold text-sm">{totalAmount?.brm()}</p>
          </div>
          <div className="col-span-2 flex justify-center">
            <p className="font-semibold text-sm">{totalSumCash?.brm()}</p>
          </div>
          <div className="col-span-3 flex justify-center">
            <p className="font-semibold text-sm">{totalSumBank?.brm()}</p>
          </div>
          <div className="col-span-2 flex justify-center">
            <p className="font-semibold text-sm">{totalSumDue?.brm()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryReport