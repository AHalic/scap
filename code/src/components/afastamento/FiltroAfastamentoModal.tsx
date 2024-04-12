import { DateTime } from "luxon";
import { Dispatch, FormEvent, SetStateAction } from "react";

import { EstadoSolicitacao, Onus, TipoAfastamento } from "@prisma/client";

import { FiltrosAfastamento, estadoAfastamentoColors } from "../../../lib/interfaces/Filtros";
import Chip from "../Chip";
import Select from "../Select";

export default function FiltroAfastamentoModal({
	isOpenState, 
	paramsState
}: {
  isOpenState: [boolean, Dispatch<SetStateAction<boolean>>], 
  paramsState: [FiltrosAfastamento, Dispatch<SetStateAction<FiltrosAfastamento>>]
}) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [params, setParams] = paramsState;
	const [isOpen, setIsOpen] = isOpenState;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();

		const formData = new FormData(event.currentTarget);

		const dataSolicitacao = DateTime.fromISO(formData.get('dataSolicitacao') as string).toISO();
		const estado = formData.get('estado') as EstadoSolicitacao;

		const dataInicio = DateTime.fromISO(formData.get('dataInicio') as string).toISO();
		const dataFim = DateTime.fromISO(formData.get('dataFim') as string).toISO();

		const dataInicioEvento = DateTime.fromISO(formData.get('dataInicioEvento') as string).toISO();
		const dataFimEvento = DateTime.fromISO(formData.get('dataFimEvento') as string).toISO();

		const onus = formData.get('onus') as Onus;
		const tipo = formData.get('tipo') as TipoAfastamento;

		const solicitante = formData.get('solicitante') as string;


		setParams({
			dataSolicitacao,
			estado,
			dataInicio,
			dataFim,
			dataInicioEvento,
			dataFimEvento,
			onus,
			tipo,
			solicitante
		});
		setIsOpen(false);
	};


	const handleClear = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();

		setParams({} as FiltrosAfastamento);
		setIsOpen(false);
	};

	return (
		<div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
			<div className="absolute inset-0 bg-black opacity-50"></div>
			<div className="bg-white rounded-lg px-6 py-4 z-10 w-max-[800px] w-1/2 w-min-[400px] ">
				<h2 className="text-lg font-bold text-slate-700 mb-1">Filtrar Afastamentos</h2>
				
				<form onSubmit={handleSubmit} onReset={handleClear}>
					<div className="grid grid-cols-8 grid-rows-5 gap-4 mt-5">

						{/* Data de Solicitação */}
						<div className="col-span-4 w-full">
							<label>
								<span className="block text-sm font-medium text-slate-700">Data da Solicitação</span>
								<input id="dataSolicitacao" name="dataSolicitacao" type="date" title="Data da Solicitação" alt="Data da Solicitação" className="w-full border border-gray-300 text-gray-500 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
							</label>
						</div>

						{/* Estado */}
						<div className="col-span-4">
							<label>
								<span className="block text-sm font-medium text-slate-700">Estado</span>
								<Select
									name="estado"
									renderFunction={
										(option: {
                      value: string;
                      label: EstadoSolicitacao;}
										) => <Chip color={estadoAfastamentoColors[option.label].color}>{option.value}</Chip>}
									options={Object.values(EstadoSolicitacao).map((value) => ({ label: value, value }))}
								/>
							</label>
						</div>

						{/* Data de Início */}
						<div className="col-span-4 w-full">
							<label>
								<span className="block text-sm font-medium text-slate-700">Data de Início</span>
								<input id="dataInicio" name="dataInicio" type="date" title="Data de Início" alt="Data de Início" className="w-full border border-gray-300 text-gray-500 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
							</label>
						</div>

						{/* Data de Fim */}
						<div className="col-span-4 w-full">
							<label>
								<span className="block text-sm font-medium text-slate-700">Data de Fim</span>
								<input id="dataFim" name="dataFim" type="date" title="Data de Fim" alt="Data de Fim" className="w-full border border-gray-300 text-gray-500 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
							</label>
						</div>

						{/* Data de Início do Evento */}
						<div className="col-span-4 w-full">
							<label>
								<span className="block text-sm font-medium text-slate-700">Data de Início do Evento</span>
								<input id="dataInicioEvento" name="dataInicioEvento" type="date" title="Data de Início do Evento" alt="Data de Início do Evento" className="w-full border border-gray-300 text-gray-500 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
							</label>
						</div>

						{/* Data de Fim do Evento */}
						<div className="col-span-4 w-full">
							<label>
								<span className="block text-sm font-medium text-slate-700">Data de Fim do Evento</span>
								<input id="dataFimEvento" name="dataFimEvento" type="date" title="Data de Fim do Evento" alt="Data de Fim do Evento" className="w-full border border-gray-300 text-gray-500 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
							</label>
						</div>

						{/* Onus */}
						<div className="col-span-4">
							<label>
								<fieldset name="onus">

									<span className="block text-sm font-medium text-slate-700">Ônus</span>
									<Select
										name="onus"
										renderFunction={(option) => option.value}
										options={Object.values(Onus).map((value) => ({ label: value, value }))}
									/>
								</fieldset>
							</label>
						</div>

						{/* Tipo */}
						<div className="col-span-4">
							<label>
								<span className="block text-sm font-medium text-slate-700">Tipo</span>
								<Select
									name="tipo"
									renderFunction={(option) => option.value}
									options={Object.values(TipoAfastamento).map((value) => ({ label: value, value }))}
								/>
							</label>
						</div>

						{/* Solicitante */}
						<div className="col-span-8">
							<label>
								<span className="block text-sm font-medium text-slate-700">Solicitante</span>
								<input id="solicitante" name="solicitante" type="text" title="Solicitante" alt="Solicitante" className="w-full border border-gray-300 text-gray-500 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500" />
							</label>
						</div>

					</div>

					<div className="flex justify-end space-x-4 mt-8">
						<button type="reset" className="px-4 py-2 bg-red-600 opacity-80 text-white hover:opacity-65 rounded-lg">Limpar Filtro</button>
						<button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-slate-300 text-slate-500 hover:opacity-85 rounded-lg">Fechar</button>
						<button type="submit" className="px-4 py-2 bg-green-600 opacity-80 hover:opacity-65 text-white rounded-lg">Filtrar</button>
					</div>
				</form>
			</div>
		</div>    
	);
}