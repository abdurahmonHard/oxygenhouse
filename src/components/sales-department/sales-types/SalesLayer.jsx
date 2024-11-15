import React, { memo, useState } from "react";
import "./ProjectSale.css";

const SalesLayer = ({ state, data, showDetail }) => {
  const [max, setMax] = useState([]);
  data?.forEach((item) =>
    max.length < item.floors.length ? setMax(item.floors) : null
  );

  const getBackgroundColor = (item) => {
    let gradient = "";
    if (item.status === "free") {
      gradient =
        item.positions === "leftside"
          ? "from-orange/40 from-50% to-green/40 to-50%"
          : item.positions === "rightside"
          ? "from-green/40 from-50% to-black/40 to-50%"
          : "bg-green/40";
    } else if (item.status === "sold") {
      gradient =
        item.positions === "leftside"
          ? "from-orange/40 from-50% to-red-500/40 to-50%"
          : item.positions === "rightside"
          ? "from-red-500/40 from-50% to-black/40 to-50%"
          : "bg-red-500/40";
    } else if (item.status === "bron") {
      gradient =
        item.positions === "leftside"
          ? "from-orange/40 from-50% to-dodgerblue/40 to-50%"
          : item.positions === "rightside"
          ? "from-dodgerblue/40 from-50% to-black/40 to-50%"
          : "bg-dodgerblue/40";
    }
    return `bg-gradient-to-r ${gradient}`;
  };

  return (
    <div>
      <div className="mt-10">
        <div className="flex flex-col">
          <div className="flex">
            <div className="flex flex-col gap-1">
              <h1 className="text-sm text-start">Qavatlar</h1>
              <div className="flex flex-col-reverse">
                {max?.map((_, i) => (
                  <div key={i} className="flex justify-center gap-3 p-2">
                    <div className="h-[100px] flex items-center">{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-x-scroll flex">
              {data?.map((tItem, inx) => (
                <div key={inx} className="mx-4 sm:mx-8">
                  <h1>Podyezd {inx + 1}</h1>
                  <div className="flex flex-col-reverse">
                    {tItem.floors.map((floor, i) => (
                      <div key={i} className="flex gap-3 py-2">
                        {floor.apartments.map((item, inx) => (
                          <div
                            onClick={() => showDetail(item.id)}
                            key={inx}
                            className={`w-[220px] h-[100px] cursor-pointer font-semibold text-sm p-2 flex flex-col ${getBackgroundColor(
                              item
                            )} rounded`}
                          >
                            <div className="flex justify-between text-white items-center">
                              <div
                                className={`w-9 h-9 
												${
                          item.status === "free"
                            ? "bg-green"
                            : item.status === "sold"
                            ? "bg-red-500"
                            : item.status === "bron"
                            ? "bg-dodgerblue"
                            : ""
                        } rounded-full flex items-center justify-center`}
                              >
                                {item.cells}x
                              </div>
                              <div className="text-black">
                                {(
                                  Number(state.mk_price) *
                                  Number(item.room_space)
                                )?.brm()}{" "}
                                so'm
                              </div>
                            </div>
                            <div className="text-black mt-1">
                              № {item.room_number}
                            </div>
                            <div className="flex mt-auto justify-between text-black items-center">
                              <div>
                                {item.room_space} m<sup>2</sup>
                              </div>
                              <div className="text-sm">
                                {state.mk_price?.brm()} so'm
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoizeSalesLayer = memo(SalesLayer);
export default MemoizeSalesLayer;
