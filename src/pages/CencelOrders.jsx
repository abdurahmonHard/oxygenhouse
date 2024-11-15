import React from 'react'
import GetCancelOrders from '../components/cancel-orders/GetCancelOrders'
import { getCanceledOrders } from '../functions/OrderMethods';
import { useQuery } from '@tanstack/react-query';

const CencelOrders = () => {
   const id = 0;
   const { data, isLoading } = useQuery(["getAllOrders", id], async () => await getCanceledOrders(id));

   return (
      <div>
         <GetCancelOrders data={data} isLoading={isLoading} />
      </div>
   )
}

export default CencelOrders