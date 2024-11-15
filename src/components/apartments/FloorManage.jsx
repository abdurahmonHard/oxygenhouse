/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import React, { memo, useEffect, useState } from "react";
import Form from "../../examples/form/Form";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import { SlClose } from "react-icons/sl";
import { styles } from "../../assets/styles/styles";
import { FiChevronRight } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApartment, deleteFloors } from "../../functions/ProjectMethods";
import FloorTable from "./floor/FloorTable";
import { DeleteAlert } from "../../examples/delete-modal/DeleteAlert";
import { NumericFormat } from "react-number-format";
import Loading from "../../examples/loading/Loading";

const apartmentState = {
  cells: "",
  room_space: "",
  status: "free",
};

const FloorManage = ({ floors }) => {
  const [apartmentData, setApartmentData] = useState(apartmentState);

  const queryClient = useQueryClient();
  const [roomIndex, setRoomIndex] = useState(null);
  const [selectRoom, setSelectRoom] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const requiredFields = ["cells", "room_space"];

  useEffect(() => {
    const isFormValid = requiredFields.every((field) => apartmentData[field] !== "");
    setIsValid(!isFormValid);
  }, [apartmentData, ...requiredFields]);

  const handleRowSelection = (id) => {
    setSelectRoom((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  // xona yaratish uchun react query dan foydalanilgan
  const postApartment = useMutation({
    mutationFn: createApartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBuildings"] });
    },
  });

  // qavat o'chirish uchun react query dan foydalanilgan
  const removeFloor = useMutation({
    mutationFn: deleteFloors,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBuildings"] });
    },
  });

  // xona yaratish kodi
  const handleCreateApartment = async (event) => {
    event.preventDefault();
    try {
      const newApartment = {
        id: roomIndex,
        cells: +apartmentData.cells,
        room_space: +apartmentData.room_space,
        status: apartmentData.status,
      };
      await postApartment.mutate(newApartment);
      setApartmentData(apartmentState);
      setOpenForm(false);
    } catch (error) {
      console.log(error);
    }
  }

  const onClose = () => {
    setOpenForm(false);
    setApartmentData(apartmentState);
  }

  // qavat o'chirish kodi
  const handleDeleteFloor = async (item) => {
    try {
      await DeleteAlert(`${item.floor_number} Qavatni`, () => removeFloor.mutate(item.id))
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="mt-2">
        <div className="w-full flex flex-col-reverse gap-4 mt-2 p-4">
          <div className="flex flex-col-reverse gap-4">
            {/* blok ichidagi qavatlarni map langan */}
            {floors ? floors?.map((ent) =>
              ent.floors.map((room) => (
                <div key={room.id} className="relative">
                  <div
                    className={` ${selectRoom[room.id]
                      ? "border border-b-0 rounded-md rounded-b-none bg-gray-100"
                      : "border rounded-md bg-gray-100"
                      } w-full flex items-center justify-between min-h-[45px] px-3 py-2 cursor-pointer text-start select-none`}
                    onClick={() => {
                      handleRowSelection(room.id);
                    }}
                  >
                    <div className={`${styles.flexCenter}`}>
                      <p className="sx:text-sm">Qavat {room.floor_number}</p>
                      {selectRoom[room.id] ? (
                        <FiChevronDown className="duration-200" />
                      ) : (
                        <FiChevronRight className="duration-200" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`${styles.flexCenter} absolute right-2 top-2 gap-3`}
                  >
                    <button
                      className={`${styles.flexCenter} gap-1 bg-green hover:opacity-80 text-white py-1.5 rounded-full px-2 duration-150`}
                      onClick={() => {
                        setOpenForm(true);
                        setRoomIndex(room.id);
                      }}
                    >
                      <FiPlus />
                      <p className="text-[12px] font-medium">
                        Xonadon qo&apos;shish
                      </p>
                    </button>
                    {!room.apartments.length && (
                      <button className="cursor-none">
                        <SlClose
                          onClick={() =>
                            handleDeleteFloor(
                              room
                            )
                          }
                          className={`text-red-600 text-xl cursor-pointer`}
                        />
                      </button>
                    )}
                  </div>
                  {/* xonalarni table ko'rinishida maplangan */}
                  <FloorTable
                    room={room}
                    selectRoom={selectRoom}
                  />
                </div>
              ))
            ) : <Loading />}
          </div>
        </div>
        {/* qavat yaratish uchun Form foydalanilgan */}
        <Form
          save={handleCreateApartment}
          isOpen={openForm}
          onClose={onClose}
          title={"Xonadon Yaratish"}
          width={"40%"}
          isValid={isValid}
        >
          <div className="flex flex-col gap-4 m-4">
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>
                Uydagi xonalar soni
              </label>
              <NumericFormat
                allowLeadingZeros
                thousandSeparator=" "
                className={styles.inputUchun}
                value={apartmentData.cells === 0 ? "" : apartmentData.cells}
                onValueChange={({ value }) =>
                  setApartmentData({
                    ...apartmentData,
                    cells: value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <label className="font-bold text-[13px]">
                <span className="mr-1 text-red-600">*</span>Xonadon
                kvadrati <sup>m2</sup>
              </label>
              <NumericFormat
                allowLeadingZeros
                thousandSeparator=" "
                className={styles.inputUchun}
                value={apartmentData.room_space === 0 ? "" : apartmentData.room_space}
                onValueChange={({ value }) =>
                  setApartmentData({
                    ...apartmentData,
                    room_space: value,
                  })
                }
              />
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

const MemoizeEntranceCreate = memo(FloorManage);
export default MemoizeEntranceCreate;
