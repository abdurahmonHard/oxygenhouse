import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DoneOrders from "../components/reports/DoneOrders";
import { getComplatedOrders } from "../functions/OrderMethods";

const ComplatedOrders = () => {
  const [pageParam, setPageParam] = useState(1);
  const id = 0;
  const { data, isLoading } = useQuery(
    ["getComplatedOrders", id, pageParam],
    async () => await getComplatedOrders(id)
  );

  return (
    <div>
      <DoneOrders
        data={data}
        isLoading={isLoading}
        pageParam={pageParam}
        setPageParam={setPageParam}
      />
    </div>
  );
};

export default ComplatedOrders;
