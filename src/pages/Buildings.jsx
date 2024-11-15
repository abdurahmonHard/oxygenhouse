import React, { useState, memo, useEffect, useCallback } from "react";
import CreateBuilding from "../components/buildings/CreateBuilding";
import { useLocation } from "react-router";
import { FiEdit3, FiPlus, FiTrash2 } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteBuilding,
  editBuilding,
  getAllBuildings,
  getBuildingById,
  getImage,
} from "../functions/ProjectMethods";
import Form from "../examples/form/Form";
import { styles } from "../assets/styles/styles";
import { NumericFormat } from "react-number-format";
import { DeleteAlert } from "../examples/delete-modal/DeleteAlert";
import Loading from "../examples/loading-department/LoadingDepartment";
import { Link } from "react-router-dom";

const buildingState = {
  name: "",
  entrance_number: "",
  floor_number: "",
  apartment_number: "",
  town_id: "",
  mk_price: "",
};

const requiredFields = [
  "name",
  "entrance_number",
  "floor_number",
  "apartment_number",
  "town_id",
  "mk_price",
];

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
      <Link
        to={`/buildings/details/${item.id}`}
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
    </>
  );
};

const Buildings = () => {
  const [show, setShow] = useState(false);
  const { state } = useLocation();
  const [buildingData, setBuildingData] = useState(buildingState);

  const [bForm, setBForm] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery(["getBuildingById"], () =>
    getBuildingById(state.id)
  );
  const { data: singleBuilding } = useQuery(["getBuildingById", 0], () =>
    getAllBuildings(0)
  );

  const editbuilding = useMutation({
    mutationFn: editBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getBuildingById"] });
    },
  });

  const removeBuilding = useMutation({
    mutationFn: deleteBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getBuildingById"] });
    },
  });

  useEffect(() => {
    const isFormValid = requiredFields.every(
      (field) => buildingData[field] !== ""
    );
    setIsValid(!isFormValid);
  }, [buildingData]);

  const handleEditBuilding = useCallback(
    async (e) => {
      e.preventDefault();
      await editbuilding.mutate(buildingData);
      setBForm(false);
      setBuildingData(buildingState);
    },
    [buildingData, editbuilding]
  );

  const handleClose = useCallback(() => {
    setBForm(false);
    setBuildingData(buildingState);
  }, []);

  const handleRemoveBuilding = useCallback(
    async (id) => {
      try {
        await DeleteAlert("Bino", () => removeBuilding.mutate(id));
      } catch (error) {
        console.log(error);
      }
    },
    [removeBuilding]
  );

  return (
    <>
      <div>
        {isLoading || isFetching && <Loading />}
        <div className="flex md:flex-row sx:flex-col sx:gap-6 justify-between pr-4 mb-6">
          <h2 className="text-xl font-semibold sx:text-sm">Binolar ro'yxati</h2>
          <button
            onClick={() => setShow(true)}
            className="flex gap-1 items-center border border-primary py-[6px] px-2 rounded-sm bg-gray-100 text-primary hover:bg-primary hover:text-white duration-150 sx:justify-center"
          >
            <FiPlus />
            <p className="font-semibold text-sm">Bino qo'shish</p>
          </button>
        </div>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
          {data ? (
            data?.map((item) => {
              const isEmpty = singleBuilding?.filter(s => s.id === item.id)?.[0]?.entrances?.length <= 0

              return (
                <div className="relative overflow-hidden group" key={item.id}>
                  <BuildingContainer item={item} />
                  <div
                    className={`w-[50px] h-full absolute py-8 flex flex-col top-0 bg-[#bbb] -right-[60px] rounded-tr-md rounded-br-md ${isEmpty ? "justify-between" : "justify-center"
                      } group-hover:right-0 duration-200`}
                  >
                    <button
                      onClick={() => {
                        setBuildingData(item);
                        setBForm(true);
                      }}
                      className="w-full h-[60px] flex items-center justify-center"
                    >
                      <FiEdit3 className="text-white text-xl" />
                    </button>
                    {isEmpty && (
                      <button
                        onClick={() => handleRemoveBuilding(item.id)}
                        className="w-full h-[60px] flex items-center justify-center"
                      >
                        <FiTrash2 className="text-white text-xl" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <Loading />
          )}
        </div>
      </div>
      <div>
        <CreateBuilding show={show} setShow={setShow} />
      </div>
      <Form
        isOpen={bForm}
        onClose={handleClose}
        save={handleEditBuilding}
        title={"Binoni yangilash"}
        isValid={isValid}
      >
        <div className="grid grid-cols-2 gap-6 m-4">
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              Nomi
            </label>
            <input
              type="text"
              className={styles.inputUchun}
              required
              value={buildingData.name}
              onChange={(e) =>
                setBuildingData({ ...buildingData, name: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              Podyezd soni
            </label>
            <NumericFormat
              allowLeadingZeros
              thousandSeparator=" "
              className={`${styles.inputUchun} disabled:border-gray-300 disabled:bg-transparent cursor-not-allowed`}
              value={buildingData.entrance_number === 0 ? "" : buildingData.entrance_number}
              disabled={buildingData.entrance_number !== ""}
              onValueChange={({ value }) =>
                setBuildingData({
                  ...buildingData,
                  entrance_number: value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              Qavat soni
            </label>
            <NumericFormat
              allowLeadingZeros
              thousandSeparator=" "
              className={`${styles.inputUchun} disabled:border-gray-300 disabled:bg-transparent cursor-not-allowed`}
              disabled={buildingData.floor_number !== ""}
              value={buildingData.floor_number === 0 ? "" : buildingData.floor_number}
              onValueChange={({ value }) =>
                setBuildingData({
                  ...buildingData,
                  floor_number: value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              Qavatdagi xonadonlar soni
            </label>
            <NumericFormat
              allowLeadingZeros
              thousandSeparator=" "
              className={`${styles.inputUchun} disabled:border-gray-300 disabled:bg-transparent cursor-not-allowed`}
              value={buildingData.apartment_number === 0 ? "" : buildingData.apartment_number}
              disabled={buildingData.apartment_number !== ""}
              onValueChange={({ value }) =>
                setBuildingData({
                  ...buildingData,
                  apartment_number: value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>Obyekt
            </label>
            <select
              onChange={(e) =>
                setBuildingData({
                  ...buildingData,
                  town_id: e.target.value,
                })
              }
              className={`${styles.inputUchun} cursor-not-allowed disabled:border-gray-300 disabled:bg-transparent`}
              disabled={buildingData.town_id !== ""}
            >
              {state.id && <option value={state.id}>{state.name}</option>}
            </select>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>Uy Kvadrat narxi
            </label>
            <NumericFormat
              allowLeadingZeros
              thousandSeparator=" "
              className={`${styles.inputUchun} disabled:border-gray-300 disabled:bg-transparent`}
              value={buildingData.mk_price === 0 ? "" : buildingData.mk_price}
              onValueChange={({ value }) =>
                setBuildingData({
                  ...buildingData,
                  mk_price: value,
                })
              }
            />
          </div>
          <input type="submit" className="hidden" />
        </div>
      </Form>
    </>
  );
};

const MemoizeBuilding = memo(Buildings);
export default MemoizeBuilding;
