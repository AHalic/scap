/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, RefObject, useState } from "react";
import { toast } from "react-toastify";

import ProtectedRoute from "@/auth";
import NavBar from "@/components/NavBar";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { EstadoSolicitacao, FonteParecer, Onus, TipoAfastamento, TipoParecer } from "@prisma/client";

import { AfastamentoCompleto, PessoaCompleta, TipoPessoa, estadoAfastamentoColors } from "../../../lib/interfaces/Filtros";
import Chip from "../Chip";
import Dropzone from "../Dropzone";
import InputAsync from "../InputAsync";
import ModalParecer from "../ModalParecer";
import Select from "../Select";

const inter = Inter({style: "normal", weight: "400", subsets: ["latin"]});

export const checkEstado = (estado: EstadoSolicitacao | undefined) => {
	if (estado === EstadoSolicitacao.ARQUIVADO || 
			estado === EstadoSolicitacao.CANCELADO ||
			estado === EstadoSolicitacao.REPROVADO) {
		return true;
	}
	return false;
};

export default function SolicitacaoPage({data, disabled=false, isSecretario=false, user, handleSubmit}: {
  data?: AfastamentoCompleto | undefined,
  disabled?: boolean,
	isSecretario?: boolean,
	user?: PessoaCompleta,
  handleSubmit?: (event: FormEvent<HTMLFormElement>) => void
}) {
	const [isModalNacionalOpen, setIsModalNacionalOpen] = useState(false);
	const [isModalInternacionalOpen, setIsModalInternacionalOpen] = useState(false);

	const router = useRouter();

	const handleParecer = (formRef: RefObject<HTMLFormElement>) => {
		if (!formRef.current) {
			return;
		}

		const formData = new FormData(formRef.current);
		const motivo = formData.get('motivo') as string;
		
		if (!motivo) {
			toast('O campo Motivo é obrigatório', {type: 'error'});
			return;
		}

		const body = {
			motivo,
			afastamentoId: data?.id,
			data: new Date().toISOString(),
			professorId: user?.professorId,
		};

		if (data?.tipo === TipoAfastamento.NACIONAL) {
			axios.post(`/api/parecer`, {
				...body,
				fonte: FonteParecer.DI,
				julgamento: TipoParecer.DESFAVORAVEL,
			})
				.then(() => {
					setIsModalNacionalOpen(false);
					setIsModalInternacionalOpen(false);
					toast('Manifestação enviada com sucesso', {type: 'success'});

					router.reload();
				})
				.catch((error) => {
					console.error(error);
					const message = error.response?.data?.message;

					toast(message ? message : 'Ocorreu um erro ao enviar a manifestação', {
						type: 'error',
					});
				});
		} else if (data?.tipo === TipoAfastamento.INTERNACIONAL) {
			const julgamento = formData.get('julgamento') as TipoParecer;
			const fonte = formData.get('fonte') as FonteParecer;

			axios.post(`/api/parecer`, {
				...body,
				fonte,
				julgamento,
			})
				.then(() => {
					setIsModalNacionalOpen(false);
					setIsModalInternacionalOpen(false);
					toast('Parecer enviado com sucesso', {type: 'success'});

					router.reload();
				})
				.catch((error) => {
					console.error(error);
					const message = error.response?.data?.message;

					toast(message ? message : 'Ocorreu um erro ao enviar o parecer', {
						type: 'error',
					});
				});
		}

		setIsModalNacionalOpen(false);
	};

	return (
		<ProtectedRoute>
			<div>
				<Head>
					<title>Solicitação | SCAP</title>
					<meta property="og:title" content="SCAP" key="title" />
				</Head>

				<div className="min-h-screen bg-gray-50 flex">
					<NavBar />

					<div className="flex-grow px-8 py-11">
						<div className="flex items-center justify-between flex-row mb-4">
							<nav className={`flex leading-6 items-center text-md text-slate-500 ${inter.className}`}>
               	Afastamentos 
								<ChevronRightIcon className="inline-block w-6 h-6" />
              	Solicitação
							</nav>

							{data?.tipo === TipoAfastamento.NACIONAL && data?.estado === EstadoSolicitacao.INICIADO && 
							data.solicitanteId !== user?.professorId && !user?.secretarioId && (
								<button
									onClick={() => setIsModalNacionalOpen(true)}
									className="flex py-1 px-2 rounded-md items-center bg-red-500  hover:bg-red-400"
								>
									Manifestar Contra
								</button>
							)}

							{data?.tipo === TipoAfastamento.INTERNACIONAL && (
								(data?.estado === EstadoSolicitacao.LIBERADO && data.solicitanteId !== user?.professorId) || 
								((data?.estado === EstadoSolicitacao.APROVADO_DI || data?.estado === EstadoSolicitacao.APROVADO_CT) &&
									!!user?.secretarioId)) && (
								<button
									onClick={() => setIsModalInternacionalOpen(true)}
									className="flex py-1 px-2 rounded-md items-center bg-red-500  hover:bg-red-400"
								>
									Parecer
								</button>
							)}
						</div>

						<div className="w-full bg-slate-100 rounded-md py-6 px-4 drop-shadow-[0_2px_4px_rgba(15,23,42,0.2)]">
							<h1 className="text-slate-700 font-bold text-2xl mb-5">Solicitação de Afastamento</h1>
							<FormAfastamento user={user} data={data} disabled={disabled} handleSubmit={handleSubmit} isSecretario={isSecretario} />
						</div>
					</div>
				</div>

				<ModalParecer 
					openState={[isModalNacionalOpen, setIsModalNacionalOpen]}
					onConfirm={handleParecer}
				/>

				<ModalParecer 
					isParecer
					openState={[isModalInternacionalOpen, setIsModalInternacionalOpen]}
					onConfirm={handleParecer}
				/>
			</div>
		</ProtectedRoute>
	);
}

const FormAfastamento = ({data, disabled=false, isSecretario=false, user, handleSubmit}: {
  data?: AfastamentoCompleto | undefined, 
  disabled?: boolean,
	isSecretario?: boolean,
	user?: PessoaCompleta,
  handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}) => {
	const [tipoAfastamento, setTipoAfastamento] = useState<TipoAfastamento | undefined>(data?.tipo);
	const router = useRouter();
		

	return (
		<>
			<form className="w-full h-full" onSubmit={handleSubmit}>
				<div className="grid grid-cols-8 gap-4 mb-8">
					{/* Nome do Evento */}
					<div className="col-span-8">
						<label htmlFor="nomeEvento" className="block text-base font-medium text-slate-600">
            Nome do Evento *
						</label>
						<input
							name="nomeEvento"
							id="nomeEvento"
							title="Nome do Evento"
							defaultValue={data?.nomeEvento}
							required
							placeholder="Nome do Evento"
							disabled={disabled}
							className={`w-full bg-white border border-gray-300 ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{data &&  (
						<>
							{/* Data de Solicitação */}
							<div className="col-span-4">
								<label htmlFor="dataSolicitacao" className="block text-base font-medium text-slate-600">
                Data de Solicitação
								</label>
								<input
									type="date"
									name="dataSolicitacao"
									id="dataSolicitacao"
									title="Data de Solicitação"
									alt="Data de Solicitação"
									disabled
									defaultValue={data?.dataSolicitacao ? new Date(data.dataSolicitacao).toISOString().split('T')[0] : ''}
									className={`w-full border border-gray-300 bg-white ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
								/>
							</div>

							{/* Status */}
							<div className="col-span-4">
								<label htmlFor="estado" className="block text-base font-medium text-slate-600">
                Estado
								</label>
								<Select
									light
									name="estado"
									defaultValue={data?.estado}
									disabled={isSecretario ? checkEstado(data?.estado) : true}
									renderFunction={
										(option: {
                      value: string;
                      label: EstadoSolicitacao;}
										) => <Chip color={estadoAfastamentoColors[option.label].color}>{option.value}</Chip>}
									options={Object.values(EstadoSolicitacao).map((value) => ({ label: value, value }))}
								/>
							</div>
						</>
					)}

					{/* Tipo de Afastamento */}
					<div className="col-span-4">
						<label htmlFor="tipo" className="block text-base font-medium text-slate-600">
            Tipo de Afastamento *
						</label>
						<Select
							light
							defaultValue={data?.tipo}
							name="tipo"
							disabled={disabled}
							onChange={(v) => {setTipoAfastamento(v.value as TipoAfastamento);}}
							renderFunction={(option) => option.value}
							options={Object.values(TipoAfastamento).map((value) => ({ label: value, value }))}
						/>
					</div>

					{/* Onus */}
					<div className="col-span-4">
						<label htmlFor="onus" className="block text-base font-medium text-slate-600">
            Ônus *
						</label>
						<Select
							light
							name="onus"
							disabled={disabled}
							defaultValue={data?.onus}
							renderFunction={(option) => option.value}
							options={Object.values(Onus).map((value) => ({ label: value, value }))}
						/>
					</div>

					{/* Data Início */}
					<div className="col-span-4">
						<label htmlFor="dataInicio" className="block text-base font-medium text-slate-600">
            Data de Início *
						</label>
						<input
							type="date"
							name="dataInicio"
							id="dataInicio"
							title="Data de Início"
							alt="Data de Início"
							disabled={disabled}
							required
							defaultValue={data?.dataInicio ? new Date(data.dataInicio).toISOString().split('T')[0] : ''}
							className={`w-full border border-gray-300 bg-white ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{/* Data Fim */}
					<div className="col-span-4">
						<label htmlFor="dataFim" className="block text-base font-medium text-slate-600">
            Data de Fim *
						</label>
						<input
							type="date"
							name="dataFim"
							id="dataFim"
							title="Data de Fim"
							alt="Data de Fim"
							disabled={disabled}
							required
							defaultValue={data?.dataFim ? new Date(data.dataFim).toISOString().split('T')[0] : ''}
							className={`w-full border border-gray-300 bg-white ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{/* Data Início Evento */}
					<div className="col-span-4">
						<label htmlFor="dataInicioEvento" className="block text-base font-medium text-slate-600">
            Data de Início do Evento *
						</label>
						<input
							type="date"
							name="dataInicioEvento"
							id="dataInicioEvento"
							title="Data de Início do Evento"
							alt="Data de Início do Evento"
							disabled={disabled}
							required
							defaultValue={data?.dataInicioEvento ? new Date(data.dataInicioEvento).toISOString().split('T')[0] : ''}
							className={`w-full border border-gray-300 bg-white ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{/* Data Fim Evento */}
					<div className="col-span-4">
						<label htmlFor="dataFimEvento" className="block text-base font-medium text-slate-600">
              Data de Fim do Evento *
						</label>
						<input
							type="date"
							name="dataFimEvento"
							id="dataFimEvento"
							title="Data de Fim do Evento"
							alt="Data de Fim do Evento"
							disabled={disabled}
							required
							defaultValue={data?.dataFimEvento ? new Date(data.dataFimEvento).toISOString().split('T')[0] : ''}
							className={`w-full border border-gray-300 bg-white ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{/* cidade */}
					<div className="col-span-4">
						<label htmlFor="cidadeEvento" className="block text-base font-medium text-slate-600">
						Cidade *
						</label>
						<input
							name="cidadeEvento"
							id="cidadeEvento"
							title="Cidade"
							defaultValue={data?.cidadeEvento}
							required
							disabled={disabled}
							placeholder="Cidade"
							className={`w-full bg-white border border-gray-300 ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{/* Relator */}
					{tipoAfastamento && tipoAfastamento === TipoAfastamento.INTERNACIONAL && (
						<div className="col-span-4">
							<label htmlFor="relatorId" className="block text-base font-medium text-slate-600">
              Relator
							</label>
							<InputAsync
								name="relatorId"
								placeholder="Digite o nome do relator"
								light
								defaultValue={data?.relatorId ? {id: data?.relatorId, label: data?.relator?.pessoa?.nome} : undefined}
								disabled={user?.professor?.mandato.length ? data?.estado !== EstadoSolicitacao.INICIADO : true}
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
					)}

					{/* Motivo */}
					<div className="col-span-8">
						<label htmlFor="motivo" className="block text-base font-medium text-slate-600">
            Motivo *
						</label>
						<textarea
							name="motivo"
							id="motivo"
							title="Motivo"
							rows={3}
							defaultValue={data?.motivo}
							required
							disabled={disabled}
							placeholder="Motivo do Afastamento"
							className={`w-full bg-white border border-gray-300 ${disabled ? 'text-gray-400' : 'text-gray-500'} rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500`}
						/>
					</div>

					{/* Documentos */}
					<div className="col-span-8">
						<label htmlFor="documentos" className="block text-base font-medium text-slate-600 mb-1">
            Documentos
						</label>
						<Dropzone initialFiles={data?.documentos} disabled={isSecretario ? checkEstado(data?.estado) : disabled} />
					</div>
				</div>

				<div>
					{(!(isSecretario ? checkEstado(data?.estado) : disabled) 
					|| (
						!!user?.professor?.mandato.length &&
						data?.estado === EstadoSolicitacao.INICIADO && 
						data.tipo === TipoAfastamento.INTERNACIONAL
					)) 
						&& (
							<button type="submit" className="bg-green-600 hover:opacity-80 text-white font-bold py-2 px-6 rounded mr-4">
								{data ? 'Salvar' : 'Solicitar Afastamento'}
							</button>
						)}

					<button type="button" onClick={() => {router.push('/afastamento');}} className="bg-slate-300 hover:opacity-70 text-slate-500 font-bold py-2 px-6 rounded">
            Fechar
					</button>
				</div>
			</form>
    
		</>

	);
};