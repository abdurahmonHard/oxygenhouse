import React, { useState } from "react";
import UpdateFloorTable from "./UpdateFloorTable";
import DeleteFloorTable from "./DeleteFloorTable";
import { useQuery } from "@tanstack/react-query";
import { getImage } from "../../../functions/ProjectMethods";
import LoadingDepartment from "../../../examples/loading-department/LoadingDepartment";

const FloorRow = ({ item }) => {
   const [customLoading, setCustomLoading] = useState(false)
   const { data: imageUrl, isFetching, isLoading } = useQuery(["getImages", item?.file_id], () => getImage(item?.file_id), { refetchOnWindowFocus: false })

   return (
      <>
         {isLoading || customLoading && <LoadingDepartment />}
         <tr key={item.id}>
            <td className="py-3 px-16 border-b">
               <div className=" w-[75px] h-[75px] my-0 mx-auto rounded-sm">
                  {
                     !isFetching && <img
                        src={imageUrl?.error ? 'https://wpmedia.roomsketcher.com/content/uploads/2022/01/06124754/Best-laid-floor-plans-3D-Floor-Plan-2.jpg' : imageUrl}
                        alt=""
                        className="w-full h-full object-cover rounded-sm"
                     />
                  }
               </div>
            </td>
            <td className="py-3 px-16 border-b">
               {item.room_number}
            </td>
            <td className="py-3 px-16 border-b">
               {item.cells}
            </td>
            <td className="py-3 px-16 border-b">
               {item.room_space}
            </td>
            <td className={`py-3 px-16 border-b`}>
               <div
                  className={`text-white py-1 px-3 rounded-sm ${item.status === "free"
                     ? "bg-green"
                     : item.status === "bron"
                        ? "bg-orange"
                        : item.status === "sold"
                           ? "bg-dodgerblue"
                           : "bg-unavailable"
                     }`}
               >
                  {item.status === "free"
                     ? "Bo'sh"
                     : item.status === "bron"
                        ? "Band"
                        : item.status === "sold"
                           ? "Sotilgan"
                           : "Aktiv emas"}
               </div>
            </td>
            <td className="py-3 px-4 border-b">
               <div className="flex justify-center gap-4">
                  <UpdateFloorTable isLoading={isFetching} floor={item} setCustomLoading={setCustomLoading} customLoading={customLoading} />
                  <DeleteFloorTable item={item} />
               </div>
            </td>
         </tr>
      </>
   )
}

const FloorTable = ({ room, selectRoom }) => {
  return (
    <div>
      {selectRoom[room.id] && (
        <div className="bg-gray-100 overflow-x-auto border border-t-0 rounded-md rounded-t-none px-3 py-2">
          <table className="border w-full text-center whitespace-nowrap bg-white">
            <thead>
              <tr className="border-b">
                <th scope="col" className="py-3 px-16 font-semibold text-sm">
                  xonadon rasmi
                </th>
                <th scope="col" className="py-3 px-16 font-semibold text-sm">
                  xonadon raqami
                </th>
                <th scope="col" className="py-3 px-16 font-semibold text-sm">
                  xonalar soni
                </th>
                <th scope="col" className="py-3 px-16 font-semibold text-sm">
                  maydoni, m<sup>2</sup>
                </th>
                <th scope="col" className="py-3 px-16 font-semibold text-sm">
                  holat
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-sm">
                  sozlamalar
                </th>
              </tr>
            </thead>
            <tbody>
              {selectRoom[room.id] &&
                room?.apartments?.map((item) => (
                  <FloorRow key={item.id} item={item} />
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FloorTable;
