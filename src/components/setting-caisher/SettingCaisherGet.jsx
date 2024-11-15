import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getCaisher } from "../../functions/CaisherMethods"
import { SettingCaisherTable } from "./SettingCaisherTable"

const SettingCaisherGet = () => {
    const { data, isLoading } = useQuery(["getCaisher"], () => getCaisher())

    return (
        <div>
            <SettingCaisherTable data={data} isLoading={isLoading} />
        </div>
    )
}

export default SettingCaisherGet