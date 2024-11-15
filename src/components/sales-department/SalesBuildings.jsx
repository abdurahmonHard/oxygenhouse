import { useQuery } from "@tanstack/react-query";
import React, { memo } from "react";
import { useLocation } from "react-router";
import { getBuildingById, getImage } from "../../functions/ProjectMethods";
import { Link } from "react-router-dom";
import Loading from "../../examples/loading-department/LoadingDepartment";
import LoadingDepartment from "../../examples/loading-department/LoadingDepartment";

const BuildingContainer = ({ item }) => {
   const file_id = item.file_id;

   const { data: image, isLoading: imageLoading } = useQuery(
      ["getImage", file_id],
      () => getImage(file_id),
      {
         // enabled: !!file_id, // file_id mavjud bo'lsa so'rovni ishga tushirish
         refetchOnWindowFocus: false,
      }
   );

   return (
      <>
         {imageLoading && <Loading />}
         {item?.id &&
            <Link
               to={`/sales-department/details/type/${item.id}`}
               state={item}
               {...(image
                  ? { style: { background: `url(${image}) no-repeat center/cover` } }
                  : "")}
               className={`h-[200px] bg-[#999] cursor-pointer rounded-md flex flex-col justify-center`}
            >
               <div className="flex justify-center">
                  <img src={item?.image_link} alt="" />
                  <h2 className="text-xl text-white">{item.name}</h2>
               </div>
            </Link>
         }
      </>
   );
};

const SalesBuildings = () => {
   const { state } = useLocation();
   const { data, isFetching } = useQuery(["getBuildingById"], () =>
      getBuildingById(state.id)
   );
   return (
      <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 pr-4">
         {data && data?.length ? data?.map((item) => (
            <div
               className="relative overflow-hidden building-manage-link"
               key={item.id}
            >{
               isFetching && <LoadingDepartment />

               }
               {!isFetching && <BuildingContainer item={item} />}
            </div>
         )) : <Loading />}
      </div>
   );
};

const MemoizeSalesBuildings = memo(SalesBuildings);
export default MemoizeSalesBuildings;
