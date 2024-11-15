/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Loading from "../examples/loading/Loading";
import {
  BsArrowLeftSquare,
  BsArrowRightSquare,
  BsSearch,
} from "react-icons/bs";
import ExportToExcel from "../components/ExcelDownload/ExcelDownload";
import {
  addCanceledBooking,
  getApartmentsInfo,
  getBookingAppartment,
  getBookingById,
} from "../functions/ProjectMethods";
import Contaract from "../components/sales-department/sales-types/Contaract";
import { AuthContext } from "../context/AuthContext";
import Booking from "../components/booking/Booking";
import TableHead from "../components/booking/TableHead";

const BusyApartments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageParam, setPageParam] = useState(1);
  const [modal, setModal] = useState(false);
  const { profile } = useContext(AuthContext);
  const { data, isLoading } = useQuery(
    ["getBookingAppartment", pageParam],
    async () => await getBookingAppartment(pageParam)
  );
  let idapparrment = null;
  const [idAppa, setIdAppa] = useState(null);
  const { data: appartment, refetch } = useQuery(
    ["getApartmentsInfo"],
    () => getApartmentsInfo(idapparrment),
    { enabled: false }
  );
  const { data: booked, refetch: bookRefetch } = useQuery(
    ["getBookingById", data?.id],
    async () => await getBookingById(appartment?.id),
    { enabled: false },
    { refetchOnWindowFocus: false }
  );
  const filteredCustomers = searchTerm
    ? data?.filter((item) =>
        Object.values(item.clients).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;
  useEffect(() => {
    if (appartment?.status === "bron") {
      appartment !== undefined && bookRefetch();
    }
  }, [appartment]);
  const handleExportToExcel = () => {
    const exportData = filteredCustomers.map((item) => ({
      Sotuvchi: `${item?.users?.first_name} ${item?.users?.last_name}`,
      Mijoz: `${item.clients.last_name} ${item.clients.first_name}`,
      "Tel raqami": item.clients.contact_number,
      Zakolat: item.bron_amount,
      "Xonadon raqami": item.apartments.room_number,
      "Xonadon hajmi": item.apartments.room_space,
      "Band qilingan kun": format(new Date(item.bron_date), "yyyy-MM-dd"),
      "Tugash muddati": format(new Date(item.bron_expires), "yyyy-MM-dd"),
    }));

    ExportToExcel(exportData, "Band qilingan xonadonlar");
  };
  const bookingHandler = (item) => {
    idapparrment = item.apartments.id;
    refetch();
    setModal(true);
    setIdAppa(item.apartments.id);
  };
  const queryClient = useQueryClient();
  const postCanceledBooking = useMutation({
    mutationFn: addCanceledBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getBookingAppartment"] });
    },
  });

  const canceledContract = async (elem) => {
    await postCanceledBooking.mutate(elem);
  };

  const handleRowSelection = (id, checked) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else if (data) {
      setSelectedRows(data.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-3">
      <div>
        {modal && (
          <Contaract
            idAppa={idAppa}
            data={appartment}
            setModal={setModal}
            modal={modal}
            booked={booked}
          />
        )}
        <div className="flex flex-col gap-3 lg:flex-row  lg:justify-between lg:items-center">
          <div className="flex flex-wrap items-center gap-[50px] justify-between">
            <h1 className="font-semibold">Band Xonadonlar</h1>
            <div className="flex w-full sm:w-[400px]  lg:w-[350px] h-[40px] items-center gap-3 border pl-3 bg-white border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue">
              <input
                value={searchTerm}
                type="text"
                className="w-full h-full focus:ring-0 focus:outline-none rounded-md bg-transparent delay-100"
                required
                placeholder="Band xonadonlarni izlash"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="border rounded-md bg-[#1E90FF] text-white p-2 h-full">
                <BsSearch className="text-lg" />
              </button>
            </div>
          </div>
          {profile?.roles?.role_name !== "Seller" ? (
            <div className="flex flex-wrap justify-end items-center gap-3">
              {selectedRows?.length > 0 && (
                <button
                  onClick={() => canceledContract(selectedRows)}
                  className="bg-orange px-2 py-1.5 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"
                >
                  Bekor qilish
                </button>
              )}
              <button
                disabled={!data?.length}
                onClick={handleExportToExcel}
                className="bg-blue-500 px-6 py-1.5 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"
              >
                Excel
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="w-full overflow-x-scroll shadow-md rounded-md mt-6">
          <div className="relative  w-[1300px] xl:w-[1380px] 2xl:w-full">
            <div className="absolute bottom-0 z-[1] p-2 left-0 bg-gray-300  flex items-center justify-end gap-4 w-full">
              <button
                className="disabled:text-gray-200 text-primary"
                disabled={pageParam === 1 ? true : false}
                onClick={() => setPageParam((prev) => prev - 1)}
              >
                <BsArrowLeftSquare className="text-xl" />
              </button>
              <button
                className="disabled:text-gray-200 text-primary"
                disabled={filteredCustomers.length < 20 ? true : false}
                onClick={() => setPageParam((prev) => prev + 1)}
              >
                <BsArrowRightSquare className="text-xl" />
              </button>
            </div>
            <div className="h-[73vh] pb-8 pt-12 lg:pt-14 xl:pt-12 2xl:pt-12 overflow-y-scroll">
              <div className="border   border-collapse  text-sm text-center text-black">
                <div className="absolute w-full z-[1] top-0 left-0">
                  <TableHead
                    selectAll={selectAll}
                    handleSelectAll={handleSelectAll}
                  />
                </div>
                {filteredCustomers ? (
                  filteredCustomers.length > 0 ? (
                    filteredCustomers?.map((item, i) => (
                      <Booking
                        isSelected={selectedRows.includes(item.id)}
                        handleRowSelection={handleRowSelection}
                        key={i}
                        index={i}
                        bookingHandler={bookingHandler}
                        pageParam={pageParam}
                        item={item}
                      />
                    ))
                  ) : (
                    <div className="py-4">
                      <h1 className="text-xl font-semibold">Malumotlar Yo'q</h1>
                    </div>
                  )
                ) : (
                  <Loading />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusyApartments;
