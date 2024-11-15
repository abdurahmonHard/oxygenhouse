import React, { useContext, useEffect, useState } from 'react'
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

const CassierOutPost = ({ data }) => {
   const { profile } = useContext(AuthContext)
   const [cancelOrderForm, setCancelOrderForm] = useState(false)
   const [cancelOrderValid, setCancelOrderValid] = useState(true)
   const { data: dollar } = useQuery(["getLastCurrency"], () => getLastCurrency())
   const { data: caishers } = useQuery(["getCaisher"], () => getCaisher())

   const [canceledOrderData, setCanceledOrderData] = useState({
      user_id: profile?.id,
      order_id: "",
      payment_date: "",
      amount: "",
      currency_value: dollar?.rate_value,
      amount_usd: "",
      paymentmethods: "",
      caisher_id: "",
      caishertype: "out",
   })

   let debitPayments = data?.filter(item => item.id === +canceledOrderData.order_id)?.[0]?.sumOfPayments
   const queryClient = useQueryClient()

   const createPayment = useMutation({
      mutationFn: addPayment,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["getAllPayments"] })
      }
   })

   const yearFormat = (value) => {
      return value ? format(new Date(value), "dd-MM-yyy") : "";
   };

   const handleSubmitOrder = async (e) => {
      e.preventDefault()
      let newCancelOrder = {
         user_id: +canceledOrderData.user_id,
         order_id: +canceledOrderData.order_id,
         payment_date: canceledOrderData.payment_date,
         amount: +canceledOrderData.amount,
         currency_value: +canceledOrderData.currency_value,
         amount_usd: +canceledOrderData.amount_usd,
         paymentmethods: canceledOrderData.paymentmethods,
         caisher_id: +canceledOrderData.caisher_id,
         caishertype: canceledOrderData.caishertype,
      }
      await createPayment.mutate(newCancelOrder)

      setCancelOrderForm(false)
      setCanceledOrderData({
         user_id: profile?.id,
         order_id: "",
         payment_date: "",
         amount: "",
         currency_value: dollar?.rate_value,
         amount_usd: "",
         paymentmethods: "",
         caisher_id: "",
         caishertype: "out",
      })

   }

   const requiredFields = ["order_id", "paymentmethods", "payment_date", "amount", "currency_value", "amount_usd", "caisher_id"];

   useEffect(() => {
      if (Number(debitPayments - canceledOrderData?.amount) < 0) {
         setCancelOrderValid(true)
      } else {
         const isFormValid = requiredFields.every((field) => canceledOrderData[field] !== "");
         setCancelOrderValid(!isFormValid);
      }
   }, [canceledOrderData, ...requiredFields]);

   const closeOrderForm = () => {
      setCancelOrderForm(false)
      setCanceledOrderData({
         user_id: profile?.id,
         order_id: "",
         payment_date: "",
         amount: "",
         currency_value: dollar?.rate_value,
         amount_usd: "",
         paymentmethods: "",
         caisher_id: "",
         caishertype: "out",
      })
   }

   return (
      <div>

         <button onClick={() => setCancelOrderForm(true)} className="flex items-center gap-1 bg-dodgerblue py-1 px-3 text-white rounded-sm">
            <FiArrowUp />
            <p>Chiqim</p>
         </button>

         <Form isOpen={cancelOrderForm} onClose={closeOrderForm} isValid={cancelOrderValid} save={handleSubmitOrder} title={"Bekor qilingan shartnomalar"}>
            <div className='grid grid-cols-2 gap-8 m-4'>
               <div className="flex flex-col gap-2 mb-2">
                  <label className="font-bold text-[13px]">
                     <span className="mr-1 text-red-600">*</span>
                     Bekor qilingan shartnoma raqami
                  </label>
                  <select className={`${styles.inputUchun}`}
                     value={canceledOrderData.order_id}
                     onChange={(e) =>
                        setCanceledOrderData({
                           ...canceledOrderData,
                           order_id: e.target.value,
                        })
                     }
                  >
                     <option value="hechnima">Tanlang</option>
                     {
                        data?.map(item => (
                           <option key={item?.id} value={item.id}>{`№ ${item.id}-${yearFormat(item.order_date)} ${item?.clients?.first_name} ${item?.clients?.last_name}`}</option>
                        ))
                     }
                  </select>
                  {
                     debitPayments > 0 &&
                     <p className='text-sm font-semibold'>Xaqdorlik: {canceledOrderData.amount ? Number(debitPayments)?.brm() : debitPayments?.brm()} so'm</p>
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
                     <option value="hechnima">Tanlang</option>
                     <option value="cash">Naqd</option>
                     <option value="card">Plastik karta</option>
                     <option value="bank">Bank</option>
                  </select>
               </div>
               <div className="flex flex-col gap-2 mb-2">
                  <label className="font-bold text-[13px]">
                     <span className="mr-1 text-red-600">*</span>
                     To'lov miqdori so'm
                  </label>
                  <NumericFormat
                     allowLeadingZeros
                     thousandSeparator=" "
                     className={styles.inputUchun}
                     value={canceledOrderData.amount === 0 ? "" : canceledOrderData.amount}
                     onValueChange={({ value }) =>
                        setCanceledOrderData({
                           ...canceledOrderData,
                           amount: value,
                           amount_usd: value / canceledOrderData.currency_value,
                        })
                     }
                  />
                  {
                     Number(debitPayments - canceledOrderData?.amount) < 0 &&
                     <p className='text-red-500 text-xs font-semibold'>Siz mijozga ko'p miqdorda pul to'layapsiz</p>
                  }
               </div>
               <div className="flex flex-col gap-2 mb-2">
                  <label className="font-bold text-[13px]">
                     <span className="mr-1 text-red-600">*</span>
                     To'lov miqdori $
                  </label>
                  <NumericFormat
                     prefix='$ '
                     allowLeadingZeros
                     thousandSeparator=" "
                     className={styles.inputUchun}
                     value={(Number(canceledOrderData.amount_usd === 0 ? "" : canceledOrderData.amount_usd)).toFixed(3)}
                     onValueChange={({ value }) =>
                        setCanceledOrderData({
                           ...canceledOrderData,
                           amount_usd: value,
                        })
                     }
                  />
               </div>
               <div className='flex justify-between gap-10 col-span-2'>
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
                        <option value="hech">Tanlang</option>
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
                     <input
                        type="date"
                        className={`${styles.inputUchun} disabled:cursor-not-allowed`}
                        value={canceledOrderData.payment_date}
                        onChange={(e) =>
                           setCanceledOrderData({
                              ...canceledOrderData,
                              payment_date: e.target.value,
                           })
                        }
                     />
                  </div>
               </div>
            </div>
         </Form>

      </div>
   )
}

export default CassierOutPost
