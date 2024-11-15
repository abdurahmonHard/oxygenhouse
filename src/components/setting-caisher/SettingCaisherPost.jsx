import React, { useCallback, useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import Form from "../../examples/form/Form"
import { styles } from "../../assets/styles/styles"
import { postCaisher } from "../../functions/CaisherMethods"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCountData } from "../../functions/ProjectMethods"

const caisherState = {
  caisher_name: "",
  is_active: "",
  town_id: ""
}

const SettingCaisherPost = () => {
  const [caisherData, setCaisherData] = useState(caisherState)
  const { data } = useQuery(["getCountData"], () =>
    getCountData()
  );

  const [open, setOpen] = useState(false)
  const [valid, setValid] = useState(true)
  const queryClient = useQueryClient()

  const addCashier = useMutation({
    mutationFn: postCaisher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCaisher"] })
    }
  })

  const requiredFields = ["caisher_name", "is_active", "town_id"];

  useEffect(() => {
    const isFormValid = requiredFields.every((field) => caisherData[field] !== "");
    setValid(!isFormValid);
  }, [caisherData, ...requiredFields]);

  const handleCreate = async (e) => {
    e.preventDefault()

    await addCashier.mutate(caisherData)
    setOpen(false)
    setCaisherData(caisherState)
  }

  function convertToBoolean(value) {
    return value === "true";
  }

  const handleClose = () => {
    setOpen(false)
    setCaisherData(caisherState)
  }

  return (
    <div>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 bg-green py-1 px-3 text-white rounded-sm">
        <FiPlus />
        <p>Yaratish</p>
      </button>
      <Form isOpen={open} onClose={handleClose} save={handleCreate} title={"Kassa yaratish"} isValid={valid}>
        <div className='grid grid-cols-1 gap-3 m-4'>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="first_name">
              <span className="mr-1 text-red-600">*</span>Kassa nomi
            </label>
            <input
              type="text"
              className={`${styles.inputUchun}`}
              value={caisherData.caisher_name}
              onChange={(e) => setCaisherData({ ...caisherData, caisher_name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="first_name">
              <span className="mr-1 text-red-600">*</span>Statusi
            </label>
            <select
              className={`${styles.inputUchun}`}
              value={caisherData.is_active}
              onChange={(e) => setCaisherData({ ...caisherData, is_active: convertToBoolean(e.target.value) })}
            >
              <option value="" disabled>Tanlang</option>
              <option value="true">Faol</option>
              <option value="false">Faol Emas</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-bold text-[13px]" htmlFor="first_name">
              <span className="mr-1 text-red-600">*</span>Filial
            </label>
            <select
              className={`${styles.inputUchun}`}
              value={caisherData.town_id}
              onChange={(e) => setCaisherData({ ...caisherData, town_id: e.target.value })}
            >
              <option value="" disabled>Tanlang</option>
              {
                data?.map(item => (
                  <option key={item?.id} value={item?.id}>{item?.name}</option>
                ))
              }
            </select>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default SettingCaisherPost