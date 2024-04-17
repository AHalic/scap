import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
	name: string;
	defaultValue?: Option | null | string;
  options: Option[];
	light?: boolean;
	disabled?: boolean;
	onChange?: (value: Option) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderFunction: (option: any) => ReactNode;
}

const Select: FC<SelectProps> = ({name, defaultValue=null, options, light=false, disabled=false, onChange = () => {}, renderFunction = (option) => option.label }: SelectProps) => {
	const [selectedOption, setSelectedOption] = useState<Option | null>();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const dropdownRef = useRef(null);

	useEffect(() => {
		if (defaultValue) {
			const option = options.find((option) => option.value === defaultValue);

			if (!option) {
				return;
			}

			onChange(option);
			setSelectedOption(option);
		}
	}, [defaultValue]);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !((dropdownRef.current as unknown) as Node).contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	const handleOptionSelect = (option: Option) => {
		onChange(option);
		setSelectedOption(option);
		setIsOpen(false);
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div ref={dropdownRef} className="relative">
			<input type="hidden" name={name} value={selectedOption?.value || ''} />
			<button
				disabled={disabled}
				name={name}
				type="button"
				onClick={toggleDropdown}
				className={`flex items-center justify-between w-full ${light ? `bg-white ${disabled ? 'text-gray-400' : 'text-gray-500'}` :  disabled ? 'text-gray-500' : 'text-slate-600'}  px-2 py-2 mt-1 text-left rounded-md border border-gray-300 focus:outline-none focus:border-blue-500`}
			>
				{selectedOption ? renderFunction(selectedOption) : 'Selecione uma opção'}
				<ChevronDownIcon className="w-4 h-4 inline-block text-slate-600 float-right" />
			</button>
			{isOpen && (
				<div className="max-h-40 overflow-auto absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md">
					<ul className="py-1">
						{options.map((option) => (
							<li

								key={option.value}
								onClick={() => handleOptionSelect(option)}
								className="px-4 py-2 text-slate-600 text-base cursor-pointer hover:bg-gray-100"
							>
								{renderFunction(option)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Select;
