import React from 'react'

const Button = ({ type = "button", title, icon, handleClick, bg }) => {
    return (
        <button
            onClick={handleClick}
            type={type}
            className={`font-semibold text-sm flex gap-2 items-center ${bg || "bg-black"} outline-none border-none rounded-lg w-fit text-white px-4 py-2`}
        >
            {icon}
            {title}
        </button>
    )
}

export default Button