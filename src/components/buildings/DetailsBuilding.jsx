import React, { memo, useEffect, useState } from "react";
import { useLocation } from "react-router";
import apartmentsImage from "../../assets/images/apartments.png";
import { Link } from "react-router-dom";
import { styles } from "../../assets/styles/styles";
import { format } from "date-fns";
import { AiOutlineCloudUpload } from "react-icons/ai"
import { PiImageThin } from "react-icons/pi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addImage, getAllBuildings, getImage } from "../../functions/ProjectMethods";
import Loading from "../../examples/loading-department/LoadingDepartment"
import { getLastCurrency } from "../../functions/UserMethodes"

const DetailsBuilding = () => {
  const { state } = useLocation();
  const { data } = useQuery(["getBuildingById", state.id], () =>
    getAllBuildings(state.id)
  );

  const [imageId, setImageId] = useState(state.file_id)
  const [isSubmit, setIsSubmit] = useState(false)
  const { data: dollar } = useQuery(["getLastCurrency"], () => getLastCurrency());


  const queryClient = useQueryClient()
  const { data: image, isLoading } = useQuery(
    ["getImage", imageId],
    () => getImage(imageId),
    {
      // enabled: !!imageId, 
      refetchOnWindowFocus: false
    }
  )


  const [detailsData, setDetailsData] = useState({
    entity: "Buildings",
    record_id: state.id,
    file: null
  })


  const addFile = useMutation({
    mutationFn: addImage,
    onSuccess: (response) => {
      setImageId(response.id)
      console.log(response.id);
      queryClient.invalidateQueries({ queryKey: ["getBuildingById"] })
    }
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setIsSubmit(true)
    setDetailsData(prevDetailsData => ({ ...prevDetailsData, file }));
  }

  const handleSubmit = async () => {
    setIsSubmit(true);
    try {
      const formData = new FormData();
      formData.append('file', detailsData.file);
      formData.append("entity", detailsData.entity)
      formData.append("record_id", detailsData.record_id)

      await addFile.mutate(formData)

      setIsSubmit(false);
    } catch (error) {
      console.log(error);
      setIsSubmit(false);
    }
  }

  // const handleSubmit = async () => {
  //    addFile.isLoading ? setIsSubmit(true) : setIsSubmit(false)
  //    try {
  //       const formData = new FormData();
  //       formData.append('file', detailsData.file);
  //       formData.append("entity", detailsData.entity)
  //       formData.append("record_id", detailsData.record_id)
  //       formData.append("image_id", detailsData.image_id)
  //       await addFile.mutate(formData)
  //    } catch (error) {
  //       console.log(error);
  //    }
  // }

  const formattedDate = (value) => {
    return format(new Date(value), "yyyy-MM-dd");
  }

  return (
    <div>
      {isLoading && <Loading />}
      <div className="border-b-2 border-gray-200 pb-5">
        <Link
          to={"/apartments"}
          state={state}
          className="w-[300px] sx:w-full h-[180px]  bg-white shadow-sm rounded-md cursor-pointer flex flex-col items-center justify-center"
        >
          <img width={80} src={apartmentsImage} alt="" />
          <p className="font-medium text-xl sx:text-[16px] mt-2 text-gray-500">
            Uylar
          </p>
        </Link>
      </div>
      <div className="w-full min-h-[600px] flex md:flex-row sx:flex-col-reverse justify-between sx:items-center rounded-md bg-white mt-4">
        <div className="p-6 flex flex-col justify-evenly w-1/2 sx:w-full sx:gap-5 sx:text-[13px]">
          <div className="border-b pb-4">
            <h1 className="font-bold">Bino haqida ma&apos;lumot</h1>
          </div>
          <div className={`${styles.flexBetween} p-3 rounded-sm bg-gray-200`}>
            <p className="font-semibold">Nomi:</p>
            <p>{state?.name}</p>
          </div>
          {/* <div className={`${styles.flexBetween} p-3 rounded-sm bg-gray-200`}>
            <p className="font-semibold">Qavatdagi xonadonlar soni:</p>
            <p>{data?.entrances?.map(e => e.floors)?.[0]?.map(f => f.apartments)?.[0]?.length}</p>
          </div> */}
          <div className={`${styles.flexBetween} p-3 rounded-sm bg-gray-200`}>
            <p className="font-semibold">Yaratilgan sana:</p>
            <p>{formattedDate(state?.created_at)}</p>
          </div>
          {/* <div className={`${styles.flexBetween} p-3 rounded-sm bg-gray-200`}>
            <p className="font-semibold">Yangilangan sana:</p>
            <p>{formattedDate(state?.updated_at)}</p>
          </div> */}
          <div className={`${styles.flexBetween} p-3 rounded-sm bg-gray-200`}>
            <p className="font-semibold">Binodagi podyezd soni:</p>
            <p>{data?.entrances?.length}</p>
          </div>
          <div className={`${styles.flexBetween} p-3 rounded-sm bg-gray-200`}>
            <p className="font-semibold">Binodagi qavatlar soni:</p>
            <p>{data?.entrances?.map(e => e.floors)?.[0]?.length}</p>
          </div>
          <div className={`${styles.flexBetween} p-3 rounded-sm bg-gray-200`}>
            <p className="font-semibold">Binoning kvadrat narxi so'm / $:</p>
            <div className="flex gap-2">
              <p>{state?.mk_price?.brm()} so&apos;m / </p>
              <p className="text-[#85bb65]">{Number(state?.mk_price / dollar?.rate_value)?.brm()} $</p>
            </div>
          </div>
        </div>
        <div
          className={`border-l sx:border-l-0 flex flex-col sx:gap-6 items-center justify-between py-16 sx:py-4 w-1/2 sx:w-[90%]`}
        >
          <div className="sx:w-full">
            <div
              className={`rounded-lg w-[500px] sx:w-full h-[350px] sx:h-[300px] ${styles.flexCenter}`}>
              {
                image ?
                  <img
                    src={detailsData.file ? detailsData.file && URL.createObjectURL(detailsData.file) : image}
                    alt="" className="w-full h-full object-cover rounded-lg" /> :
                  <PiImageThin className="text-[200px] text-gray-300" />
              }
            </div>
          </div>
          <div className="flex gap-4">
            {addFile.isLoading && <Loading />}
            <label htmlFor="file-upload"
              className={`${addFile.isLoading ? "cursor-not-allowed" : "cursor-pointer"} ${styles.flexCenter} rounded-md px-4 py-1 sx:py-1.5 bg-green text-white ${isLoading ? "opacity-70" : "opacity-100"}`}>
              <div
                className="relative rounded-md font-semibold text-white focus-within:outline-none"
              >
                <span className={`${styles.flexCenter} gap-1 sx:text-sm`}>
                  <AiOutlineCloudUpload className="text-lg" />
                  Rasm yangilash
                </span>
                <input disabled={isLoading} id="file-upload" onChange={handleImageChange}
                  name="file-upload" type="file" className="sr-only" />
              </div>
            </label>
            {
              isSubmit && <button disabled={addFile.isLoading} onClick={handleSubmit}
                className={`cursor-pointer z-10 ${styles.flexCenter} rounded-md px-4 py-1 bg-green text-white disabled:cursor-not-allowed disabled:opacity-70`}>{addFile.isLoading ? "Yuborilmoqda" : "Jo'natish"}</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoizeDetailsBuilding = memo(DetailsBuilding);
export default MemoizeDetailsBuilding;
