import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { FonteParecer, TipoParecer } from "@prisma/client";

import Select from "./Select";


export default function ModalParecer({
	openState,
	isParecer,
	onConfirm,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>];
  isParecer?: boolean;
  onConfirm: (formRef: RefObject<HTMLFormElement>) => void;
}) {
	const [open, setOpen] = openState;
	const [confirmar, setConfirmar] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);

	return createPortal(
		<div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'hidden'}`}>
			<div className="absolute inset-0 bg-black opacity-50"></div>
			<div className="bg-white rounded-lg w-[400px] px-6 py-4 z-10">
				<h2 className="text-xl font-bold text-slate-700 mb-3">
					{isParecer ? 'Parecer' : 'Manifestar-se contra'}
				</h2>

				<form ref={formRef}>

					<div className="grid grid-cols-8 gap-4">
						{
							isParecer && (
								<>
									<div className="col-span-8">
										<label htmlFor="julgamento" className="block text-base font-medium text-slate-600">
                			Julgamento
										</label>
										<Select
											light
											name="julgamento"
											renderFunction={(option) => option.value}
											options={Object.values(TipoParecer).map((value) => ({ label: value, value }))}
										/>
									</div>

									<div className="col-span-8">
										<label htmlFor="fonte" className="block text-base font-medium text-slate-600">
											Fonte
										</label>
										<Select
											light
											name="fonte"
											renderFunction={(option) => option.value}
											options={Object.values(FonteParecer).map((value) => ({ label: value, value }))}
										/>
									</div>
								</>
							)
						}

						<div className="col-span-8">
							<textarea
								name="motivo"
								className="w-full p-2 border border-slate-200 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg"
								rows={3}
								placeholder="Motivo"
							></textarea>
						</div>
					</div>


					<div className="flex justify-end space-x-4 mt-8">
						<button type="button" onClick={() => {
							setOpen(false);
							setConfirmar(false);
						}} 
						className="px-4 py-2 bg-slate-300 text-gray-600 rounded-lg hover:bg-slate-400">
            Cancelar
						</button>

						{confirmar ? (
							<button type="button" onClick={() => onConfirm(formRef)} 
								className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600"
							>
                Confirmar
							</button>
						) : (
							<button type="button" onClick={() => setConfirmar(true)}
								className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
							>
                Salvar
							</button>
						)}

					</div>
				</form>
			</div>
		</div>,
		document.body
	);
}