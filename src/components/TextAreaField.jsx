/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
// import './styles.scss';


const TextAreaField = forwardRef(
    (
        {
            type = 'text',
            placeholder = '',
            required = true,
            defaultValue,
            label,
            labelBreakLine,
            labelDesc,
            bgColor,
            className,
            prefixIcon,
            ...props
        },
        ref
    ) => {

        return (
            <div className="w-full font-Inter ">
                {
                    label &&
                    <p className={`mb-2  font-medium text-sm ${props.labelColor || 'text-neutral-05'}`}>
                        {label} {' '}
                    </p>
                }
                <div className={`input py-4 md:pt-5 px-4 ${bgColor || 'bg-white'} focus-within:!border-primary ${className}`}>
                    <textarea
                        {...props}
                        ref={ref}
                        placeholder={placeholder}
                        className={`input__box w-full focus:outline-none placeholder:!text-[#777777] ${props.height ? props.height : "min-h-[120px]"}`}

                    />

                </div>
            </div>
        );
    });

export default TextAreaField;

