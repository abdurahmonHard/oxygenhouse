import React, { memo, useContext } from "react";
import { useState } from "react";
import Form from "../../../examples/form/Form";
import { styles } from "../../../assets/styles/styles";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCustomers,
  getBronUser,
  getContractNumber,
  getPaymentType,
  postPayment,
} from "../../../functions/ProjectMethods";
import { format } from "date-fns";
// import makeAnimated from "react-select/animated";
import { getAllUsers, getLastCurrency } from "../../../functions/UserMethodes";
import { AuthContext } from "../../../context/AuthContext";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router";
import { getCaisher } from "../../../functions/CaisherMethods";
// import { getImage } from "../../../functions/ProjectMethods"
import { Select } from "antd";

const initialState = {
  client_id: "",
  user_id: "",
  apartment_id: "",
  payment_method_id: "",
  initial_pay: 0,
  order_date: "",
  order_status: "active",
  quantity: "",
  installment_month: "",
  price: "",
  total_price: "",
  caisher_id: "",
  percent: 0,
  delivery_time: 0,
};
const formatDate = (value) => {
  return value ? format(new Date(value), "yyyy-MM-dd") : "";
};

const Contaract = ({ modal, booked, data, idAppa, setModal }) => {
  const [isValid, setIsValid] = useState(true);
  const [isDollar, setIsDollar] = useState(false);
  const [isPercent, setIsPercent] = useState("");
  const [totalPayMonth, setTotalPayMonth] = useState(0);
  const [clientsData, setClientsData] = useState(initialState);
  const { data: getDollar } = useQuery(
    ["getLastCurrency"],
    () => getLastCurrency(),
    { refetchOnWindowFocus: false }
  );
  const { data: paymentType } = useQuery(
    ["getPaymentType"],
    () => getPaymentType(0),
    { refetchOnWindowFocus: false }
  );
  const { data: allcustomer } = useQuery(
    ["getAllCustomers"],
    () => getAllCustomers(1),
    { refetchOnWindowFocus: false }
  );
  const { data: bronCustomer } = useQuery(
    ["getBronUser", idAppa],
    () => getBronUser(idAppa),
    { refetchOnWindowFocus: false }
  );
  const { data: contractNum } = useQuery(
    ["getContractNumber"],
    () => getContractNumber(),
    { refetchOnWindowFocus: false }
  );
  const { data: allUsers, isLoading } = useQuery(
    ["getAllUsers"],
    () => getAllUsers(0),
    { refetchOnWindowFocus: false }
  );
  const { data: caisher } = useQuery(["getCaisher"], () => getCaisher(), {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // clientsData.payment_method_id === 3
    //   ? clientsData.price*data?.room_space
    setClientsData((prev) => ({
      ...prev,
      price: clientsData.initial_pay / data.room_space,
    }));
  }, [setClientsData, data.room_space]);
  // (data?.room_space * clientsData.price) >= 1000 ? Math.floor(data?.room_space * clientsData.price / 1000) * 1000 : 0;
  //totalMkPrice = totalMkPrice.toString().padStart(3, "0");

  useEffect(() => {
    setClientsData((prev) => ({
      ...prev,
      price: totalPayMonth / data.room_space,
    }));
  }, [setClientsData, totalPayMonth, data.room_space]);

  useEffect(() => {
    const newTotalPayMonth = clientsData.price * data.room_space;
    setTotalPayMonth(newTotalPayMonth);
  }, [clientsData.price, data.room_space]);

  let totalMkPrice = clientsData.price * data.room_space;

  // let totalPrice =
  //   // clientsData.payment_method_id === 3
  //   //     ? clientsData.initial_pay/data?.room_space
  //   clientsData.initial_pay / data?.room_space;

  let total_pay_month =
    // clientsData.payment_method_id === 3
    //     ? clientsData.initial_pay/data?.room_space
    totalPayMonth / clientsData.installment_month;

  const [isManyPrice, setIsManyPrice] = useState(false);
  const { profile } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    setClientsData((prevData) => ({
      ...prevData,
      apartment_id: data?.id,
      initial_pay: booked ? +booked?.bron_amount : 0,
    }));
    // data !== undefined && refetch()
    setIsDollar(false);
  }, [data, booked, modal]);
  useEffect(() => {
    setClientsData((prevData) => ({
      ...prevData,
      initial_pay: isDollar
        ? +(booked
            ? Math.floor(booked?.bron_amount / getDollar?.rate_value)
            : 0)
        : booked
        ? +booked?.bron_amount
        : 0,
      price: "",
    }));
  }, [isDollar]);

  useEffect(() => {
    setClientsData((prevData) => ({
      ...prevData,
      percent: Math.round((prevData?.initial_pay * 100) / totalMkPrice),
    }));
  }, [clientsData.initial_pay, totalMkPrice, totalMkPrice, total_pay_month]);

  useEffect(() => {
    let isCompleted = clientsData.initial_pay === +totalMkPrice;
    if (isCompleted && clientsData.payment_method_id === 3) {
      setClientsData((prevData) => ({
        ...prevData,
        order_status: "completed",
      }));
    } else {
      setClientsData((prevData) => ({ ...prevData, order_status: "active" }));
    }
  }, [totalMkPrice, totalMkPrice, total_pay_month, clientsData.initial_pay]);

  const requiredFields = [
    "client_id",
    "caisher_id",
    "user_id",
    "apartment_id",
    "order_date",
    "payment_method_id",
    "total_amount",
    "initial_pay",
  ];

  useEffect(() => {
    if (
      clientsData.price
        ? totalMkPrice < clientsData.initial_pay
        : data?.room_space * data?.floor?.entrance?.buildings?.mk_price <
          clientsData.initial_pay
    ) {
      console.log(
        clientsData.price * data?.room_space +
          " " +
          clientsData.initial_pay +
          " " +
          clientsData.price +
          " " +
          (data?.room_space + "* " + data?.floor?.entrance?.buildings?.mk_price)
      );
      setIsValid(true);
      setIsManyPrice(true);
    } else {
      const isFormValid = requiredFields.every(
        (field) => clientsData[field] !== "" && clientsData[field] !== 0
      );
      setIsValid(!isFormValid);
      setIsManyPrice(false);
    }
  }, [clientsData, ...requiredFields]);

  const queryClient = useQueryClient();
  const addCustomer = useMutation({
    mutationFn: postPayment,
    onSuccess: () => {
      ["getBuildingById", "getApartmentsInfo"].forEach((cache) => {
        queryClient.invalidateQueries(cache);
      });
    },
  });
  const saveContaract = async (e) => {
    e.preventDefault();

    let newPayment = {
      client_id: clientsData.client_id,
      user_id: clientsData.user_id,
      apartment_id: clientsData.apartment_id,
      payment_method_id: clientsData.payment_method_id,
      initial_pay: clientsData.initial_pay,
      order_date: clientsData.order_date,
      order_status: clientsData.order_status,
      quantity: clientsData.quantity,
      installment_month: clientsData.installment_month,
      price: clientsData.price,
      caisher_id: clientsData.caisher_id,
      percent: clientsData.percent,
      delivery_time: clientsData.delivery_time,
    };
    // console.log(newPayment);
    await addCustomer.mutate(newPayment);
    setIsValid(false);
    setModal(false);
  };

  const [naqd, setNaqd] = useState(false);
  const handleInputChange = (fieldName, value) => {
    if (value === -1) {
      navigate("/customers");
    } else {
      setClientsData((prevData) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }
  };

  const handlePaymentMethod = (fieldName, value) => {
    fieldName === "payment_method_id" &&
      paymentType?.map((item) => {
        if (Number(value) === Number(item.id)) {
          let boll =
            item.name_alias.toLowerCase() === "naqd" ||
            item.name_alias.toLowerCase() === "dollar"
              ? false
              : true;
          if (!boll) {
            setClientsData((prevData) => ({
              ...prevData,
              ["installment_month"]: "",
            }));
          }

          if (item.name_alias === "dollar") {
            setIsDollar(true);
          } else {
            setIsDollar(false);
          }
          setNaqd(boll);
        }
      });
    //   if (fieldName === "") {

    //   }
    setClientsData((prevData) => ({
      ...prevData,
      [fieldName]: +value,
    }));
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleSelectChange = (selectedOption) => {
    setClientsData({
      ...clientsData,
      client_id: selectedOption ? selectedOption : null,
    });
  };

  const handleNewCustomerClick = () => {
    navigate("/customers");
  };

  const closeHandle = () => {
    setModal(false);
    setClientsData(initialState);
  };

  return (
    <div>
      <Form
        width="80%"
        isOpen={modal}
        onClose={closeHandle}
        save={saveContaract}
        title={"Sotuv bo'limi"}
        isValid={isValid}
      >
        <div className="grid items-start overflow-x-hidden overflow-y-scroll h-[60vh] sm:h-[60vh] grid-cols-1 xl:grid-cols-5">
          <div className="sm:grid xl:col-span-3 m-4 sm:grid-cols-3 gap-3 mt-5">
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Mijoz
              </label>
              <Select
                showSearch
                placeholder="Tanlang"
                optionFilterProp="children"
                allowClear
                virtual={false}
                onChange={(selectedOption) => {
                  if (selectedOption && selectedOption === -1) {
                    // Yangi mijoz qo'shish tanlovi bosganda ishlaydi
                    handleNewCustomerClick();
                  } else {
                    // Boshqa tanlovlar uchun onChange hodisasi ishlaydi
                    handleSelectChange(selectedOption);
                  }
                }}
                filterOption={filterOption}
                value={
                  clientsData.client_id === "" ? null : clientsData.client_id
                }
                options={
                  data?.status === "free"
                    ? [
                        {
                          value: -1,
                          label: "+ Yangi mijoz qo'shish",
                          style: { color: "white", background: "#6bc144" },
                        },
                        ...(allcustomer
                          ? allcustomer.map((item) => ({
                              value: item?.id,
                              label: `${item.first_name} ${item.last_name} ${item.middle_name}`,
                            }))
                          : []),
                      ]
                    : [
                        {
                          value: bronCustomer?.clients?.id,
                          label: `${bronCustomer?.clients?.first_name} ${bronCustomer?.clients?.last_name} ${bronCustomer?.clients?.middle_name}`,
                        },
                      ]
                }
                className={`${styles.inputUchun}`}
              />
              {/* <select
                type="text" className="w-full capitalize h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
                value={clientsData.client_id}
                onChange={(e) =>
                  handleInputChange("client_id", +e.target.value)
                }
              >
                <option value="">Hech qanday</option>
                {data?.status === "free" ? allcustomer?.map((item, i) => (
                  <option value={item.id} key={i}>
                    {item.first_name}  {item.last_name}  {item.middle_name}
                  </option>
                )) :
                  <option value={bronCustomer?.clients?.id} >
                    {bronCustomer?.clients?.first_name}  {bronCustomer?.clients?.last_name}  {bronCustomer?.clients?.middle_name}
                  </option>
                }
                <option className='text-white bg-green' value="-1">+ Yangi mijoz qo'shish</option>
              </select> */}
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Foydalanuvchi
              </label>
              <select
                type="text"
                className="w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
                value={clientsData.user_id}
                onChange={(e) => handleInputChange("user_id", +e.target.value)}
              >
                <option value="">Hech qanday</option>
                {profile?.roles?.role_name === "SuperAdmin" ? (
                  !isLoading &&
                  allUsers?.map((item, i) => (
                    <option key={i} value={item.id}>
                      {item.last_name} {item.first_name}
                    </option>
                  ))
                ) : (
                  <option value={profile.id}>
                    {profile.last_name} {profile.first_name}
                  </option>
                )}
              </select>
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Shartnoma raqami №
              </label>
              <input
                value={contractNum !== undefined ? contractNum : ""}
                type="text"
                disabled={true}
                className="w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>To'lov turi
              </label>
              <select
                type="text"
                className="w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
                value={clientsData.payment_method_id}
                onChange={(e) =>
                  handlePaymentMethod("payment_method_id", +e.target.value)
                }
              >
                <option value="">Hech qanday</option>
                {paymentType?.map((item, i) => (
                  <option key={i} value={item.id}>
                    {item.name_alias}
                  </option>
                ))}
              </select>
            </div>
            {naqd && (
              <div className="flex flex-col gap-2 mb-2">
                <label className="font-bold text-[13px]">
                  <span className="mr-1 text-red-600">*</span>Kredit muddati
                  (oy)
                </label>
                <input
                  value={clientsData.installment_month}
                  onChange={(e) =>
                    handleInputChange("installment_month", +e.target.value)
                  }
                  type="number"
                  className="w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Kelishilgan narx (m{" "}
                <sup>2</sup>)
              </label>
              <NumericFormat
                allowLeadingZeros
                thousandSeparator=" "
                className={`w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100`}
                value={clientsData.price}
                onValueChange={({ value }) =>
                  setClientsData({
                    ...clientsData,
                    price: +value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                Boshlang'ich to'lov
              </label>
              <NumericFormat
                allowLeadingZeros
                thousandSeparator=" "
                className={`w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100`}
                value={
                  clientsData.payment_method_id === 1 ||
                  clientsData.payment_method_id === 3
                    ? totalMkPrice
                    : total_pay_month
                }
                onValueChange={({ value }) =>
                  setClientsData({
                    ...clientsData,
                    initial_pay: +value,
                  })
                }
              />
              {isManyPrice ? (
                <p className="text-sm text-red-500">
                  Siz ko'p miqdorda pul to'layapsiz
                </p>
              ) : (
                <></>
              )}
            </div>
            {naqd && (
              <div className="flex flex-col gap-2 mb-2">
                <label className="font-bold text-[13px]">Umumiy narxi</label>
                <NumericFormat
                  allowLeadingZeros
                  thousandSeparator=" "
                  className={`w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100`}
                  value={totalPayMonth}
                  onValueChange={({ value }) => setTotalPayMonth(+value)}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">Foizda To'lov</label>
              <NumericFormat
                allowLeadingZeros
                thousandSeparator=" "
                className={`w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100`}
                value={
                  clientsData?.initial_pay === 0
                    ? ""
                    : Math.round(
                        (clientsData?.initial_pay * 100) / totalMkPrice
                      )
                }
                onValueChange={({ value }) =>
                  setClientsData({
                    ...clientsData,
                    percent: +value,
                  })
                }
              />
              {isManyPrice ? (
                <p className="text-sm text-red-500">
                  Siz ko'p miqdorda pul to'layapsiz
                </p>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Buyurtma sanasi
              </label>
              <input
                value={formatDate(clientsData.order_date)}
                onChange={(e) =>
                  handleInputChange("order_date", e.target.value)
                }
                type="date"
                className="w-full  first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Kassa nomi
              </label>
              <select
                type="text"
                className="w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100"
                value={clientsData.caisher_id}
                onChange={(e) =>
                  handlePaymentMethod("caisher_id", +e.target.value)
                }
              >
                <option value="null">Hech qanday</option>
                {caisher?.map((item, i) => (
                  <option key={i} value={item.id}>
                    {item.caisher_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Topshirish muddati
              </label>
              <NumericFormat
                allowLeadingZeros
                thousandSeparator=" "
                className={`w-full capitalize first-letter:uppercase h-[40px] focus:ring-0 focus:outline-none border border-gray-500 rounded-md indent-2 text-[14px] focus:border-dodgerblue delay-100`}
                value={
                  clientsData?.delivery_time > 0 ? clientsData.delivery_time : 0
                }
                onValueChange={({ value }) =>
                  setClientsData({
                    ...clientsData,
                    delivery_time: +value,
                  })
                }
              />
            </div>

            {booked && booked !== null && booked?.length !== 0 ? (
              <div className="col-span-2 font-semibold">
                Birlamchi zakolat:{" "}
                <span className="font-normal text-md">
                  {Math.floor(
                    Number(
                      isDollar
                        ? booked?.bron_amount / getDollar?.rate_value
                        : booked?.bron_amount
                    )
                  )?.brm()}{" "}
                  {isDollar ? "$" : "so'm"}
                </span>
              </div>
            ) : (
              ""
            )}
            {isDollar ? (
              clientsData.initial_pay >
              Math.floor(booked?.bron_amount / getDollar?.rate_value) ? (
                <div className="col-span-2 font-semibold">
                  Mijozdan olinadigan summa:{" "}
                  <span className="font-normal text-md">
                    {(
                      clientsData.initial_pay -
                      Math.floor(booked?.bron_amount / getDollar?.rate_value)
                    )?.brm()}{" "}
                    {isDollar ? "$" : "so'm"}
                  </span>
                </div>
              ) : (
                ""
              )
            ) : clientsData.initial_pay > Math.floor(booked?.bron_amount) ? (
              <div className="col-span-2 font-semibold">
                Mijozdan olinadigan summa:{" "}
                <span className="font-normal text-md">
                  {(
                    clientsData.initial_pay - Math.floor(booked?.bron_amount)
                  )?.brm()}{" "}
                  {isDollar ? "$" : "so'm"}
                </span>
              </div>
            ) : (
              ""
            )}
            {/* {clientsData.price ?  {</span></div> : ""} */}
            {clientsData.price ? (
              isDollar ? (
                <div className="col-span-2 font-semibold">
                  Kelishilgan umumiy narx:{" "}
                  <span className="font-normal text-md">
                    {Number(totalMkPrice)?.brm()} $
                  </span>
                </div>
              ) : (
                <div className="col-span-2 font-semibold">
                  Kelishilgan umumiy narx:{" "}
                  <span className="font-normal text-md">
                    {Number(totalMkPrice)?.brm()} so'm
                  </span>
                </div>
              )
            ) : (
              ""
            )}
          </div>
          <div className="sm:grid xl:col-span-2  gap-5 m-4">
            {/* <div className="aspect-[5/3] w-full">
              <img
                className="object-cover object-center h-full w-full"
                src="https://wpmedia.roomsketcher.com/content/uploads/2022/01/06124754/Best-laid-floor-plans-3D-Floor-Plan-2.jpg"
                alt=""
              />
            </div> */}
            <div className="flex flex-col text-sm">
              <div className={`p-3 border-b`}>
                <p className=" text-xl sm:text-2xl font-bold">
                  {data?.floor.entrance.buildings.towns.name}
                </p>
              </div>
              {/* <div className={`${styles.flexBetween} p-3 border-b`}>
                <p className="font-semibold">Umumiy narx:</p>
                <p>{((data?.room_space) * (data?.floor.entrance.buildings.mk_price))?.brm()} so'm / {Math.floor((data?.room_space) * Math.floor(data?.floor.entrance.buildings.mk_price / getDollar?.rate_value)).brm()} $</p>

              </div>
              <div className={`${styles.flexBetween} p-3 border-b`}>
                <p className="font-semibold">Narx (1m<sup>2</sup>):</p>
                <p>{(data?.floor.entrance.buildings.mk_price)?.brm()} so'm / {Math.floor(data?.floor.entrance.buildings.mk_price / getDollar?.rate_value)?.brm()} $</p>
              </div> */}
              <div className={`${styles.flexBetween} p-3 border-b`}>
                <p className="font-semibold">Kvartira xonalari:</p>
                <p>{data?.cells}</p>
              </div>
              <div className={`${styles.flexBetween} p-3 border-b`}>
                <p className="font-semibold">
                  Kvartira hajmi (1m<sup>2</sup> ) :
                </p>
                <p>
                  {data?.room_space} m<sup>2</sup>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
const MemoizeContaract = memo(Contaract);
export default Contaract;
