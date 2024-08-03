/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

import { TipoParentesco } from "@prisma/client";

import { TipoPessoa } from "../../../lib/interfaces/Filtros";
import InputAsync from "../InputAsync";
import Select from "../Select";


export default function ParentescoModal({
	openState,
	professorBId,
	handleAdd,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>],
  professorBId?: string | null,
  handleAdd: (event: FormEvent<HTMLFormElement>) => void,
}) {
	const [reset, setReset] = useState<boolean>(false);
	const [selectedOption, setSelectedOption] = useState<any | null>(null);
	const [isOpen, setIsOpen] = openState;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		await handleAdd(event);

		setReset((prev) => !prev);
		setSelectedOption(null);
	};	

	return createPortal(
		<div className={`fixed inset-0 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
			<div className="fixed inset-0 bg-black opacity-50"></div>
			<div className="bg-white h-fit z-10 rounded-lg px-6 py-4 w-max-[800px] w-1/2 w-min-[400px] ">
				<h2 className="text-lg font-bold text-slate-700 mb-1">Adicionar Parentesco</h2>
      
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-8 gap-4 mt-5">
						{/* PROF 1 */}
						<input type="hidden" name="professorBId" value={professorBId || ''} />
						<input type="hidden" name="professorAId" value={selectedOption?.professorId || ''} />
						{/* PROF 2 */}
						<input type="hidden" name="professorA" value={JSON.stringify(selectedOption) || ''} />
						<div className="col-span-8">
							<label htmlFor="professorAId" className="block text-base font-medium text-slate-600">
              Parente
							</label>
							<InputAsync
								name="professorAId"
								handleSelect={(option) => {
									const pessoa = {
										professorId: option.id,
										nome: option.label,
										tipoPessoa: TipoPessoa.professor,
									};
                  
									setSelectedOption(pessoa);
								}}
								reset={reset}
								// defaultValue={initialValue ? { id: initialValue?.professorA.pessoa.id, label: initialValue?.professorA.pessoa.nome } : null}
								placeholder="Digite o nome do professor"
								light
								loadOptions={async (inputValue) => {
									return axios.get('/api/pessoa', { params: {nome: inputValue, tipo: TipoPessoa.professor} })
										.then(response => {
											return response.data.map((professor: any) => ({
												id: professor.professorId,
												label: professor.nome,
											}));
										})
										.catch(error => {
											console.error(error);
                  
											const message = error.response?.data?.message;
											toast(message ? message : 'Ocorreu um erro ao buscar os Professores', {
												type: 'error',
											});
											return [];
										});
								}}
							/>
						</div>
 
						{/* Tipo */}
						<div className="col-span-8">
							<label>
								<span className="block text-sm font-medium text-slate-700">Tipo do Parentesco</span>
								<Select
									light
									reset={reset}
									name="tipo"
									renderFunction={(option) => option.value}
									options={Object.values(TipoParentesco).map((value) => ({ label: value, value }))}
								/>
							</label>
						</div>

					</div>

					<div className="flex justify-end space-x-4 mt-8">
						<button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-slate-300 text-slate-500 hover:opacity-85 rounded-lg">Fechar</button>
						<button type="submit" className="px-4 py-2 bg-green-600 opacity-80 hover:opacity-65 text-white rounded-lg">Adicionar</button>
					</div>
				</form>
			</div>
		</div>,  
	  document.body // portal target
	);
} 