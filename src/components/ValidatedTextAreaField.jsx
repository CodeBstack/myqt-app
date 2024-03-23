/* eslint-disable react/prop-types */

import { useFormContext, get } from "react-hook-form";

// import "./styles.scss";
import TextAreaField from "./TextAreaField";

const ValidatedTextAreaField = ({
	name,
	required = true,
	rules,
	errMsg,
	showErrMsg = true,
	...otherProps
}) => {
	const {
		register,
		formState: { errors },
	} = useFormContext({
		mode: "all",
	});
	const error = get(errors, name);

	return (
		<div className="">
			<TextAreaField
				isinvalid={error}
				{...otherProps}
				{...register(name, {
					required: required ? "This field is required" : false,
					...rules,
				})}
			/>
			{showErrMsg && error && (
				<div className="input-err-msg">{error.message || errMsg}</div>
			)}
		</div>
	);
};

export default ValidatedTextAreaField;
