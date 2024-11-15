import React from 'react'
import { BiEditAlt } from "react-icons/bi"

const CassierUpdate = ({ data }) => {

    return (
        <div>
            <div className="flex">
                <div>
                    <button
                        className={`w-[30px] h-[30px] bg-yellow-500 rounded-full inline-flex items-center justify-center cursor-pointer`}
                    >
                        <BiEditAlt className="text-sm text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CassierUpdate