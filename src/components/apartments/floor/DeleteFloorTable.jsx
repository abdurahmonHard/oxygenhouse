import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { deleteApartmentByFloorId } from '../../../functions/ProjectMethods'
import { styles } from '../../../assets/styles/styles'
import { DeleteAlert } from '../../../examples/delete-modal/DeleteAlert'

const DeleteFloorTable = ({ item }) => {
   const queryClient = useQueryClient()
   const removeApartment = useMutation({
      mutationFn: deleteApartmentByFloorId,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["getAllBuildings"] })
      }
   })

   // xona o'chirish kodi
   const handleDeleteApartment = async (item) => {
      try {
         await DeleteAlert(`${item.room_number} Xonadonni`, () => removeApartment.mutate(item.id))
      } catch (error) {
         console.log(error);
      }
   }
   return (
      <div>
         <button
            onClick={() =>
               handleDeleteApartment(
                  item
               )
            }
            className={`w-[36px] h-[36px] bg-red-400 rounded-full ${styles.flexCenter} cursor-pointer`}
         >
            <FiTrash2 className="text-sm text-white" />
         </button>
      </div>
   )
}

export default DeleteFloorTable