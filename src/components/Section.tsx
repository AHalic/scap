import { ReactNode } from "react";


export default function Section({ title, children }: {
  title: string;
  children: ReactNode;
}) {
	return (
		<div className="relative w-full p-4">
			<h1 className="absolute transform -translate-y-1/2 left-7 bg-slate-100 rounded-lg px-2 text-gray-400">{title}</h1>
			<div className="border-2 border-gray-300 rounded-md py-6 px-4">
				{children}
			</div>
		</div>
	);
};