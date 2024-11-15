import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { addImage, editApartment } from "../../../functions/ProjectMethods";
import { BiEditAlt } from "react-icons/bi";
import Form from "../../../examples/form/Form";
import { styles } from "../../../assets/styles/styles";
import { NumericFormat } from "react-number-format";
import { AiOutlineCloudUpload } from "react-icons/ai";
import LoadingDepartment from "../../../examples/loading-department/LoadingDepartment";

const apartmentState = {
  id: "",
  room_number: "",
  cells: "",
  room_space: "",
  status: "free",
  file_id: "",
  positions: "",
};

const imageState = {
  entity: "Apartments",
  record_id: "",
  file: "",
};

const UpdateFloorTable = ({
  floor,
  isLoading,
  setCustomLoading,
  customLoading,
}) => {
  const [floorEditForm, setFloorEditForm] = useState(false);
  const [apartmentData, setApartmentData] = useState(apartmentState);
  const [imageData, setImageData] = useState(imageState);
  const queryClient = useQueryClient();

  const editApartmentById = useMutation({
    mutationFn: editApartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBuildings"] });
    },
  });

  const addFile = useMutation({
    mutationFn: addImage,
    onSuccess: () => {
      setCustomLoading(false);
      queryClient.invalidateQueries({ queryKey: ["getImages"] });
    },
  });

  const handleUpdateApartment = async (e) => {
    e.preventDefault();
    try {
      let newApartment = {
        id: apartmentData.id,
        room_number: apartmentData.room_number,
        cells: +apartmentData?.cells,
        room_space: +apartmentData.room_space,
        status: apartmentData.status,
        positions: apartmentData.positions,
      };
      if (imageData.file) {
        setCustomLoading(true);
        const formData = new FormData();
        formData.append("entity", imageData.entity);
        formData.append("file", imageData.file);
        formData.append("record_id", imageData.record_id);
        await addFile.mutate(formData);
        await editApartmentById.mutate(newApartment);
      }

      await editApartmentById.mutate(newApartment);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onClose = () => {
    setApartmentData(apartmentState);
    setImageData(imageState);
    setFloorEditForm(false);
  };
  const fileChenger = (e) => {
    setImageData({ ...imageData, file: e.target.files[0] });
  };
  if (isLoading || customLoading) {
    return <LoadingDepartment />;
  }
  return (
    <div>
      <button
        onClick={() => {
          setFloorEditForm(true);
          setApartmentData(floor);
          setImageData((prev) => ({ ...prev, record_id: floor.id }));
        }}
        className={`w-[36px] h-[36px] bg-yellow-500 rounded-full ${styles.flexCenter} cursor-pointer`}
      >
        <BiEditAlt className="text-sm text-white" />
      </button>
      <Form
        isOpen={floorEditForm}
        onClose={onClose}
        save={handleUpdateApartment}
        title={"Xonadonni yangilash"}
        width={"40%"}
      >
        <div className="grid grid-cols-2 gap-4 m-4">
          <div className="flex text-center flex-col gap-2 mb-2 col-span-2">
            <label className="font-bold text-[13px]">Xonadon raqami</label>
            <p>№ {apartmentData.room_number}</p>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-left text-[13px]">
              Uydagi xonalar soni
            </label>
            <NumericFormat
              allowLeadingZeros
              thousandSeparator=""
              className={styles.inputUchun}
              value={apartmentData.cells === 0 ? "" : apartmentData.cells}
              onChange={(e) =>
                setApartmentData({ ...apartmentData, cells: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-left text-[13px]">
              Xonadon kvadrati <sup>m2</sup>
            </label>
            <NumericFormat
              allowLeadingZeros
              thousandSeparator=" "
              className={styles.inputUchun}
              value={
                apartmentData.room_space === 0 ? "" : apartmentData.room_space
              }
              onChange={(e) =>
                setApartmentData({
                  ...apartmentData,
                  room_space: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2 mb-2 col-span-2">
            <label className="font-bold text-left text-[13px]">
              Xonadon joylashuvi
            </label>
            <select
              name="position"
              className={styles.inputUchun}
              onChange={(e) =>
                setApartmentData({
                  ...apartmentData,
                  positions: e.target.value,
                })
              }
            >
              <option value="">Hech qanday</option>
              <option value="leftside">Qibla tomon</option>
              <option value="rightside">Ko'cha tomon</option>
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2 mb-2 col-span-2">
            <input
              onChange={fileChenger}
              id="rasm-yuklash-xonadon-uchun"
              name="rasm-yuklash-xonadon-uchun"
              type="file"
              title="salom"
              className=""
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UpdateFloorTable;
