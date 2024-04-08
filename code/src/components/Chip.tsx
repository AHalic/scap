export default function Chip({ children, color = "red" }: { children: React.ReactNode, color?: string}) {
	const colorClasses: { [key: string]: string } = {
		red: 'bg-red-600',
		blue: 'bg-blue-600',
		green: 'bg-green-600',
		indigo: 'bg-indigo-500',
		yellow: 'bg-yellow-500',
		teal: 'bg-teal-600',
		cyan: 'bg-cyan-600',
		sky: 'bg-sky-600',
		zinc: 'bg-zinc-500',
		gray: 'bg-gray-500',
		stone: 'bg-stone-500',
	};

	return (
		<span className={`px-2 py-1 ${colorClasses[color]} text-sm text-white rounded-lg`}>
			{children}
		</span>
	);
}