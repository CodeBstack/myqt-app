/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef, useState } from "react";
// import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
// import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

// import "./styles.scss";

const InputField = forwardRef(
	(
		{
			type = "text",
			placeholder = "",
			defaultValue,
			label,
			phoneNumberLabel,
			className,
			prefixIcon,
			suffixIcon,
			containerClass,
			bgColor,
			handleFocus,
			placeholderColor,
			noBg,
			...props
		},
		ref
	) => {
		const [showPassword, setShowPassword] = useState(false);

		return (
			<div className={`w-full ${containerClass}`}>
				{label && (
					<p
						className={`mb-2 flex justify-between flex-wrap gap-4 items-center  font-medium text-13 ${props.labelColor || "text-neutral-05"
							}`}
					>
						{label}{" "}
						{phoneNumberLabel && (
							<span className="flex gap-1 items-center text-13">
								<svg
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clipPath="url(#clip0_2064_12785)">
										<path
											d="M10.4623 3.17998C8.89484 0.749983 5.68484 0.0299829 3.20234 1.53748C0.779842 3.04498 -0.000158012 6.32998 1.56734 8.75248L1.69484 8.94748L1.16984 10.9125L3.13484 10.3875L3.32984 10.515C4.17734 10.9725 5.09984 11.235 6.01484 11.235C6.99734 11.235 7.97984 10.9725 8.82734 10.4475C11.2498 8.87248 11.9698 5.65498 10.4623 3.16498V3.17998ZM9.08984 8.23498C8.82734 8.62498 8.49734 8.88748 8.03984 8.95498C7.77734 8.95498 7.44734 9.08248 6.14234 8.56498C5.03234 8.03998 4.10984 7.18498 3.45734 6.20248C3.06734 5.74498 2.86484 5.15248 2.80484 4.55998C2.80484 4.03498 2.99984 3.57748 3.32984 3.24748C3.45734 3.11998 3.59234 3.05248 3.71984 3.05248H4.04984C4.17734 3.05248 4.31234 3.05248 4.37984 3.31498C4.50734 3.64498 4.83734 4.43248 4.83734 4.49998C4.90484 4.56748 4.87484 5.06998 4.57484 5.35498C4.40984 5.54248 4.37984 5.54998 4.44734 5.68498C4.70984 6.07498 5.03984 6.47248 5.36234 6.80248C5.75234 7.13248 6.14984 7.39498 6.60734 7.58998C6.73484 7.65748 6.86984 7.65748 6.93734 7.52248C7.00484 7.39498 7.32734 7.06498 7.46234 6.92998C7.58984 6.80248 7.65734 6.80248 7.79234 6.86248L8.84234 7.38748C8.96984 7.45498 9.10484 7.51498 9.17234 7.58248C9.23984 7.77748 9.23984 8.03998 9.10484 8.23498H9.08984Z"
											fill="#00B407"
										/>
									</g>
									<defs>
										<clipPath id="clip0_2064_12785">
											<rect width="12" height="12" fill="white" />
										</clipPath>
									</defs>
								</svg>
								WhatsApp number preferred.
							</span>
						)}
					</p>
				)}
				<div
					className={`input py4 md:py[21px] px-4 min-h-[3rem] focus-within!border-primary ${bgColor || "bg-white"
						} ${className}`}
				>
					{prefixIcon && (
						<span className="select-none -ml-4 h-12 w-12 focus-within:!h-2 rounded-l-xl flex justify-center items-center !-my-4 md:!-my[21px] !hfull mr-2.5 bg-neutral-02">
							{prefixIcon}
						</span>
					)}
					{suffixIcon && (
						<span
							className={`h-10 w-12  flex justify-center items-center ${noBg ? "" : "bg-primary"
								} rounded-full`}
						>
							{suffixIcon}
						</span>
					)}
					<input
						{...props}
						ref={ref}
						type={showPassword ? "text" : type}
						defaultValue={defaultValue}
						placeholder={placeholder}
						onFocus={handleFocus}
						className={`input__box focus:outlinenone placeholder:font-normal placeholder:text-sm ${placeholderColor || "placeholder:!text-[#777777]"
							}`}
					/>
					{/* {type === "password" && (
						<button
							type="button"
							className="icon-btn -mr-1 select-none"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<VisibilityOffOutlinedIcon sx={{ color: "#8585A3" }} />
							) : (
								<RemoveRedEyeOutlinedIcon sx={{ color: "#8585A3" }} />
							)}
						</button>
					)} */}
				</div>
			</div>
		);
	}
);

export default InputField;
