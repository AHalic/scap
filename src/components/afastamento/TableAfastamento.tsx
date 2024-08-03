import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ArrowTopRightOnSquareIcon, XCircleIcon} from "@heroicons/react/24/outline";
import { EstadoSolicitacao, Pessoa, TipoAfastamento } from "@prisma/client";

import { AfastamentoCompleto, FiltrosAfastamento, estadoAfastamentoColors } from "../../../lib/interfaces/Filtros";
import Chip from "../Chip";
import ConfirmModal from "../ConfirmModal";
import { LoadingCircle } from "../LoadingPage";


const tipoAfastamentoColors = {
	[TipoAfastamento.NACIONAL]: { tipo: TipoAfastamento.NACIONAL, color: "gray" },
	[TipoAfastamento.INTERNACIONAL]: { tipo: TipoAfastamento.INTERNACIONAL, color: "stone" },
};


export default function TableAfastamento({params, currentUser}: {params: FiltrosAfastamento, currentUser?: Pessoa}) {
	const [confirmCancel, setConfirmCancel] = useState<undefined | string>();
	const [data, setData] = useState<AfastamentoCompleto[]>();
	const [loading, setLoading] = useState(true);

	const router = useRouter();
    

	useEffect(() => {
		axios.get('/api/afastamento', { params })
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
						data && data.length > 0 ? data.map((afastamento) => (
							<tr key={afastamento.id} className="bg-slate-50">
								<td className="px-4 py-2 border capitalize">{afastamento.solicitante.pessoa.nome}</td>
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
									<Link href={`/afastamento/solicitacao/${afastamento.id}`}>
										<button  className="text-slate-600 hover:text-blue-800 h-full" title="Abrir Formulário">
											<ArrowTopRightOnSquareIcon className="w-5 h-6" />
										</button>
									</Link>
  
									{
										afastamento.solicitante.pessoa.id === currentUser?.id &&
										afastamento.estado !== EstadoSolicitacao.CANCELADO &&
										afastamento.estado !== EstadoSolicitacao.REPROVADO &&
										afastamento.estado !== EstadoSolicitacao.ARQUIVADO &&
										<button onClick={() => setConfirmCancel(afastamento.id)} className="text-slate-600 hover:text-red-900 h-full" title="Cancelar">
											<XCircleIcon className="w-5 h-6" />
										</button>
									}
								</td>
							</tr>
						)) : (
							<tr>
								<td className="px-4 py-2 border text-center" colSpan={7}>Nenhum afastamento encontrado</td>
							</tr>
						))
					}
				</tbody>
			</table>

			<ConfirmModal
				open={!!confirmCancel}
				hasInput
				title="Cancelar Afastamento"
				message="Tem certeza que deseja cancelar este afastamento?"
				onConfirm={(inputRef) => {
					axios.put(`/api/afastamento/${confirmCancel}`, { estado: EstadoSolicitacao.CANCELADO,
						motivo: inputRef?.current?.value,
						id: confirmCancel})
						.then(() => {
							router.reload();
							setConfirmCancel(undefined);
							toast('Afastamento Cancelado com sucesso', {
								type: 'success',
							});
						})
						.catch(error => {
							setConfirmCancel(undefined);
							console.error(error);
							const message = error.response?.data?.message;
							toast(message ? message : 'Ocorreu um erro ao cancelar o Afastamento', {
								type: 'error',
							});
						});
				}}
				onCancel={() => setConfirmCancel(undefined)}
			/>
		</>

	);
}