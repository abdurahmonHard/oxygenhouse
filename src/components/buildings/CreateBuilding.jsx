/* eslint-disable react/prop-types */
import React, { memo, useCallback, useEffect, useState } from "react";
import { styles } from "../../assets/styles/styles";
import { useLocation } from "react-router-dom";
import Form from "../../examples/form/Form";
import { postBuilding } from "../../functions/ProjectMethods";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NumericFormat } from "react-number-format";

const initialState = {
  name: "",
  entrance_number: "",
  floor_number: "",
  apartment_number: "",
  town_id: "",
  mk_price: "",
};

const CreateBuilding = ({ show, setShow }) => {
  const { state } = useLocation();
  const [buildingData, setBuildingData] = useState(initialState);
  const [isValid, setIsValid] = useState(true);

  const requiredFields = ["name", "entrance_number", "floor_number", "apartment_number", "mk_price"];

  useEffect(() => {
    const isFormValid = requiredFields.every((field) => buildingData[field] !== "");
    setIsValid(!isFormValid);
  }, [buildingData, ...requiredFields]);

  useEffect(() => {
    setBuildingData((prev) => ({
      ...prev,
      town_id: state.id
    }))
  }, [state])

  const queryClient = useQueryClient();
  const addBuilding = useMutation({
    mutationFn: postBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getBuildingById"] });
    },
  });

  const handleCreateBuilding = async (e) => {
    e.preventDefault();
    try {
      const newBuilding = {
        name: buildingData.name,
        entrance_number: +buildingData.entrance_number,
        floor_number: +buildingData.floor_number,
        apartment_number: +buildingData.apartment_number,
        town_id: +buildingData.town_id,
        mk_price: +buildingData.mk_price,
      }
      await addBuilding.mutate(newBuilding);
      setShow(false);
      setBuildingData(initialState);
    } catch (error) {
      console.log(error);
    }
  }

  const onClose = () => {
    setShow(false);
    setBuildingData(initialState);
  }

  return (
    <div>
      <Form
        isOpen={show}
        onClose={onClose}
        title={"Bino yaratish"}
        save={handleCreateBuilding}
        isValid={isValid}
      >
        <div className="grid m-4 xl:grid-cols-2 grid-cols-1 gap-6">
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>
              Nomi
            </label>
            <input
              type="text"
              className={styles.inputUchun}
              value={buildingData.name}
              onChange={(e) =>
                setBuildingData({
                  ...buildingData,
                  name: e.target.value,
                })
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
              className={styles.inputUchun}
              value={buildingData.entrance_number === 0 ? "" : buildingData.entrance_number}
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
              className={styles.inputUchun}
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
              className={styles.inputUchun}
              value={buildingData.apartment_number === 0 ? "" : buildingData.apartment_number}
              onValueChange={({ value }) =>
                setBuildingData({
                  ...buildingData,
                  apartment_number: value,
                })
              }
            />
          </div>
          {/* <div className="flex flex-col gap-2 mb-2">
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
                     className={`${styles.inputUchun} cursor-not-allowed`}
                     value={buildingData.town_id}
                     defaultValue={buildingData.town_id}
                     disabled
                  >
                     {state.id && (
                        <option value={state.id}>{state.name}</option>
                     )}
                  </select>
               </div> */}
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>Uy
              Kvadrat narxi so'mda
            </label>
            <NumericFormat
              allowLeadingZeros
              thousandSeparator=" "
              className={styles.inputUchun}
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
    </div>
  );
};

const MemoizeCreateBuildnig = memo(CreateBuilding);
export default MemoizeCreateBuildnig;
