/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomers } from "../functions/ProjectMethods";
import { format } from "date-fns";
import { FiPlus } from "react-icons/fi";
import CustomerCreate from "../components/customers/CustomerCreate";
import Loading from "../examples/loading/Loading";
import { styles } from "../assets/styles/styles";
import { BiEditAlt } from "react-icons/bi";
import {
  BsArrowLeftSquare,
  BsArrowRightSquare,
  BsSearch,
} from "react-icons/bs";
import ExportToExcel from "../components/ExcelDownload/ExcelDownload";
import { AuthContext } from "../context/AuthContext";

const TABLE_HEAD = [
  "№",
  "sotuvchi",
  "F.I.SH",
  "jshshir",
  "tel raqam",
  "p. seriyasi",
  "tug'ilgan yili",
  "p. berilgan joy",
  "p. berilgan sana",
  "p. muddati",
  "yaratilgan",
  "tahrirlash",
];

const initialState = {
  first_name: "",
  last_name: "",
  middle_name: "",
  tin: "",
  gender: "",
  type: "",
  address: "",
  contact_number: "",
  date_of_birth: "",
  passport_seria: "",
  given_from: "",
  given_date: "",
  untill_date: "",
  legal_address: "",
  registered_address: "",
  description: "",
};

const Customers = () => {
  const [show, setShow] = useState(false);
  const [isPost, setIsPost] = useState(true);
  const [customerData, setCustomerData] = useState(initialState);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageParam, setPageParam] = useState(1);
  const { data, isLoading } = useQuery(
    ["getAllCustomers", pageParam],
    async () => await getAllCustomers(pageParam)
  );

  const { profile } = useContext(AuthContext);

  const formattedDate = useCallback((value) => {
    return format(new Date(value), "yyyy-MM-dd");
  }, []);

  const filteredCustomers = searchTerm
    ? data?.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const handleAddClick = useCallback(() => {
    setShow(true);
    setIsPost(true);
  }, []);

  const handleEditClick = useCallback((item) => {
    setShow(true);
    setIsPost(false);
    setCustomerData(item);
  }, []);

  const handleExportToExcel = () => {
    const exportData = filteredCustomers.map((item) => ({
      Sotuvchi: `${item.users.first_name} ${item?.users?.last_name}`,
      Ismi: item.first_name,
      Familiyasi: item.last_name,
      "Otasining ismi": item.middle_name,
      Jinsi: item.gender === "male" ? "Erkak" : "Ayol",
      Manzili: item.address,
      "Tel raqami": item.contact_number,
      "Tug'ilgan yili":
        formattedDate(item.date_of_birth) !== "0001-01-01"
          ? formattedDate(item.date_of_birth)
          : "",
      "Passport seria raqami": item.passport_seria,
      "Kim tomonidan berilgan": item.given_from,
      "Qachon berilgan":
        formattedDate(item.given_date) !== "0001-01-01"
          ? formattedDate(item.given_date)
          : "",
      "Amal qilish muddati":
        formattedDate(item.untill_date) !== "0001-01-01"
          ? formattedDate(item.untill_date)
          : "",
      // "Yuridik manzili": item.legal_address,
      // "Ro'yxatdan o'tkan manzili": item.registered_address,
      // Izoh: item.description,
      "Kiritilgan sana":
        formattedDate(item.created_at) !== "0001-01-01"
          ? formattedDate(item.created_at)
          : "",
      "Yangilangan sana":
        formattedDate(item.updated_at) !== "0001-01-01"
          ? formattedDate(item.updated_at)
          : "",
    }));

    ExportToExcel(exportData, "Mijozlar");
  };

  const tableHeaders = useMemo(
    () =>
      TABLE_HEAD.map((item, idx) => (
        <div
          key={idx}
          className="text-center flex items-center justify-center font-semibold px-4 py-2 col-span-1"
        >
          {item}
        </div>
      )),
    []
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <CustomerCreate
        initialState={initialState}
        isPost={isPost}
        customerData={customerData}
        setCustomerData={setCustomerData}
        setShow={setShow}
        show={show}
        data={data}
      />
      <div>
        <div className="flex flex-col gap-3 lg:flex-row  lg:justify-between lg:items-center ">
          <div className="flex flex-wrap items-center gap-[50px] justify-between">
            <h1 className="font-semibold">Mijozlar</h1>
            <div className="flex w-full sm:w-[400px]  lg:w-[350px] h-[40px] items-center gap-3 border pl-3 bg-white border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue">
              <input
                value={searchTerm}
                type="text"
                className="w-full h-full focus:ring-0 focus:outline-none rounded-md bg-transparent delay-100"
                required
                placeholder="Mijozlarni izlash"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="border rounded-md bg-[#1E90FF] text-white p-2 h-full">
                <BsSearch className="text-lg" />
              </button>
            </div>
          </div>
          {profile?.roles?.role_name !== "Seller" ? (
            <div className="flex justify-end items-center gap-3">
              <button
                disabled={!data?.length}
                onClick={handleExportToExcel}
                className="bg-blue-500  py-1.5 px-6 text-white rounded text-sm flex items-center gap-1 disabled:cursor-default disabled:opacity-70"
              >
                Excel
              </button>
              <button
                onClick={handleAddClick}
                className={`bg-green px-2 py-1.5 text-white rounded text-sm ${styles.flexCenter}`}
              >
                <FiPlus className="text-lg" />
                <p className="text-md">Yaratmoq</p>
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="w-full overflow-x-scroll shadow-md rounded-md mt-6">
          <div className="relative  w-[1300px] xl:w-[1380px] 2xl:w-full">
            <div className="absolute bottom-0 left-0 bg-gray-300 p-2 flex items-center justify-end gap-4 w-full">
              <button
                className="disabled:text-gray-200"
                disabled={pageParam === 1 ? true : false}
                onClick={() => setPageParam((prev) => prev - 1)}
              >
                <BsArrowLeftSquare className="text-xl" />
              </button>
              <button
                className="disabled:text-gray-200"
                disabled={filteredCustomers.length < 20 ? true : false}
                onClick={() => setPageParam((prev) => prev + 1)}
              >
                <BsArrowRightSquare className="text-xl" />
              </button>
            </div>
            <div className="h-[73vh] overflow-y-auto ">
              <div className="border  border-collapse table-auto xl:w-full text-sm text-center text-black py-10">
                <div className="uppercase text-xs bg-gray-300 w-full absolute top-0 left-0 flex items-center border-b border-black">
                  <div scope="col" className="py-3 px-4 pr-0">
                    <input
                      id="hs-table-pagination-checkbox-all"
                      type="checkbox"
                      className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="grid grid-cols-12">{tableHeaders}</div>
                </div>
                <div className="divide-y divide-gray-400  pt-5 xl:pt-2">
                  {filteredCustomers ? (
                    filteredCustomers.length > 0 ? (
                      filteredCustomers?.map((item, i) => (
                        <div
                          key={item.id}
                          className="flex items-center bg-white hover:bg-unavailable hover:bg-opacity-5"
                        >
                          <div scope="col" className="py-3 px-4 pr-0">
                            <input
                              id="hs-table-pagination-checkbox-all"
                              type="checkbox"
                              className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                              //   checked={selectAll}
                              //   onChange={handleSelectAll}
                            />
                          </div>
                          <div className="text-center  grid grid-cols-12 items-center w-full">
                            <div className="py-2 col-span-1">
                              {(pageParam - 1) * 20 + i + 1}
                            </div>
                            <div className="py-2 col-span-1">
                              {item?.users?.first_name} {item?.users?.last_name}
                            </div>
                            <div className="py-2 col-span-1">{`${item.last_name} ${item.first_name} ${item.middle_name}`}</div>
                            <div className="py-2 col-span-1">{`${item.tin}`}</div>
                            <div className="py-2 col-span-1">
                              {item.contact_number}
                            </div>
                            <div className="py-2 col-span-1">
                              {item.passport_seria}
                            </div>
                            <div className="py-2 col-span-1">
                              {formattedDate(item.date_of_birth) !==
                              "0001-01-01"
                                ? formattedDate(item.date_of_birth)
                                : ""}
                            </div>
                            <div className="py-2 col-span-1">
                              {item.given_from}
                            </div>
                            <div className="py-2 col-span-1">
                              {formattedDate(item.given_date) !== "0001-01-01"
                                ? formattedDate(item.given_date)
                                : ""}
                            </div>
                            <div className="py-2 col-span-1">
                              {formattedDate(item.untill_date) !== "0001-01-01"
                                ? formattedDate(item.given_date)
                                : ""}
                            </div>
                            <div className="py-2 col-span-1">
                              {formattedDate(item.created_at)}
                            </div>
                            <div className="py-2 flex justify-center">
                              <button
                                onClick={() => handleEditClick(item)}
                                className={`w-[30px] h-[30px] bg-yellow-500 rounded-full ${styles.flexCenter} cursor-pointer`}
                              >
                                <BiEditAlt className="text-sm text-white" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start justify-center">
                        <div colSpan={12} className="py-4">
                          <h1 className="text-xl font-semibold">
                            Malumotlar Yo'q
                          </h1>
                        </div>
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
    </div>
  );
};

export default Customers;
