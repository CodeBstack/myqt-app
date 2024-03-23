/* eslint-disable react/prop-types */

import { useFormContext, get } from "react-hook-form";

// import "./styles.scss";
import InputField from "./InputField";

export default function ValidatedInput({
	name,
	required = true,
	// onChange,
	rules,
	errMsg,
	showErrMsg = true,
	...otherProps
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext({
		mode: "all",
	});
	const error = get(errors, name);
	// console.log(dirtyFields);

	return (
        <div className={`${otherProps.containerClass}`}>
			<InputField
				isinvalid={error}
				// onChangeCallback={onChange}
				{...otherProps}
				{...register(name, {
					required: required ? "This field is required" : false,
					...(otherProps.type === "password"
						? {
							minLength: {
								value: 6,
								message: "Password must have at least 6 characters",
							},
							// pattern: {
							// 	value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
							// 	message:
							// 		"Password must have at least 1 uppercase, lowercase, number and a symbol",
							// },
						}
						: {}),
					...rules,
				})}
			/>
			{showErrMsg && error && (
				<div className="input-err-msg">{error.message || errMsg}</div>
			)}
		</div>
	);
}


