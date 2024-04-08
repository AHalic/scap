import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { ArrowTopRightOnSquareIcon,  TrashIcon} from "@heroicons/react/24/outline";
import { Afastamento, Pessoa, TipoAfastamento, EstadoSolicitacao } from "@prisma/client";

import Chip from "../Chip";
import ConfirmModal from "../ConfirmModal";
import { LoadingCircle } from "../LoadingPage";

import 'react-toastify/dist/ReactToastify.css';


type AfastamentoWithSolicitante = Afastamento & {
  solicitante: {
    id: string;
    pessoa: Pessoa
  };
};

const tipoAfastamentoColors = {
	[TipoAfastamento.NACIONAL]: { tipo: TipoAfastamento.NACIONAL, color: "gray" },
	[TipoAfastamento.INTERNACIONAL]: { tipo: TipoAfastamento.INTERNACIONAL, color: "stone" },
};

const estadoAfastamentoColors = {
	[EstadoSolicitacao.INICIADO]: { estado: EstadoSolicitacao.INICIADO, color: "indigo" },
	[EstadoSolicitacao.BLOQUEADO]: { estado: EstadoSolicitacao.BLOQUEADO, color: "yellow" },
	[EstadoSolicitacao.LIBERADO]: { estado: EstadoSolicitacao.LIBERADO, color: "teal" },
	[EstadoSolicitacao.APROVADO_DI]: { estado: EstadoSolicitacao.APROVADO_DI, color: "blue" },
	[EstadoSolicitacao.APROVADO_CT]: { estado: EstadoSolicitacao.APROVADO_CT, color: "cyan" },
	[EstadoSolicitacao.APROVADO_PRPPG]: { estado: EstadoSolicitacao.APROVADO_PRPPG, color: "sky" },
	[EstadoSolicitacao.ARQUIVADO]: { estado: EstadoSolicitacao.ARQUIVADO, color: "green" },
	[EstadoSolicitacao.CANCELADO]: { estado: EstadoSolicitacao.CANCELADO, color: "zinc" },
	[EstadoSolicitacao.REPROVADO]: { estado: EstadoSolicitacao.REPROVADO, color: "red" },
};


export default function TableAfastamento() {
	const [data, setData] = useState<AfastamentoWithSolicitante[]>();
	const [params, setParams] = useState({});
	const [loading, setLoading] = useState(true);
  
	const session = Cookies.get('session');
	const userId = session ? JSON.parse(session).id : undefined;
  
	const [confirmDelete, setConfirmDelete] = useState<undefined | string>();
    

	useEffect(() => {
		axios.get('/api/afastamento')
			.then(response => {
				setData(response.data);
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
        
				const message = error.response?.data?.message;
				toast(message ? message : 'Ocorreu um erro ao buscar os Afastamentos', {
					type: 'error',
				});
				setLoading(false);
				setData([]);
			});
	}, [params]);


	return (
		<>
			<table className="w-full table-auto text-slate-700 border-collapse">
				<thead>
					<tr className="text-left bg-slate-300">
						<th className="px-4 py-2 w-1/6 border">Solicitante</th>
						<th className="px-4 py-2 w-1/3 border">Evento</th>
						<th className="px-4 py-2 w-1/12 min-w-fit border">Tipo</th>
						<th className="px-4 py-2 w-1/6  min-w-fit border">Estado Solicitação</th>
						<th className="px-4 py-2 w-1/12 border">Data Início</th>
						<th className="px-4 py-2 w-1/12 border">Data Fim</th>
						<th className="px-4 py-2 w-fit border">Ações</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr className="h-32">
							<td className="px-4 py-2 border text-center" colSpan={7}>
								<LoadingCircle height="16" width="16"/>
							</td>
						</tr>
					): (

						data ? data.map((afastamento) => (
							<tr key={afastamento.id} className="bg-slate-50">
								<td className="px-4 py-2 border capitalize">{afastamento.solicitante.pessoa.nome} {afastamento.solicitante.pessoa.sobrenome}</td>
								<td className="px-4 py-2 border">
									{afastamento.nomeEvento}
								</td>
								<td className="px-4 py-2 border capitalize">
									<Chip color={tipoAfastamentoColors[afastamento.tipo].color}>{afastamento.tipo}</Chip>
								</td>
								<td className="px-4 py-2 border">
									<Chip color={estadoAfastamentoColors[afastamento.estado].color}>{afastamento.estado}</Chip>
								</td>
								<td className="px-4 py-2 border">{new Date(afastamento.dataInicio).toLocaleDateString('pt-BR')}</td>
								<td className="px-4 py-2 border">{new Date(afastamento.dataFim).toLocaleDateString('pt-BR')}</td>
								<td className="py-2 border text-center space-x-3">
									<Link href={`/afastamento/${afastamento.id}`}>
										<button  className="text-slate-600 hover:text-blue-800 h-full" title="Abrir Formulário">
											<ArrowTopRightOnSquareIcon className="w-5 h-6" />
										</button>
									</Link>
  
									{
										afastamento.solicitante.pessoa.id === userId &&
										<button onClick={() => setConfirmDelete(afastamento.id)} className="text-slate-600 hover:text-red-900 h-full" title="Deletar">
											<TrashIcon className="w-5 h-6" />
										</button>
									}
								</td>
							</tr>
						)) : (
							<tr>
								<td className="px-4 py-2 border" colSpan={7}>Nenhum afastamento encontrado</td>
							</tr>
						))
					}
				</tbody>
			</table>

			<ConfirmModal
				open={!!confirmDelete}
				title="Deletar Afastamento"
				message="Tem certeza que deseja deletar este afastamento?"
				onConfirm={() => {
					axios.delete(`/api/afastamento/${confirmDelete}`)
						.then(() => {
							setParams({});
							setConfirmDelete(undefined);
							toast('Afastamento deletado com sucesso', {
								type: 'success',
							});
						})
						.catch(error => {
							console.error(error);
							const message = error.response?.data?.message;
							toast(message ? message : 'Ocorreu um erro ao deletar o Afastamento', {
								type: 'error',
							});
						});
				}}
				onCancel={() => setConfirmDelete(undefined)}
			/>
			<ToastContainer />
		</>

	);
}