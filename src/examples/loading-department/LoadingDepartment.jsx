import React from 'react'
import "./style.css"

const LoadingDepartment = () => {
    return (
       <div className='fixed top-0 z-[1] w-full h-full left-0 backdrop-blur-md flex justify-center items-center'>
         <div className="half-circle-spinner">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
        </div>
       </div>
    )
}

export default LoadingDepartment