/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import React, { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RestoreAlert } from "../../examples/delete-modal/RestoreAlert";

import { restorePayment } from "../../functions/Payments";
import { LiaTrashRestoreAltSolid } from "react-icons/lia";

export default function CassierRestore({ id, set }) {
  const queryClient = useQueryClient();
  const restoreMutate = useMutation({
    mutationFn: restorePayment,
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllPayments"]);
    },
  });

  const handleSubmit = useCallback(async () => {
    await RestoreAlert("To'lov", () => restoreMutate.mutate(id));
    set([]);
  }, [restoreMutate, id, set]);

  return (
    <div>
      <button
        onClick={() => handleSubmit()}
        className={`bg-green px-2 py-1.5 text-white rounded text-sm flex items-center gap-1 active:bg-green`}
      >
        <LiaTrashRestoreAltSolid className="text-white text-xl" />
        <p className="text-md">Tiklash</p>
      </button>
    </div>
  );
}
