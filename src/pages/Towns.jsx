import React, { memo, useState, useEffect } from "react";
import CreateBuilding from "../components/towns/CreateComplex";
import { styles } from "../assets/styles/styles";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import projectImage from "../assets/images/project-icon.png";
import Loading from "../examples/loading-department/LoadingDepartment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTown, getCountData } from "../functions/ProjectMethods";
import { Link } from "react-router-dom";
import { DeleteAlert } from "../examples/delete-modal/DeleteAlert";
import { FiEdit3 } from 'react-icons/fi'
import { editTown, getDistrictList, getOneTownById, getRegionList } from '../functions/ProjectMethods'
import { PatternFormat } from 'react-number-format'
import Form from "../examples/form/Form"

const updateTownState = {
  id: "",
  name: "",
  district_id: "",
  address: "",
  region_id: "",
  contact_number: "",
}

function Projects() {
  const [form, setForm] = useState(false);
  const [editForm, setEditForm] = useState(false)

  const queryClient = useQueryClient()
  const [valid, setValid] = useState(true)
  const [townData, setTownData] = useState(updateTownState)

  const [townId, setTownId] = useState(0)

  const { data: updateTowns, isLoading: updateLoading } = useQuery(["getOneTownById", townId], () => getOneTownById(townId))

  const { data, isLoading } = useQuery(["getCountData"], () =>
    getCountData()
  );
  const { data: regions } = useQuery(["getRegionList"], () =>
    getRegionList()
  );
  const { data: districts } = useQuery(["getDistrictList"], () =>
    getDistrictList()
  );


  const requiredFields = ["name", "district_id", "region_id", "contact_number", "address"];

  useEffect(() => {
    const isFormValid = requiredFields.every((field) => townData[field] !== "");
    setValid(!isFormValid);
  }, [townData, ...requiredFields]);

  useEffect(() => {
    setTownData((prev) => ({
      ...prev,
      id: updateTowns?.[0]?.id,
      name: updateTowns?.[0]?.name,
      district_id: +updateTowns?.[0]?.district_id,
      address: updateTowns?.[0]?.address,
      region_id: +updateTowns?.[0]?.region_id,
      contact_number: updateTowns?.[0]?.contact_number
    }))
  }, [updateTowns])

  const updateTown = useMutation({
    mutationFn: editTown,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCountData"] })
    }
  })

  const closeModal = () => {
    setEditForm(false)
  }

  const handleInputChange = (field, value) => {
    setTownData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateTown.mutate(townData)
      setEditForm(false)
    } catch (error) {
      console.log(error);
    }
  }

  const removeTown = useMutation({
    mutationFn: deleteTown,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCountData"] })
    }
  })

  const handleDeleteTown = async (id) => {
    try {
      await DeleteAlert("Majmua", () => removeTown.mutate(id))
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) {
    return <Loading />;
  }


  return (
    <div>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6">
        <div
          onClick={() => setForm(true)}
          className={`bg-white ${styles.shadowRounded} relative flex items-center justify-center mb-2 py-14`}
        >
          <div className={`${styles.flexColCenter} h-full gap-2`}>
            <HiOutlineBuildingOffice2 className="text-[80px] text-gray-400" />
            <h1 className="font-semibold text-sm">
              Qurilish majmuasini yaratish
            </h1>
          </div>
          <div
            className={`w-[45px] h-[45px] bg-white rounded-full absolute bottom-[-20px] ${styles.flexCenter}`}
          >
            <div
              className={`w-[80%] h-[80%] rounded-full bg-[#85cb67] ${styles.flexCenter} hover:bg-[#8bd96a] duration-200`}
            >
              <FiPlus className="text-white text-xl" />
            </div>
          </div>
        </div>

        {data ? data?.map((item) => {
          const houses = data?.filter(
            (town) => town.id === item.id
          )[0];
          const isEmpty = Number(item?.buildingCount) === 0
          return (
            <div key={item.id} className="relative h-[220px] overflow-hidden group">
              <Link
                to={`/buildings`}
                state={item}
                className={`h-[220px] bg-white ${styles.shadowRounded} xl:py-8 lg:py-6 md:py-5 py-4 flex flex-col justify-end`}
              >
                <div
                  className={`${styles.flexCenter} flex-col gap-2 relative mb-4`}
                >
                  <img src={projectImage} width={80} alt="" />
                  <p className="font-semibold xl:text-lg lg:text-md md:text-sm text-sm">
                    {item.name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 justify-center items-center border border-t-0 border-b-0 border-l-0 pr-10 border-r-primary w-1/2">
                    <p className="text-sm text-primary">
                      Binolar:
                    </p>
                    <p className="font-bold text-primary">
                      {houses?.buildingCount}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-center items-center w-1/2">
                    <p className="text-sm text-primary">
                      Xonadonlar:
                    </p>
                    <p className="font-bold text-primary">
                      {houses?.apartmentCount}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="absolute pt-2 top-0 right-[0px] w-[50px] rounded-tr-md rounded-br-md opacity-0 group-hover:opacity-100 group-hover:right-0 duration-300">
                <button onClick={() => {
                  setEditForm(true)
                  setTownId(+item.id)
                }} className="w-[35px] h-[35px] rounded-full bg-orange flex items-center justify-center">
                  <FiEdit3 className="text-white text-lg" />
                </button>
                {
                  isEmpty &&
                  <button
                    onClick={() => handleDeleteTown(item.id)}
                    className="w-[35px] h-[35px] rounded-full mt-2 bg-red-500 flex items-center justify-center"
                  >
                    <FiTrash2 className="text-white text-lg" />
                  </button>
                }
              </div>
            </div>
          );
        }) : <Loading />}
      </div>
      <div>
        <CreateBuilding form={form} closeForm={setForm} />
      </div>
      <div>
        {
          updateLoading ? <Loading /> : <Form isOpen={editForm} onClose={closeModal} isValid={valid} save={handleSubmit} title={"Majmuani yangilash"}>
            <div className="grid m-4 grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 mb-6">
                <label className="font-bold text-[13px]">
                  <span className="mr-1 text-red-600">*</span>Nomi
                </label>
                <input
                  type="text"
                  className={styles.inputUchun}
                  value={townData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <label className="font-bold text-[13px]">
                  <span className="mr-1 text-red-600">*</span>Telefon
                  raqam
                </label>
                <PatternFormat
                  className={styles.inputUchun}
                  format="+998 ## ### ## ##"
                  placeholder="+998"
                  value={townData.contact_number}
                  onChange={(e) => handleInputChange("contact_number", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <label className="font-bold text-[13px]">
                  <span className="mr-1 text-red-600">*</span>Viloyat
                </label>
                <select
                  className={`${styles.inputUchun} cursor-pointer`}
                  value={townData.region_id}
                  onChange={(e) => handleInputChange("region_id", +e.target.value)}
                >
                  <option value="" disabled>
                    Viloyatni tanlang
                  </option>
                  {regions?.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <label className="font-bold text-[13px]">
                  <span className="mr-1 text-red-600">*</span>Tuman
                </label>
                <select
                  className={`${styles.inputUchun} cursor-pointer disabled:cursor-not-allowed disabled:border-gray-300`}
                  value={townData.district_id}
                  onChange={(e) => handleInputChange("district_id", +e.target.value)}
                >
                  <option value="" disabled>
                    Tumanni tanlang
                  </option>
                  {districts?.filter(item => item.region.id === townData.region_id)?.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 mb-6 col-span-2">
                <label className="font-bold text-[13px]">
                  <span className="mr-1 text-red-600">*</span>
                  Manzil
                </label>
                <textarea
                  placeholder="Manzil"
                  className={`${styles.inputUchun} min-h-[100px] pt-2`}
                  cols="30"
                  rows="10"
                  value={townData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                ></textarea>
              </div>
              <input type="submit" className="hidden" />
            </div>
          </Form>
        }
      </div>
    </div>
  );
}

const MemoizeProject = memo(Projects);
export default MemoizeProject;
