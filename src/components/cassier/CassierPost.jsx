import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiArrowDown } from "react-icons/fi";
import Form from "../../examples/form/Form";
import { styles } from "../../assets/styles/styles";
import { NumericFormat } from "react-number-format";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCaisher } from "../../functions/CaisherMethods";
import { getOrderListDue } from "../../functions/OrderMethods";
import { getLastCurrency } from "../../functions/UserMethodes";
import { addPayment } from "../../functions/Payments";
import { format } from "date-fns";
import { DatePicker, Select } from "antd";
import makeAnimated from "react-select/animated";

const CassierPost = () => {
  const { profile, paymentNow, setPaymentNow } = useContext(AuthContext);
  const { data: caishers } = useQuery(["getCaisher"], () => getCaisher());
  const { data: listdue } = useQuery(["getOrderListDue"], () =>
    getOrderListDue({ is_refunding: false })
  );
  // console.log(listdue);
  const { data: dollar } = useQuery(["getLastCurrency"], () =>
    getLastCurrency()
  );

  const [cassierData, setCassierData] = useState({
    user_id: profile?.id,
    order_id: "",
    payment_date: "",
    amount: "",
    currency_value: dollar?.rate_value,
    // amount_usd: "",
    paymentmethods: "",
    caisher_id: "",
    caishertype: "in",
    is_completed: false,
  });

  const [open, setOpen] = useState(paymentNow || false);
  let debitPayments = listdue?.filter(
    (item) => item?.order_id === +cassierData?.order_id
  )[0]?.totalsum;

  useEffect(() => {
    let isCompleted = debitPayments === cassierData.amount;
    if (isCompleted) {
      setCassierData((prevData) => ({ ...prevData, is_completed: true }));
    } else {
      setCassierData((prevData) => ({ ...prevData, is_completed: false }));
    }
  }, [debitPayments, cassierData.amount]);

  const [valid, setValid] = useState(true);
  const queryClient = useQueryClient();

  const createPayment = useMutation({
    mutationFn: addPayment,
    onSuccess: () => {
      ["getOrderListDue", "getAllPayments"].forEach((cache) => {
        queryClient.invalidateQueries(cache);
      });
    },
  });

  const yearFormat = (value) => {
    return value ? format(new Date(value), "dd-MM-yyy") : "";
  };

  const changeCassierDate = (dates, dateStrings) => {
    if (dates) {
      setCassierData({ ...cassierData, payment_date: dateStrings });
    } else {
      console.log("Clear");
    }
  };

  useEffect(() => {
    setCassierData((prev) => ({
      ...prev,
      order_id: paymentNow?.order_id,
      amount: paymentNow?.left_amount
        ? paymentNow?.left_amount
        : paymentNow?.due_amount,
    }));
  }, [paymentNow]);

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    try {
      let newPayment = {
        user_id: +cassierData.user_id,
        order_id: +cassierData.order_id,
        payment_date: cassierData.payment_date,
        amount: +cassierData.amount,
        currency_value: +cassierData.currency_value,
        // amount_usd: +cassierData.amount_usd,
        paymentmethods: cassierData.paymentmethods,
        caisher_id: +cassierData.caisher_id,
        caishertype: cassierData.caishertype,
        is_completed: cassierData.is_completed,
      };
      // console.log(newPayment);
      await createPayment.mutate(newPayment);
      setOpen(false);
      setCassierData({
        user_id: profile?.id,
        order_id: "",
        payment_date: "",
        amount: "",
        currency_value: dollar?.rate_value,
        // amount_usd: "",
        paymentmethods: "",
        caisher_id: "",
        caishertype: "in",
      });
      setPaymentNow(null);
    } catch (error) {
      console.log(error);
    }
  };

  const requiredFields = [
    "order_id",
    "paymentmethods",
    "payment_date",
    "amount",
    "currency_value",
    "caisher_id",
  ];

  useEffect(() => {
    if (Number(debitPayments - cassierData?.amount) < 0) {
      setValid(true);
    } else if (!cassierData.order_id) {
      setValid(true);
    } else {
      const isFormValid = requiredFields.every(
        (field) => cassierData[field] !== ""
      );
      setValid(!isFormValid);
    }
  }, [cassierData, ...requiredFields]);

  const closeForm = () => {
    setOpen(false);
    setCassierData({
      user_id: profile?.id,
      order_id: "",
      payment_date: "",
      amount: "",
      currency_value: dollar?.rate_value,
      // amount_usd: "",
      paymentmethods: "",
      caisher_id: "",
      caishertype: "in",
    });
    setPaymentNow(null);
  };

  const sumInput = useRef();

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleSelectChange = (selectedOption) => {
    setCassierData({
      ...cassierData,
      order_id: selectedOption ? selectedOption : null,
    });
  };

  return (
    <div>
      {profile?.roles?.role_name === "Seller" ? (
        <></>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 bg-green py-1 px-3 text-white rounded-sm"
        >
          <FiArrowDown />
          <p>Kirim</p>
        </button>
      )}
      <Form
        isValid={valid}
        isOpen={open}
        onClose={closeForm}
        save={handleCreatePayment}
        title={"To'lov qilish"}
      >
        <div className="grid md:grid-cols-2 sx:grid-cols-1 gap-8 m-4">
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              Shartnoma raqami
            </label>
            <Select
              showSearch
              placeholder="Tanlang"
              optionFilterProp="children"
              allowClear
              virtual={false}
              value={cassierData.order_id === "" ? null : cassierData.order_id}
              onChange={(selectedOption) => {
                handleSelectChange(selectedOption);
              }}
              filterOption={filterOption}
              options={listdue?.map((order) => ({
                value: order?.order_id,
                label: `№ ${order.order_id} ${yearFormat(order.order_date)} - ${
                  order?.clients
                }`,
              }))}
              className={`${styles.inputUchun}`}
            />
            {/* <select
              value={cassierData.order_id}
              className={`${styles.inputUchun}`}
              onChange={(e) =>
                setCassierData({
                  ...cassierData,
                  order_id: e.target.value,
                })
              }
            >
              <option value="" disabled>Tanlang</option>
              {
                listdue?.filter(a => a?.order_status === "active")?.map((item, index) => {
                  return <option key={index}
                    value={item.order_id}>{`№ ${item.order_id}-${yearFormat(item.order_date)} ${item?.clients}`}</option>
                })
              }
            </select> */}
            {debitPayments > 0 && (
              <p className="text-sm font-semibold">
                Qarzdorlik:{" "}
                {cassierData.amount
                  ? Number(debitPayments)?.brm()
                  : debitPayments?.brm()}{" "}
                so'm
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              To'lov turi
            </label>
            <select
              value={cassierData.paymentmethods}
              onChange={(e) =>
                setCassierData({
                  ...cassierData,
                  paymentmethods: e.target.value,
                })
              }
              className={`${styles.inputUchun}`}
            >
              <option value="" disabled>
                Tanlang
              </option>
              <option value="cash">Naqd So'm</option>
              <option value="usd">Naqd Dollar</option>
              <option value="card">Plastik karta</option>
              <option value="bank">Bank</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              To'lov miqdori{" "}
              {cassierData.paymentmethods === "usd" ? "$" : "so'm"}
            </label>
            <NumericFormat
              getInputRef={sumInput}
              allowLeadingZeros
              thousandSeparator=" "
              className={styles.inputUchun}
              value={cassierData.amount === 0 ? "" : cassierData.amount}
              onValueChange={({ value }) =>
                setCassierData({
                  ...cassierData,
                  amount: +value,
                })
              }
            />
            {Number(
              cassierData.paymentmethods === "usd"
                ? debitPayments -
                    cassierData?.amount * cassierData?.currency_value
                : debitPayments - cassierData?.amount
            ) < 0 && (
              <p className="text-red-500 text-xs font-semibold">
                Siz mijozdan ko'p miqdorda pul olyapsiz
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              To'lov miqdori{" "}
              {cassierData.paymentmethods !== "usd" ? "$" : "so'm"}
            </label>
            <div
              className={`${styles.inputUchun} flex justify-start items-center bg-gray-100`}
            >
              {cassierData.amount &&
                Number(
                  cassierData.paymentmethods === "usd"
                    ? cassierData.amount * cassierData?.currency_value
                    : cassierData.amount / cassierData?.currency_value
                )?.brm()}
            </div>
          </div>
          <div className="flex md:flex-row sx:flex-col justify-between gap-10 md:col-span-2 sx:col-span-1">
            <div className="flex w-full flex-col col-span-1 gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>
                Kassa nomi
              </label>
              <select
                value={cassierData.caisher_id}
                onChange={(e) =>
                  setCassierData({ ...cassierData, caisher_id: e.target.value })
                }
                className={`${styles.inputUchun}`}
              >
                <option value="" disabled>
                  Tanlang
                </option>
                {caishers?.map(
                  (item) =>
                    item?.is_active && (
                      <option key={item.id} value={item.id}>
                        {item?.is_active && item.caisher_name}
                      </option>
                    )
                )}
              </select>
            </div>
            <div className="flex w-full flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>
                To'lov kuni
              </label>
              <DatePicker
                placeholder="Kunni tanlang"
                onChange={changeCassierDate}
                className={`${styles.inputUchun} disabled:cursor-not-allowed`}
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CassierPost;
