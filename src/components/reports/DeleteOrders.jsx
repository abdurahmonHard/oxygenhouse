/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import React, { useCallback } from "react";
import { BsTrash } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAlert } from "../../examples/delete-modal/DeleteAlert";
import { deleteOrders } from "../../functions/OrderMethods";

export default function DeleteOrders({ id, set }) {
   const queryClient = useQueryClient();
   const deleteMutate = useMutation({
      mutationFn: deleteOrders,
      onSuccess: () => {
         queryClient.invalidateQueries(["getAllOrders"]);
      },
   });

   const handleSubmit = useCallback(async () => {
      await DeleteAlert("Shartnoma", () => deleteMutate.mutate(id));
      set([]);
   }, []);

   return (
      <div>
         <button
            onClick={() => handleSubmit()}
            className={`bg-red-500 px-2 py-1.5 text-white rounded text-sm flex items-center gap-1 active:bg-red-600`}
         >
            <p className="text-md">O'chirish</p>
         </button>
      </div>
   );
}
