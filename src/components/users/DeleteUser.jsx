/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { BsTrash } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../functions/UserMethodes";
import { DeleteAlert } from "../../examples/delete-modal/DeleteAlert";

export default function DeleteUser({ id, set }) {
  const queryClient = useQueryClient();
  const deleteMutate = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["Users"]);
    },
  });

  const handleSubmit = async () => {
    await DeleteAlert("Foydalanuvchi", () => deleteMutate.mutate(id));
    set([]);
  };

  return (
    <div>
      <button
        onClick={() => handleSubmit()}
        className={`bg-red-500 px-2 py-1.5 text-white rounded text-sm flex items-center gap-1 active:bg-red-600`}
      >
        <BsTrash className="text-white text-xl" />
        <p className="text-md">O'chirish</p>
      </button>
    </div>
  );
}
