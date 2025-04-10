import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { handleInputChange } from "../utils/formHelpers";

/**
 * A reusable input component with support for different types (text, password, email, etc.)
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, password, email, etc.)
 * @param {string} props.name - Input name
 * @param {string} [props.placeholder] - Input placeholder text
 * @param {string} [props.value] - Input value
 * @param {Function} props.onChange - Function to handle input change
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.label] - Label text for the input
 * @param {string} [props.className] - Additional CSS classes for the input
 * @param {boolean} [props.required] - Whether the input is required
 * @param {string} [props.icon] - Optional icon to show before the input
 * @param {Function} [props.setErrors] - Function to handle error updates
 */
export default function Input({
	type = "text",
	name = "input",
	placeholder = "Enter text",
	value = "",
	label = null,
	setFormData,
	setErrors = null,
	className = "",
	required = false,
	error = "",
	icon: Icon = null,
	...rest
}) {
	const [showPassword, setShowPassword] = useState(false);

	// Toggle password visibility
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	// Determine the type based on the showPassword state for password fields
	const inputType = (type === "password" && showPassword) ? "text" : type;

	return (
		<>
			{/* Label */}
			{label && (
				<label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
					{label}
				</label>
			)}
			<div className="relative mb-4">
				{/* Optional Icon */}
				{Icon && (
					<Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2  w-5 h-5 ${error ? "text-red-500" : "text-gray-400"}`} />
				)}

				{/* Input Field */}
				<input
					type={inputType}
					id={name}
					name={name}
					value={value}
					onChange={(e) => handleInputChange(e, setFormData, setErrors)}
					placeholder={placeholder}
					className={`w-full m-0 ${Icon && ("pl-10")} px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 
                            ${error
							? "border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500"
							: "border-gray-300 dark:border-gray-600"
						}
            dark:bg-gray-700 dark:text-white ${className}`}
					required={required}
					{...rest}
				/>

				{/* Password Visibility Toggle (only for password fields) */}
				{type === "password" && (
					<button
						type="button"
						className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
						onClick={togglePasswordVisibility}
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				)}
			</div>

			{/* Error Message */}
			{error && (
				<div className="text-sm text-red-600 dark:text-red-500">{error}</div>
			)}
		</>
	);
}
