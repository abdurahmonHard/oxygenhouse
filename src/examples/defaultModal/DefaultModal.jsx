import React from 'react'

const DefaultModal = ({ title, isOpen, closeButton, children }) => {
    return isOpen && (
        <div className='bg-black p-20'></div>
    )
}

export default DefaultModal