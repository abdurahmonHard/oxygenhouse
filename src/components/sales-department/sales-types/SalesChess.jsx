import React, { memo, useState } from "react";
import "./ProjectSale.css";

const SalesChess = ({ data, showDetail }) => {
  const [max, setMax] = useState([]);
  data?.forEach((item) =>
    max.length < item.floors.length ? setMax(item.floors) : null
  );
  const getBackgroundColor = (item) => {
    let gradient = "";
    if (item.status === "free") {
      gradient =
        item.positions === "leftside"
          ? "from-orange from-50% to-green to-50%"
          : item.positions === "rightside"
          ? "from-green from-50% to-black to-50%"
          : "bg-green";
    } else if (item.status === "sold") {
      gradient =
        item.positions === "leftside"
          ? "from-orange from-50% to-red-500 to-50%"
          : item.positions === "rightside"
          ? "from-red-500 from-50% to-black to-50%"
          : "bg-red-500";
    } else if (item.status === "bron") {
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
    <div>
      <div className="mt-10">
        <div className="flex flex-col">
          <div className="flex gap-3 sm:gap-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-sm text-start">Qavatlar</h1>
              <div className="flex flex-col-reverse">
                {max?.map((_, i) => (
                  <div key={i} className="flex gap-2 py-2 justify-center">
                    <div className="h-9 flex items-center">{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-5 sm:gap-10 overflow-x-scroll">
              {data?.map((tItem, inx) => (
                <div key={inx}>
                  <h1>Podyezd {inx + 1}</h1>
                  <div className="flex flex-col-reverse">
                    {tItem.floors.map((floor, i) => (
                      <div key={i} className="flex gap-2 py-2">
                        {floor.apartments.map((item, inx) => (
                          <div
                            onClick={() => showDetail(item.id)}
                            key={inx}
                            className={`w-9 cursor-pointer text-white flex items-center justify-center ${getBackgroundColor(
                              item
                            )} h-9 rounded-sm`}
                          >
                            {item.cells}
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

const MemoizeSalesChess = memo(SalesChess);
export default MemoizeSalesChess;
