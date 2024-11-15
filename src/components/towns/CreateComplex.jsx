/* eslint-disable react/prop-types */
import React, { memo, useState, useEffect, useCallback } from "react";
import Form from "../../examples/form/Form";
import { PatternFormat } from "react-number-format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDistrictList,
  getRegionList,
  postProject,
} from "../../functions/ProjectMethods";
import { styles } from "../../assets/styles/styles";

const townState = {
  name: "",
  district_id: "",
  address: "",
  region_id: "",
  contact_number: "",
}

function CreateBuilding({ form, closeForm }) {
  const [townData, setTownData] = useState(townState)
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  const [isValid, setIsValid] = useState(true);

  const { data: regions } = useQuery(["getRegionList"], () =>
    getRegionList()
  );

  const { data: districts } = useQuery(["getDistrictList"], () =>
    getDistrictList()
  );

  const requiredFields = ["name", "district_id", "region_id", "contact_number", "address"];

  useEffect(() => {
    const isFormValid = requiredFields.every((field) => townData[field] !== "");
    setIsValid(!isFormValid);
  }, [townData, ...requiredFields]);

  useEffect(() => {
    if (districts && townData.region_id) {
      setFilteredDistricts(
        districts.filter((i) => i.region.id === +townData.region_id)
      );
    }
  }, [townData.district_id, townData.region_id]);

  const queryClient = useQueryClient();
  const addProject = useMutation({
    mutationFn: postProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCountData"] });
    },
  });

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    let newTown = {
      name: townData.name,
      district_id: +townData.district_id,
      address: townData.address,
      region_id: +townData.region_id,
      contact_number: townData.contact_number,
    }
    await addProject.mutate(newTown);
    closeForm(false);
    setTownData(townState)
  }, [townData]);

  const onClose = useCallback(() => {
    closeForm(false)
    setTownData(townState)
  }, [])

  return (
    <div>
      <Form
        isOpen={form}
        onClose={onClose}
        title={"Majmua yaratish"}
        save={handleSubmit}
        isValid={isValid}
      >
        <div className="grid m-4 xl:grid-cols-2 grid-cols-1 gap-4">
          <div className="flex flex-col gap-2 mb-6">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>Nomi
            </label>
            <input
              type="text"
              className={styles.inputUchun}
              value={townData.name}
              onChange={(e) => setTownData(({ ...townData, name: e.target.value }))}
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
              onChange={(e) => setTownData(({ ...townData, contact_number: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2 mb-6">
            <label className="font-bold text-[13px]">
              <span className="mr-1 text-red-600">*</span>Viloyat
            </label>
            <select
              className={`${styles.inputUchun} cursor-pointer`}
              value={townData.region_id}
              onChange={(e) => setTownData(({ ...townData, region_id: e.target.value }))}
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
              onChange={(e) => setTownData(({ ...townData, district_id: e.target.value }))}
              disabled={!townData.region_id.length}
            >
              <option value="" disabled>
                Tumanni tanlang
              </option>
              {filteredDistricts.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 mb-6 xl:col-span-2 col-span-1">
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
              onChange={(e) => setTownData(({ ...townData, address: e.target.value }))}
            ></textarea>
          </div>
          <input type="submit" className="hidden" />
        </div>
      </Form>
    </div>
  );
}

const MemoizeCreateBuilding = memo(CreateBuilding);
export default MemoizeCreateBuilding;
