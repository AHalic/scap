import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({style: "normal", weight: "300", subsets: ["latin"]});
const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});

export default function InputText({label, name, placeholder, required, className, type}: 
{
    label?: string,
    name?: string,
    placeholder?: string,
    required?: boolean,
    className?: string,
    type?: string
}) {
	return (
		<div>
			<label htmlFor={name} className={`block text-sm font-medium leading-6 text-gray-400 ${inter.className}`}>{label}</label>
			<div className="relative rounded-md shadow-sm">
				<input 
					type={type} name={name} id={name} 
					className={`block w-full rounded-md border-0 px-3 py-2 text-gray-900 ring-1 
                    ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                    focus:ring-sky-300 sm:text-sm sm:leading-6 outline-none ${poppins.className} ${className}`}
					placeholder={placeholder}
					pattern={type === "email" ? "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$" : undefined}
					required={required}
				/>
			</div>
		</div>
	);
}