import React, { useState } from "react";
import { SearchTable } from "./CassierTable";
import { getAllPayments } from "../../functions/Payments";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../examples/loading/Loading";

const CassierGet = () => {
  const [pageParam, setPageParam] = useState(1);
  const { data, isLoading } = useQuery(
    ["getAllPayments", pageParam],
    async () => await getAllPayments(pageParam)
  );
  return (
    <div>
      {data ? (
        <SearchTable
          data={data}
          isLoading={isLoading}
          setPageParam={setPageParam}
          pageParam={pageParam}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default CassierGet;
