import React, { useState } from 'react'
import { getAllOrders } from '../../functions/OrderMethods';
import { useQuery } from '@tanstack/react-query';
import SearchTable from './SearchTable';

const GetOrders = () => {
   const [pageParam, setPageParam] = useState(1)
   const id = 0;
   const { data, isLoading } = useQuery(["getAllOrders", id, pageParam], async () => await getAllOrders(id));

   return (
      <div>
         <SearchTable data={data} isLoading={isLoading} pageParam={pageParam} setPageParam={setPageParam} />
      </div>
   )
}

export default GetOrders