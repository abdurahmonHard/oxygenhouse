import React, { memo, useContext, useEffect, useState } from "react";
import { styles } from "../../../assets/styles/styles";
import Contaract from "./Contaract";
import Bron from "./Bron";
import { useQuery } from "@tanstack/react-query";
import {
  getApartmentsInfo,
  getBookingById,
  getImage,
} from "../../../functions/ProjectMethods";
import Loading from "../../../examples/loading/Loading";
import { getOrdersByAppartmentID } from "../../../functions/OrderMethods";
import TableRow from "../../reports/TableRow";
import { AuthContext } from "../../../context/AuthContext";
import Booking from "../../booking/Booking";
import OrdersTable from "../../reports/OrdersTable";
import TableHead from "../../booking/TableHead";
import LoadingDepartment from "../../../examples/loading-department/LoadingDepartment";

const SalesDetail = ({ setIsOpen, getDataAppartment }) => {
  const { profile } = useContext(AuthContext);

  const [modal, setModal] = useState(false);
  const [modalBron, setModalBron] = useState(false);
  const { data, isLoading, isFetching } = useQuery(
    ["getApartmentsInfo"],
    () => getApartmentsInfo(getDataAppartment),
    { refetchOnWindowFocus: false }
  );
  const [imageId, setImageId] = useState(
    data?.floor?.entrance?.buildings?.file_id
  );
  const { data: image, isLoading: imageLoading } = useQuery(
    ["getImage", imageId],
    () => getImage(imageId),
    { refetchOnWindowFocus: false }
  );

  // const { data:orders, refetch } = useQuery(["getAllOrders", 1], async () => await getAllOrders(data.id),  { enabled: false });
  const { data: orders, refetch } = useQuery(
    ["getOrdersByAppartmentID", data?.id],
    async () => await getOrdersByAppartmentID(data?.id),
    { enabled: false },
    { refetchOnWindowFocus: false }
  );
  const { data: booked, refetch: bookRefetch } = useQuery(
    ["getBookingById", data?.id],
    async () => await getBookingById(data?.id),
    { enabled: false },
    { refetchOnWindowFocus: false }
  );
  const { data: apartmentImage, isFetching: apartmentFetching } = useQuery(
    ["getImage", data?.file_id],
    () => getImage(data?.file_id),
    { refetchOnWindowFocus: false }
  );
  useEffect(() => {
    if (data?.status === "sold") {
      data !== undefined && refetch();
    }
    if (data?.status === "bron") {
      data !== undefined && bookRefetch();
    }
  }, [data]);

  useEffect(() => {
    setImageId(data?.floor?.entrance?.buildings?.file_id);
  }, [data]);

  const typeStatus = {
    sold: "sotilgan",
    free: "bo'sh",
    busy: "sotuvga qo'yilmagan",
    bron: "band",
  };
  const getBackgroundColor = (item) => {
    let gradient = "";
    if (item?.status === "free") {
      gradient =
        item.positions === "leftside"
          ? "from-orange from-50% to-green to-50%"
          : item.positions === "rightside"
          ? "from-green from-50% to-black to-50%"
          : "bg-green";
    } else if (item?.status === "sold") {
      gradient =
        item.positions === "leftside"
          ? "from-orange from-50% to-red-500 to-50%"
          : item.positions === "rightside"
          ? "from-red-500 from-50% to-black to-50%"
          : "bg-red-500";
    } else if (item?.status === "bron") {
      gradient =
        item.positions === "leftside"
          ? "from-orange from-50% to-dodgerblue to-50%"
          : item.positions === "rightside"
          ? "from-dodgerblue from-50% to-black to-50%"
          : "bg-dodgerblue";
    }
    return `bg-gradient-to-r ${gradient}`;
  };
  return (
    <div className={`flex flex-col`}>
      {isFetching && <LoadingDepartment />}
      {isLoading ? (
        <Loading />
      ) : (
        <Contaract
          booked={booked}
          idAppa={data?.id}
          data={data}
          setModal={setModal}
          modal={modal}
          loading={isLoading}
        />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <Bron
          data={data}
          setModal={setModalBron}
          modal={modalBron}
          loading={isLoading}
        />
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 ">
          <img
            src={image}
            className="w-full h-full rounded-md object-cover object-center"
            alt=""
          />
        </div>
        <div>
          <h1 className="text-xl  text-[#1E90FF] capitalize">
            {data?.floor?.entrance.buildings.towns.name} -{" "}
            {data?.floor.entrance.buildings.name} - № {data?.room_number}
          </h1>
          <div className="flex mt-2 gap-5">
            <p>Podyezd: {data?.floor.entrance.entrance_number}</p>
            <p>Qavat: {data?.floor.floor_number}</p>
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-red-500 py-2 px-5 text-white font-thin text-sm text-center rounded"
          >
            Yopish
          </button>
        </div>
      </div>
      <div className="w-full mt-10 gap-10  grid grid-cols-1 xl:grid-cols-2 rounded-md">
        <div className="flex flex-col text-sm justify-between order-1">
          <div className={`${styles.flexBetween} flex-wrap bg-gray-300 p-3`}>
            <p className="font-semibold">Obyekt nomi:</p>
            <p className="capitalize">
              {data?.floor.entrance.buildings.towns.name}
            </p>
          </div>
          <div className={`${styles.flexBetween} flex-wrap p-3`}>
            <p className="font-semibold">Obyekt manzili:</p>
            <p className="capitalize">
              {data?.floor.entrance.buildings.towns.address}
            </p>
          </div>
          <div className={`${styles.flexBetween} flex-wrap bg-gray-300 p-3`}>
            <p className="font-semibold">Bino nomi:</p>
            <p className="capitalize">{data?.floor.entrance.buildings.name}</p>
          </div>
          <div className={`${styles.flexBetween} flex-wrap p-3`}>
            <p className="font-semibold">Qavat:</p>
            <p className="capitalize">
              {data?.floor.floor_number} /{" "}
              {data?.floor.entrance.buildings.floor_number}
            </p>
          </div>
          <div className={`${styles.flexBetween} flex-wrap bg-gray-300 p-3`}>
            <p className="font-semibold">Podyezd:</p>
            <p className="capitalize">{data?.floor.entrance.entrance_number}</p>
          </div>
          <div className={`${styles.flexBetween} flex-wrap p-3`}>
            <p className="font-semibold">Xonadon holati:</p>
            <p className="capitalize">{typeStatus[data?.status]}</p>
          </div>
          <div className={`${styles.flexBetween} flex-wrap bg-gray-300 p-3`}>
            <p className="font-semibold">Xonadon raqami:</p>
            <p>№ {data?.room_number}</p>
          </div>
          <div className={`${styles.flexBetween} flex-wrap p-3`}>
            <p className="font-semibold">Xonadon xonalari:</p>
            <p>{data?.cells}</p>
          </div>
          <div className={`${styles.flexBetween} flex-wrap p-3 bg-gray-300`}>
            <p className="font-semibold">
              Xonadon hajmi (1m<sup>2</sup> ) :
            </p>
            <p>
              {data?.room_space} m<sup>2</sup>
            </p>
          </div>
          {/* <div className={`${styles.flexBetween} flex-wrap p-3`}>
            <p className="font-semibold">Kvadrat narxi (1m<sup>2</sup> ) :</p>
            <p>{data?.floor.entrance.buildings.mk_price?.brm()} so'm</p>
          </div> */}
          {/* <div className={`${styles.flexBetween} flex-wrap bg-gray-300 p-3`}>
            <p className="font-semibold">Xonadon umumiy narxi:</p>
            <p>{(Math.floor((data?.room_space) * (data?.floor.entrance.buildings.mk_price) / 1000) * 1000)?.brm()} so'm</p>
          </div> */}
        </div>
        <div className="xl:order-1">
          <div className="aspect-[5/3]">
            {!apartmentFetching && (
              <img
                className="object-cover  object-center w-full h-full"
                src={
                  apartmentImage?.error
                    ? "https://wpmedia.roomsketcher.com/content/uploads/2022/01/06124754/Best-laid-floor-plans-3D-Floor-Plan-2.jpg"
                    : apartmentImage
                }
                alt=""
              />
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-5 justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${getBackgroundColor(data)}`}></div>
              <p className="capitalize">{typeStatus[data?.status]}</p>
            </div>
            {profile?.roles?.role_name !== "Seller" ? (
              <div className="text-white flex flex-wrap gap-4">
                {data?.status === "free" && (
                  <button
                    onClick={() => setModalBron(true)}
                    className={`cursor-pointer w-full sm:w-auto bg-dodgerblue rounded py-2 px-5 text-center`}
                  >
                    Bron so'rovi
                  </button>
                )}
                {(data?.status === "free" || data?.status === "bron") && (
                  <button
                    onClick={() => setModal(true)}
                    className={`cursor-pointer w-full sm:w-auto bg-green rounded py-2 px-5 text-center`}
                  >
                    Sotish
                  </button>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="relative overflow-x-scroll">
        {data?.status === "sold" && orders ? (
          <div className="mb-5 mt-10 w-[1300px] xl:w-[1380px] 2xl:w-full">
            <OrdersTable />
            <TableRow item={orders} />
          </div>
        ) : (
          ""
        )}
        {data?.status === "bron" && booked ? (
          <div className="mb-5 mt-10 w-[1300px] xl:w-[1380px] 2xl:w-full">
            <TableHead detail={true} />
            <Booking item={booked} />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const MemoizeSalesDetail = memo(SalesDetail);
export default MemoizeSalesDetail;
