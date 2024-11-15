/* eslint-disable react/prop-types */
import React, { memo, useState } from "react";
import { styles } from "../../assets/styles/styles";
import { FiPlus, FiX } from "react-icons/fi";
import FloorManage from "./FloorManage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteEntrance,
  postEntrance,
  postFloor,
} from "../../functions/ProjectMethods";
// import { AuthContext } from "../../context/AuthContext";
import { DeleteAlert } from "../../examples/delete-modal/DeleteAlert";
import Loading from "../../examples/loading/Loading";

// eslint-disable-next-line react/prop-types
const Entrance = ({ data }) => {
  const [isEntrance, setIsEntrance] = useState(true);
  const [entranceId, setEntranceId] = useState(
    data?.entrances?.[0]?.id || null
  );
  const filterEntranceId = data?.entrances?.filter(
    (ent) => ent.id === entranceId
  );

  const queryClient = useQueryClient();

  // blok yaratish react query orqali
  const createEntrance = useMutation({
    mutationFn: postEntrance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBuildings"] });
    },
  });

  // qavat yaratish react query orqali
  const createFloor = useMutation({
    mutationFn: postFloor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBuildings"] });
    },
  });

  // blok o'chirish react query orqali
  const removeEntrance = useMutation({
    mutationFn: deleteEntrance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllBuildings"] });
    },
  });

  // blok o'chirish kodi
  const handleDeleteEntrance = async (item) => {
    try {
      await DeleteAlert(`${item.entrance_number} Podyezdni`, () =>
        removeEntrance.mutate(item.id)
      );
      setIsEntrance(false);
    } catch (error) {
      console.log(error);
    }
  }

  // blok yaratish kodi
  const handleCreateEntrance = async () => {
    try {
      const buildingId = data?.id;
      await createEntrance.mutate(buildingId);
    } catch (error) {
      console.log(error);
    }
  }

  // qavat yaratish kodi
  const handleCreateFloor = async () => {
    try {
      const entrance = +entranceId;
      await createFloor.mutate(entrance);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div
        className={`h-9 border-b-gray-100 border-b-[1.5px] ${styles.flexItemCenter}`}
      >
        <div
          className={`h-9 overflow-x-auto  border-b-gray-100 border-b-[1.5px] rounded-md ${styles.flexItemCenter}`}
        >
          {
            // eslint-disable-next-line react/prop-types
            data ? (
              data?.entrances?.map((ent, index) => (
                <button
                  key={ent.id}
                  onClick={() => {
                    setEntranceId(ent.id);
                    setIsEntrance(true);
                  }}
                  className={`border-r-[1.5px] ${styles.flexCenter} whitespace-nowrap px-3 gap-2 text-dodgerblue rounded-r-none rounded-sm`}
                  style={
                    entranceId === ent.id
                      ? { background: "#ddd" }
                      : { background: "#fff" }
                  }
                >
                  <p className="text-sm font-medium sx:text-xs">Podyezd {index + 1}</p>
                  {!ent.floors.length && (
                    <FiX
                      onClick={() => handleDeleteEntrance(ent)}
                      className="cursor-pointer hover:bg-dodgerblue rounded-full hover:text-white duration-150"
                    />
                  )}
                </button>
              ))
            ) : (
              <Loading />
            )
          }
          <button
            className={`text-sm whitespace-nowrap text-white bg-green py-1.5 px-2 rounded-l-none rounded-md font-medium ${styles.flexCenter} gap-1`}
            // eslint-disable-next-line react/prop-types
            onClick={handleCreateEntrance}
          >
            <FiPlus className="text-lg" />
            <p className="sx:text-xs">Podyezd qo&apos;shish</p>
          </button>
        </div>
      </div>
      {isEntrance && filterEntranceId?.length > 0 && (
        <button
          // eslint-disable-next-line no-undef
          className={`bg-dodgerblue text-white ${styles.flexCenter} gap-1 p-2 rounded-sm mt-4 ml-4`}
          onClick={handleCreateFloor}
        >
          <p className="text-sm">Qavat qo&apos;shish</p>
          <FiPlus className="text-lg" />
        </button>
      )}

      <FloorManage floors={filterEntranceId} />
    </div>
  );
};

const MemoizeEntrance = memo(Entrance);
export default MemoizeEntrance;
