/* eslint-disable react/no-unescaped-entities */
import React, { memo, useEffect, useState } from "react";
import SalesLayer from "./sales-types/SalesLayer";
import SalesChess from "./sales-types/SalesChess";
import { useLocation } from "react-router";
import { FiGrid, FiLayers } from "react-icons/fi";
import { styles } from "../../assets/styles/styles";
import { useQuery } from "@tanstack/react-query";
import { getAllBuildings } from "../../functions/ProjectMethods";
import SalesDetail from "./sales-types/SalesDetail";
import Loading from "../../examples/loading-department/LoadingDepartment";

const SalesHeader = () => {
  const { state } = useLocation();
  const [numAppartments, setNumAppartments] = useState({});
  const [page, setPage] = useState(false);

  const { data, isFetching } = useQuery(["getAllBuildings"], () =>
    getAllBuildings(state?.id)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [getDataAppartment, setGetDataAppartment] = useState([]);
  // console.log(data);
  const showDetail = (id) => {
    setGetDataAppartment(id);
    setIsOpen(true);
  };
  useEffect(() => {
    const appartmentNum = {
      allNum: 0,
      free: 0,
      sold: 0,
      bron: 0,
      inactive: 0,
      leftside: 0,
      rightside: 0,
    };
    data?.entrances?.forEach((item) => {
      item.floors.forEach((item) => {
        appartmentNum.allNum = appartmentNum.allNum + item.apartments.length;
        item.apartments.forEach((item) => {
          if (item.status === "free") {
            appartmentNum.free += 1;
            if (item.positions === "leftside") {
              appartmentNum.leftside += 1;
            } else if (item.positions === "rightside") {
              appartmentNum.rightside += 1;
            }
          } else if (item.status === "sold") {
            appartmentNum.sold += 1;
            if (item.positions === "leftside") {
              appartmentNum.leftside += 1;
            } else if (item.positions === "rightside") {
              appartmentNum.rightside += 1;
            }
          } else if (item.status === "bron") {
            appartmentNum.bron += 1;
            if (item.positions === "leftside") {
              appartmentNum.leftside += 1;
            } else if (item.positions === "rightside") {
              appartmentNum.rightside += 1;
            }
          }
        });
      });
    });
    setNumAppartments(appartmentNum);
  }, [data]);
  if (isOpen) {
    return (
      <SalesDetail
        getDataAppartment={getDataAppartment}
        setIsOpen={setIsOpen}
      />
    );
  }

  return (
    <div>
      {isFetching && <Loading />}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setPage(false)}
          className={`sm:w-[200px] h-[80px] ${page
            ? "border-2 border-dodgerblue text-dodgerblue"
            : "bg-dodgerblue text-white"
            } rounded-md ${styles.flexColCenter} gap-1 duration-200`}
        >
          <FiGrid className="text-2xl" />
          <p className="text-md font-medium">Shaxmatka</p>
        </button>
        <button
          onClick={() => setPage(true)}
          className={`sm:w-[200px] h-[80px] ${page
            ? "bg-dodgerblue text-white"
            : "border-2 border-dodgerblue text-dodgerblue"
            } rounded-md ${styles.flexColCenter} gap-1 duration-200`}
        >
          <FiLayers className="text-2xl" />
          <p className="text-md font-medium">Plitka</p>
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-5 mt-5">
        <div className="flex mr-10 gap-2 items-center">
          <p className="text-sm font-semibold text-gray-500">Kvartiralar soni:</p>
          <p className="text-sm">{numAppartments?.allNum} ta</p>
        </div>
        <div className="flex flex-wrap  h-[40px] items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="min-w-[35px] h-[30px] px-1 text-sm font-semibold text-white flex items-center justify-center bg-green rounded-sm">
              {numAppartments.free}
            </div>
            <p className="text-sm">Bo'sh</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="min-w-[35px] h-[30px] px-1 text-sm font-semibold text-white flex items-center justify-center bg-dodgerblue rounded-sm">
              {numAppartments.bron}
            </div>
            <p className="text-sm">Band</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="min-w-[35px] h-[30px] px-1 text-sm font-semibold text-white flex items-center justify-center bg-orange  rounded-sm">
              {numAppartments.leftside}
            </div>
            <p className="text-sm">Qibla</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="min-w-[35px] h-[30px] px-1 text-sm font-semibold text-white flex items-center justify-center bg-black rounded-sm">
              {numAppartments.rightside}
            </div>
            <p className="text-sm">Ko'cha tomon</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="min-w-[35px] h-[30px] px-1 text-sm font-semibold text-white flex items-center justify-center bg-red-500 rounded-sm">
              {numAppartments.sold}
            </div>
            <p className="text-sm">Sotilgan</p>
          </div>
          {/* <div className="flex items-center gap-2">
						<div className="min-w-[35px] h-[30px] px-1 text-sm font-semibold text-white flex items-center justify-center bg-unavailable rounded-sm">{numAppartments.inactive}</div>
						<p className="text-sm">Sotuvga qo'yilmagan</p>
					</div> */}
        </div>
      </div>
      {page ? (
        <SalesLayer
          state={state}
          showDetail={showDetail}
          data={data?.entrances}
        />
      ) : (
        <SalesChess showDetail={showDetail} data={data?.entrances} />
      )}
    </div>
  );
};

const MemoizeSalesHeader = memo(SalesHeader);
export default MemoizeSalesHeader;
