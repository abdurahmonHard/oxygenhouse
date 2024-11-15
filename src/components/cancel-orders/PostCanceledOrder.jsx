import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FiArrowUp } from "react-icons/fi"
import Form from "../../examples/form/Form"
import { styles } from "../../assets/styles/styles"
import { NumericFormat } from 'react-number-format'
import { AuthContext } from '../../context/AuthContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getLastCurrency } from '../../functions/UserMethodes'
import { format } from 'date-fns'
import { getCaisher } from '../../functions/CaisherMethods'
import { addPayment } from '../../functions/Payments'
import { getOrderListDue } from '../../functions/OrderMethods'
import { DatePicker, Select } from 'antd'

const PostCanceledOrder = () => {
  const { profile } = useContext(AuthContext)
  const [cancelOrderForm, setCancelOrderForm] = useState(false)
  const [cancelOrderValid, setCancelOrderValid] = useState(true)
  const { data: dollar } = useQuery(["getLastCurrency"], () => getLastCurrency())
  const { data } = useQuery(["getOrderListDue"], () => getOrderListDue({ "is_refunding": true }))
  const { data: caishers } = useQuery(["getCaisher"], () => getCaisher())
  const [debitPayments, setdebitPayments] = useState([])
  const [canceledOrderData, setCanceledOrderData] = useState({
    user_id: profile?.id,
    order_id: "",
    payment_date: "",
    amount: "",
    currency_value: dollar?.rate_value,
    paymentmethods: "",
    caisher_id: "",
    caishertype: "out",
    is_completed: false
  })
  // console.log(data);

  useEffect(() => {
    const selectedOrder = data?.find(item => item.order_id === +canceledOrderData.order_id);
    setdebitPayments(selectedOrder ? [selectedOrder] : []);
  }, [data, canceledOrderData.order_id]);

  const queryClient = useQueryClient()

  // console.log(debitPayments[0]);

  const createPayment = useMutation({
    mutationFn: addPayment,
    onSuccess: () => {
      ["getOrderListDue", "getAllPayments"].forEach(cache => {
        queryClient.invalidateQueries(cache)
      })
    }
  })

  const yearFormat = (value) => {
    return value ? format(new Date(value), "dd-MM-yyy") : "";
  };

  useEffect(() => {
     let isCompleted = canceledOrderData.paymentmethods === "usd" ? debitPayments[0]?.left_amount - (canceledOrderData.amount * canceledOrderData.currency_value) : debitPayments[0]?.left_amount - canceledOrderData.amount;
     if (isCompleted <= 0 && !canceledOrderData.is_completed) {
        setCanceledOrderData(prevData => ({ ...prevData, is_completed: true }));
        // console.log("true");
     } else if (isCompleted > 0 && canceledOrderData.is_completed) {
        setCanceledOrderData(prevData => ({ ...prevData, is_completed: false }));
        // console.log("false");
     }
  }, [debitPayments, canceledOrderData.amount, canceledOrderData.is_completed]);

  const isCompleted = useMemo(() => {
    const debitAmount = debitPayments[0]?.left_amount ?? 0;

    const paymentAmount = canceledOrderData.paymentmethods === "usd" ?
      canceledOrderData.amount * canceledOrderData.currency_value :
      canceledOrderData.amount;
    return debitAmount - paymentAmount;
  }, [debitPayments, canceledOrderData.amount, canceledOrderData.currency_value, canceledOrderData.paymentmethods]);

  const updateIsCompleted = useCallback(() => {
    if (isCompleted <= 0 && !canceledOrderData.is_completed) {
      setCanceledOrderData(prevData => ({ ...prevData, is_completed: true }));
    } else if (isCompleted > 0 && canceledOrderData.is_completed) {
      setCanceledOrderData(prevData => ({ ...prevData, is_completed: false }));
    }
  }, [isCompleted, canceledOrderData.is_completed]);

  useEffect(() => {
    updateIsCompleted();
  }, [updateIsCompleted]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    let newCancelOrder = {
      user_id: +canceledOrderData.user_id,
      order_id: +canceledOrderData.order_id,
      payment_date: canceledOrderData.payment_date,
      amount: +canceledOrderData.amount,
      currency_value: +canceledOrderData.currency_value,
      paymentmethods: canceledOrderData.paymentmethods,
      caisher_id: +canceledOrderData.caisher_id,
      caishertype: canceledOrderData.caishertype,
      is_completed: canceledOrderData.is_completed
    }
    await createPayment.mutate(newCancelOrder)

    setCancelOrderForm(false)
    setCanceledOrderData({
      user_id: profile?.id,
      order_id: "",
      payment_date: "",
      amount: "",
      currency_value: dollar?.rate_value,
      paymentmethods: "",
      caisher_id: "",
      caishertype: "out",
      is_completed: false
    })

  }

  const requiredFields = ["order_id", "paymentmethods", "payment_date", "amount", "currency_value", "caisher_id"];

  useEffect(() => {
    if (Number(canceledOrderData.paymentmethods === "usd" ? debitPayments[0]?.left_amount - canceledOrderData.amount * canceledOrderData.currency_value : debitPayments[0]?.left_amount - canceledOrderData.amount) < 0) {
      setCancelOrderValid(true)
    } else {
      const isFormValid = requiredFields.every((field) => canceledOrderData[field] !== "");
      setCancelOrderValid(!isFormValid);
    }
  }, [canceledOrderData, ...requiredFields]);

  const changeCanceledOrderDate = (dates, dateStrings) => {
    if (dates) {
      setCanceledOrderData({ ...canceledOrderData, payment_date: dateStrings })
    } else {
      console.log("Clear");
    }
  };

  const closeOrderForm = () => {
    setCancelOrderForm(false)
    setCanceledOrderData({
      user_id: profile?.id,
      order_id: "",
      payment_date: "",
      amount: "",
      currency_value: dollar?.rate_value,
      paymentmethods: "",
      caisher_id: "",
      caishertype: "out",
      is_completed: false
    })
  }

  // console.log(data);
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleSelectChange = (selectedOption) => {
    setCanceledOrderData({
      ...canceledOrderData,
      order_id: selectedOption ? selectedOption : null,
    });
  };

  return (
    <div>

      <button onClick={() => setCancelOrderForm(true)} className="flex items-center gap-1 bg-dodgerblue py-1 px-3 text-white rounded-sm">
        <FiArrowUp />
        <p>Chiqim</p>
      </button>

      <Form isOpen={cancelOrderForm} onClose={closeOrderForm} isValid={cancelOrderValid} save={handleSubmitOrder} title={"Bekor qilingan shartnomalar"}>
        <div className='grid grid-cols-2 sx:grid-cols-1 gap-8 m-4'>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              Bekor qilingan shartnoma raqami
            </label>
            <Select
              showSearch
              placeholder="Tanlang"
              optionFilterProp="children"
              allowClear
              value={canceledOrderData.order_id === "" ? null : canceledOrderData.order_id}
              virtual={false}
              onChange={(selectedOption) => {
                handleSelectChange(selectedOption);
              }}
              filterOption={filterOption}
              options={data?.map((order) => ({
                value: order?.order_id,
                label: `№ ${order.order_id} ${yearFormat(order.order_date)} - ${order?.clients}`,
              }))}
              className={`${styles.inputUchun}`}
            />
            {
              debitPayments?.length > 0 &&
              <p className='text-sm font-semibold'>To'langan summa: {Number(debitPayments[0].left_amount)?.brm()} so'm</p>
            }
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              To'lov turi
            </label>
            <select
              className={`${styles.inputUchun}`}
              value={canceledOrderData.paymentmethods}
              onChange={(e) => setCanceledOrderData(({ ...canceledOrderData, paymentmethods: e.target.value }))}
            >
              <option value="" disabled>Tanlang</option>
              <option value="cash">Naqd</option>
              <option value="card">Plastik karta</option>
              {/* <option value="usd">Naqd Dollar</option> */}
              <option value="bank">Bank</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              To'lov miqdori {canceledOrderData.paymentmethods === "usd" ? "$" : "so'm"}
            </label>
            <NumericFormat
              allowLeadingZeros
              thousandSeparator=" "
              className={styles.inputUchun}
              value={canceledOrderData.amount === 0 ? "" : canceledOrderData.amount}
              onValueChange={({ value }) =>
                setCanceledOrderData(
                  {
                    ...canceledOrderData,
                    amount: +value,
                  }
                )
              }
            />
            {
              Number(canceledOrderData.paymentmethods === "usd" ? debitPayments[0] && debitPayments[0]?.left_amount - (canceledOrderData?.amount * canceledOrderData?.currency_value) : debitPayments[0]?.left_amount - canceledOrderData?.amount) < 0 &&
              <p className='text-red-500 text-xs font-semibold'>Siz mijozga ko'p miqdorda pul to'layapsiz</p>
            }
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              To'lov miqdori {canceledOrderData.paymentmethods !== "usd" ? "$" : "so'm"}
            </label>
            <div className={`${styles.inputUchun} flex justify-start items-center bg-gray-100`}>{canceledOrderData.amount && Number(canceledOrderData.paymentmethods === "usd" ? canceledOrderData.amount * canceledOrderData?.currency_value : canceledOrderData.amount / canceledOrderData?.currency_value).toFixed(2)}</div>
          </div>
          <div className='flex md:flex-row sx:flex-col justify-between gap-10 sx:gap-6 col-span-2 sx:col-span-1'>
            <div className="flex w-full flex-col col-span-1 gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>
                Kassa nomi
              </label>
              <select
                className={`${styles.inputUchun}`}
                value={canceledOrderData.caisher_id}
                onChange={(e) => setCanceledOrderData(({ ...canceledOrderData, caisher_id: e.target.value }))}
              >
                <option value="" disabled>Tanlang</option>
                {caishers?.map(item => (
                  item?.is_active &&
                  <option key={item.id} value={item.id}>{item?.is_active && item.caisher_name}</option>
                ))}
              </select>
            </div>
            <div className="flex w-full flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>
                To'lov kuni
              </label>
              <DatePicker className={`${styles.inputUchun} disabled:cursor-not-allowed`} onChange={changeCanceledOrderDate} />
            </div>
          </div>
        </div>
      </Form>

    </div>
  )
}

export default PostCanceledOrder