import React, { useState } from 'react'
import { BiEditAlt } from "react-icons/bi"
import Form from "../../examples/form/Form"
import { styles } from '../../assets/styles/styles'
import { updateCaisher } from "../../functions/CaisherMethods"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCountData } from '../../functions/ProjectMethods'

const SettingCaisherUpdate = ({ object }) => {
   const [updatedData, setUpdatedData] = useState({
      id: object.id,
      caisher_name: object.caisher_name,
      is_active: object.is_active,
      town_id: object.towns.id
   })

   const [open, setOpen] = useState(false)
   const { data } = useQuery(["getCountData"], () =>
      getCountData()
   );

   const queryClient = useQueryClient()
   const editCaisher = useMutation({
      mutationFn: updateCaisher,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["getCaisher"] })
      }
   })

   const handleClose = () => {
      setOpen(false)
   }

   function convertToBoolean(value) {
      return value === "true";
   }

   const handleUpdate = async (e) => {
      e.preventDefault()
      // console.log(updatedData);
      await editCaisher.mutate(updatedData)
      setOpen(false)
   }

   return (
      <div>
         <div className="flex">
            <div>
               <button
                  onClick={() => setOpen(true)}
                  className={`w-[30px] h-[30px] bg-yellow-500 rounded-full inline-flex items-center justify-center cursor-pointer`}
               >
                  <BiEditAlt className="text-sm text-white" />
               </button>
            </div>
         </div>
         <Form isOpen={open} onClose={handleClose} save={handleUpdate} title={"Kassa yaratish"} width={"25%"}>
            <div className='grid grid-cols-1 gap-3 text-left m-4'>
               <div className="flex flex-col gap-2 mb-2">
                  <label className="font-bold text-[13px]" htmlFor="first_name">
                     <span className="mr-1 text-red-600">*</span>Kassa nomi
                  </label>
                  <input
                     type="text"
                     className={`${styles.inputUchun}`}
                     value={updatedData?.caisher_name}
                     onChange={(e) => setUpdatedData(({ ...updatedData, caisher_name: e.target.value }))}
                  />

               </div>
               <div className="flex flex-col gap-2 mb-2">
                  <label className="font-bold text-[13px]" htmlFor="first_name">
                     <span className="mr-1 text-red-600">*</span>Statusi
                  </label>
                  <select
                     className={`${styles.inputUchun}`}
                     value={updatedData?.is_active}
                     onChange={(e) => setUpdatedData({ ...updatedData, is_active: convertToBoolean(e.target.value) })}
                  >
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
                     value={updatedData.town_id}
                     onChange={(e) => setUpdatedData({ ...updatedData, town_id: +e.target.value })}
                  >
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

export default SettingCaisherUpdate
