/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

interface Option {
  id: string;
  label: string;
}

export default function InputAsync({loadOptions, light =false, ...props}: {
  loadOptions: (inputValue: string) => Promise<Option[]>;
  light: boolean;
  [x: string]: any
}) {
	const [selectedOption, setSelectedOption] = useState<Option | null>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>('');
	const [options, setOptions] = useState<Option[]>([]);

	const dropdownRef = useRef(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !((dropdownRef.current as unknown) as Node).contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	const handleOptionSelect = (option: Option) => {
		setSelectedOption(option);
		setInputValue(option.label);
		setIsOpen(false);
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (inputValue.length >= 3) {
			setIsOpen(true);
		}
	}, [inputValue]);

	useEffect(() => {
		if (inputValue.length >= 3) {
			loadOptions(inputValue).then(setOptions);
		}
	}, [inputValue, loadOptions]);

	return (
		<div ref={dropdownRef} className="relative">
			<input type="hidden" name={props?.name} value={selectedOption?.id || ''} />
			<input
				{...props}
				type="text"
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
				className={`flex items-center justify-between w-full  ${light ? `bg-white ${props.disabled ? 'text-gray-400' : 'text-gray-500'}` :  props.disabled ? 'text-gray-500' : 'text-slate-600'} px-2 py-2 mt-1 text-left rounded-md border border-gray-300 focus:outline-none focus:border-blue-500`}
			/>
			{isOpen && (
				<div className="max-h-40 overflow-auto absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md">
					<ul className="py-1">
						{options.map((option) => (
							<li
								key={option.id}
								onClick={() => handleOptionSelect(option)}
								className="px-4 py-2 text-slate-600 text-base cursor-pointer hover:bg-gray-100"
							>
								{option.label}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};