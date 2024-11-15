import { format } from "date-fns";
import React, { useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getLastCurrency } from "../../functions/UserMethodes";
import { useQuery } from "@tanstack/react-query";

const Booking = ({
  item,
  index,
  bookingHandler,
  pageParam,
  isSelected,
  handleRowSelection,
}) => {
  // Sana formatlash funksiyasi
  const formattedDate = useCallback((value) => {
    return format(new Date(value), "yyyy-MM-dd");
  }, []);
  const { profile } = useContext(AuthContext);
  const { data: dollar } = useQuery(["getLastCurrency"], () =>
    getLastCurrency()
  );
  if (!item) {
    return <h1>Malumotlar topilmadi</h1>;
  }
  // console.log(item);
  return (
    <div
      key={item.id}
      className={`bg-white text-center border-b border-black text-sm hover:bg-white/10 flex justify-center  items-center`}
    >
      {pageParam ? (
        <div className="flex items-center gap-3 px-5">
          <input
            id={`hs-table-pagination-checkbox-${item?.id}`}
            type="checkbox"
            className="border-gray-200 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={isSelected}
            onChange={(e) => handleRowSelection(item?.id, e.target.checked)}
          />
          <div>{(pageParam - 1) * 20 + index + 1}</div>
        </div>
      ) : (
        bookingHandler && <div className={`py-2 px-8`}>1</div>
      )}
      <div
        className={`grid ${
          pageParam ? "grid-cols-10" : "grid-cols-10"
        } text-center justify-center items-center w-full`}
      >
        <div className="py-2 col-span-1 flex flex-col justify-center">
          {item?.users?.last_name} {item?.users?.first_name}
        </div>
        <div className="py-2 col-span-1 flex flex-col justify-center">
          {item?.clients?.last_name} {item?.clients?.first_name}
        </div>
        <div className="py-2 col-span-1 flex flex-col justify-center">
          {item?.clients.contact_number}
        </div>
        <div className="py-2 col-span-1 flex flex-col justify-center">
          <p>{Number(item?.bron_amount)?.brm()} so'm</p>
        </div>
        <div className="py-2 col-span-1 flex flex-col justify-center">
          <p className="text-[#85bb65] font-semibold">
            {Math.floor(
              Number(item?.bron_amount) / Number(dollar?.rate_value)
            )?.brm()}
            $
          </p>
        </div>
        <div className="py-2 col-span-1 flex flex-col justify-center">
          {item?.apartments.room_number}
        </div>
        <div className="py-2 col-span-1 flex flex-col justify-center">
          <div>
            {item?.apartments.room_space}m<sup>2</sup>
          </div>
        </div>
        <div className="py-2 col-span-1 flex flex-col justify-center">
          {formattedDate(item?.bron_date)}
        </div>
        <div className="py-2 col-span-1 flex flex-col justify-center">
          {formattedDate(item?.bron_expires)}
        </div>
        {profile?.roles?.role_name !== "Seller" && pageParam && (
          <div className="flex flex-col py-2 items-center justify-center">
            <button
              onClick={() => bookingHandler(item)}
              className={`cursor-pointer text-white bg-green rounded py-2 px-5 text-center`}
            >
              Sotish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
