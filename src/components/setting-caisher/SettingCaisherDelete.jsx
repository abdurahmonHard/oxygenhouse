/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import React, { useCallback } from "react";
import { BsTrash } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAlert } from "../../examples/delete-modal/DeleteAlert";

import { deleteCaisher } from "../../functions/CaisherMethods"

export default function SettingCaisherDelete({ data }) {
    const queryClient = useQueryClient();
    const deleteMutate = useMutation({
        mutationFn: deleteCaisher,
        onSuccess: () => {
            queryClient.invalidateQueries(["getCaisher"]);
        },
    });

    const handleSubmit = useCallback(async () => {
        await DeleteAlert(`${data.caisher_name} ni`, () => deleteMutate.mutate(data.id));
    }, []);

    return (
        <div>
            <button
                onClick={() => handleSubmit()}
                className={`bg-red-500 p-2 text-white rounded-full text-sm flex items-center gap-1 active:bg-red-600`}
            >
                <BsTrash className="text-white text-sm" />
            </button>
        </div>
    );
}