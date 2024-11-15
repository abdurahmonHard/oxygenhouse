import React, { useContext } from "react";
import "./ModalTable.css";
import { format } from "date-fns";
import { FiX } from "react-icons/fi";
import { BsFillXCircleFill } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";
import { BeatLoader } from "react-spinners";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";

const ModalTable = ({ isOpen, onClose, data, title, loading }) => {
  // console.log(data);
  const { setPaymentNow } = useContext(AuthContext);
  const formatDate = (value) => {
    return value ? format(new Date(value), "yyyy-MM-dd") : "";
  };
  // const { data: dollar } = useQuery(["getLastCurrency"], () => getLastCurrency())

  const navigate = useNavigate();

  let firstStatus = false;

  const handlePayment = (data) => {
    setPaymentNow(data);
    navigate("/cassier");
  };

  return (
    isOpen && (
      <div>
        <div
          className={`modalTable-container ${isOpen ? "open" : ""
            } rounded-sm p-6 overflow-scroll sx:w-[90%]  ${title === "Naqd to'lash" || title === "Dollar to'lash"
              ? "w-1/2"
              : "w-[85%]"
            }`}
        >
          <div className="flex md:flex-row sx:flex-col sx:items-start justify-between border-b pb-4 relative">
            <h1 className="sx:mb-4">{title} jadvali</h1>
            <div className="flex md:flex-row sx:items-start sx:flex-col gap-8 sx:gap-2 items-center">
              <p className="text-sm font-semibold">
                Majmua :{" "}
                {
                  data?.orderItems?.[0]?.apartments?.floor?.entrance?.buildings
                    ?.towns?.name
                }
              </p>
              <p className="text-sm font-semibold">
                Bino :{" "}
                {
                  data?.orderItems?.[0]?.apartments?.floor?.entrance?.buildings
                    ?.name
                }
              </p>
              <p className="text-sm font-semibold">
                Xonadon : {data?.orderItems?.[0]?.apartments?.room_number}
              </p>
            </div>
            <FiX
              className="text-2xl cursor-pointer md:static sx:absolute top-0 right-0"
              onClick={() => onClose(false)}
            />
          </div>
          <div
            className={`pt-4 rounded-sm ${title === "Naqd to'lash" || title === "Dollar to'lash"
              ? "flex-col"
              : "flex"
              } justify-between text-left overflow-x-auto`}
          >
            <div>
              <h1 className="font-semibold mb-6">{title} haqida ma'lumot</h1>
              <div className="flex flex-col whitespace-nowrap gap-4 justify-start text-gray-600">
                <div className="bg-gray-100 p-2">
                  <p className="text-sm font-medium">
                    <span className="mr-2 text-black font-semibold">
                      Shartnoma ID raqami:
                    </span>{" "}
                    {data?.id}
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-sm font-medium bg-gray-100 p-2">
                    <span className="mr-2 text-black font-semibold">
                      Umumiy summa so'm:
                    </span>{" "}
                    {Math.floor(Number(data?.total_amount))?.brm()}{" "}
                  </p>
                  <p className="text-sm font-medium text-[#85bb65] bg-gray-100 p-2">
                    <span className="mr-2 text-black font-semibold">
                      Umumiy summa $:
                    </span>{" "}
                    {Math.floor(
                      Number(data?.total_amount / data?.currency_value)
                    )?.brm()}
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-sm font-medium bg-gray-100 p-2">
                    <span className="mr-2 text-black font-semibold">
                      Boshlang'ich to'lov so'm:
                    </span>{" "}
                    {Number(data?.initial_pay)?.brm()}{" "}
                  </p>
                  <p className="text-sm font-medium text-[#85bb65] bg-gray-100 p-2">
                    <span className="mr-2 text-black font-semibold">
                      Boshlang'ich to'lov $:
                    </span>{" "}
                    {Math.floor(
                      Number(data?.initial_pay / data?.currency_value)
                    )?.brm()}
                  </p>
                </div>
                <div className={`flex flex-col gap-6 ${data?.order_status === "inactive" || data?.order_status === "refunded" ? "hidden" : "block"}`}>
                  <p className="text-sm font-medium bg-gray-100 p-2">
                    <span className="mr-2 text-black font-semibold">
                      To'langan so'm:
                    </span>{" "}
                    {Number(data?.sumOfpayments)?.brm()}{" "}
                  </p>
                  <p className="text-sm font-medium text-[#85bb65] bg-gray-100 p-2">
                    <span className="mr-2 text-black font-semibold">
                      To'langan $:
                    </span>{" "}
                    {Math.floor(
                      Number(data?.sumOfpayments / data?.currency_value)
                    )?.brm()}
                  </p>
                </div>
                <div className="bg-gray-100 p-2">
                  <p className="text-sm font-medium">
                    {/*  */}
                    <span className="mr-2 text-black font-semibold">
                      {data?.order_status === "inactive" || data?.order_status === "refunded" ? "Xaqdorlik:" : "Qarzdorlik:"}
                    </span>

                    {data?.order_status === "inactive" || data?.order_status === "refunded" ? data?.sumOfpayments?.brm() : Math.floor(
                      Number(data?.total_amount - data?.sumOfpayments)
                    )?.brm()}
                  </p>
                </div>
                <div className="bg-gray-100 p-2 flex items-center gap-2">
                  <p className="text-sm text-[#85bb65] font-medium">
                    <span className="mr-2 text-black font-semibold">
                      Dollar kursi:
                    </span>{" "}
                    {Number(data?.currency_value)?.brm()} so'm
                  </p>
                  <span className="text-sm font-semibold">{formatDate(data?.created_at)}</span>
                </div>
                <div className="bg-gray-100 p-2">
                  <p className="text-sm text-[#85bb65] font-medium">
                    <span className="mr-2 text-black font-semibold">
                      Sotilgan uyning kvadrati:
                    </span>{" "}
                    {data?.orderItems?.map((a) => a?.apartments?.room_space)}
                  </p>
                </div>
                {/* <div className='bg-gray-100 p-2'>
                <p className='text-sm text-[#85bb65] font-medium'><span className='mr-2 text-black font-semibold'>Sotilgan uyning kvadrat narxi so'mda:</span>  {Math.floor(data?.orderItems?.map(a => (+a?.final_price)))?.brm()} so'm</p>
              </div>
              <div className='bg-gray-100 p-2'>
                <p className='text-sm text-[#85bb65] font-medium'><span className='mr-2 text-black font-semibold'>Sotilgan uyning kvadrat narxi $ da:</span>  {Math.floor(data?.orderItems?.map(a => (+a?.final_price / +data?.currency_value)))?.brm()} $</p>
              </div> */}
                {/* <div>
                        <p className='text-sm font-medium'><span className='text-black font-semibold'>To'langan sana:</span> {formatDate(data?.created_at)}</p>
                     </div> */}
              </div>
            </div>
            {loading && <BeatLoader color="#1769c7" />}
            {data?.creditTables?.length === 0 ? (
              <></>
            ) : (
              <div className="shadow-best w-full max-h-[508px] rounded-sm overflow-y-auto">
                <table className="border border-collapse table-auto w-full text-sm text-left text-black relative">
                  <thead className="uppercase text-xs border border-gray-300 bg-gray-200 sticky top-0">
                    <tr className="border border-gray-300">
                      <th className="px-6 py-3 text-center border border-gray-300">
                        №
                      </th>
                      <th className="px-6 py-3 text-center border border-gray-300">
                        To'lov sanasi
                      </th>
                      <th className="px-6 py-3 text-center border border-gray-300">
                        To'lov miqdori so'm
                      </th>
                      <th className="px-6 py-3 text-center border border-gray-300">
                        To'lov miqdori $
                      </th>
                      <th className="px-6 py-3 text-center border border-gray-300">
                        Qoldiq so'm
                      </th>
                      <th className="px-6 py-3 text-center border border-gray-300">
                        Qoldiq $
                      </th>
                      <th className="py-3 text-center border border-gray-300">
                        To'landi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data?.creditTables?.map((item, index) => (
                      <tr
                        className="border text-sm border-gray-300"
                        key={item.id}
                      >
                        <td className="px-6 py-3 text-center border border-gray-300">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 text-center border border-gray-300">
                          {formatDate(item.due_date)}
                        </td>
                        <td className="px-6 py-3 text-center border border-gray-300">
                          {Number(item.due_amount)?.brm()}
                        </td>
                        <td className="px-6 py-3 text-center border border-gray-300">
                          {Math.floor(Number(item.usd_due_amount))?.brm()}
                        </td>
                        <td className="px-6 py-3 text-center border border-gray-300">
                          {Number(item.left_amount)?.brm()}
                        </td>
                        <td className="px-6 py-3 text-center border border-gray-300">
                          {Math.floor(
                            Number(item.left_amount / data?.currency_value)
                          )?.brm()}
                        </td>
                        <td className="py-3 text-center border border-gray-300 text-lg">
                          <span>
                            {item?.status === "paid" ? (
                              <FaCircleCheck className="mx-auto text-green" />
                            ) : item?.status === "unpaid" ? (
                              <BsFillXCircleFill className="mx-auto text-red-500" />
                            ) : item.status === "waiting" && !firstStatus ? (
                              ((firstStatus = true),
                                (
                                  <button
                                    disabled={
                                      data?.order_status === "refunded" ||
                                      data?.order_status === "inactive"
                                    }
                                    onClick={() => handlePayment(item)}
                                    className="bg-green text-white text-sm py-2 px-5 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    To'lash
                                  </button>
                                ))
                            ) : (
                              ""
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div
          onClick={() => onClose(false)}
          className={`modalTable-backdrop ${isOpen ? "open" : ""}`}
        ></div>
      </div>
    )
  );
};

export default ModalTable;
