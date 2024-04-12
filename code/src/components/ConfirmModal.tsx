import { createPortal } from "react-dom";

export default function ConfirmModal({
	open,
	title,
	message,
	onConfirm,
	onCancel
}: {open: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void}) {
	return createPortal(
		<div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'hidden'}`}>
			<div className="absolute inset-0 bg-black opacity-50"></div>
			<div className="bg-white rounded-lg px-6 py-4 z-10">
				<h2 className="text-xl font-bold text-slate-700 mb-1">{title}</h2>
				<p className="text-lg text-slate-400">{message}</p>
				<div className="flex justify-end space-x-4 mt-8">
					<button onClick={onCancel} className="px-4 py-2 bg-red-600 text-white rounded-lg">Cancelar</button>
					<button onClick={onConfirm} className="px-4 py-2 bg-green-600 text-white rounded-lg">Confirmar</button>
				</div>
			</div>
		</div>,
		document.body
	);
} 