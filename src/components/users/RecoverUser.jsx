/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { LiaTrashRestoreAltSolid } from "react-icons/lia";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreUser } from "../../functions/UserMethodes";
import { RestoreAlert } from "../../examples/delete-modal/RestoreAlert";

export default function RecoverUser({ id, set }) {
  const queryClient = useQueryClient();
  const restoreMutate = useMutation({
    mutationFn: restoreUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["Users"]);
    },
  });

  const handleSubmit = async () => {
    await RestoreAlert("Foydalanuvchi", () => restoreMutate.mutate(id));
    set([]);
  };

  return (
    <div>
      <button
        onClick={() => handleSubmit()}
        className={`bg-green px-2 py-1.5 text-white rounded text-sm flex items-center gap-1`}
      >
        <LiaTrashRestoreAltSolid className="text-white text-xl" />
        <p className="text-md">Tiklash</p>
      </button>
    </div>
  );
}
