import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ArrowTopRightOnSquareIcon,  TrashIcon} from "@heroicons/react/24/outline";
import { Pessoa } from "@prisma/client";

import { FiltrosPessoa } from "../../../lib/interfaces/Filtros";
import ConfirmModal from "../ConfirmModal";
import { LoadingCircle } from "../LoadingPage";



export default function TablePessoa({params, currentUser, type='pessoa', getId=(pessoa) => pessoa.id}:
	{params: FiltrosPessoa, currentUser?: Pessoa, type?: string, getId?: (pessoa: Pessoa) => string | null}) {
	const [data, setData] = useState<Pessoa[]>();
	const [loading, setLoading] = useState(true);
  
	const [confirmDelete, setConfirmDelete] = useState<null | string>();


	useEffect(() => {
		axios.get('/api/pessoa', { params })
			.then(response => {
				setData(response.data);
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
        
				const message = error.response?.data?.message;
				toast(message ? message : 'Ocorreu um erro ao buscar os Usuários', {
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
						<th className="px-4 py-2 w-1/2 border">Nome</th>
						<th className="px-4 py-2 w-1/4 border">Email</th>
						<th className="px-4 py-2 w-1/5 min-w-fit border">Telefone</th>
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

						data ? data.map((pessoa) => (
							<tr key={pessoa.id} className="bg-slate-50">
								<td className="px-4 py-2 border capitalize">{pessoa.nome}</td>
								<td className="px-4 py-2 border">
									{pessoa.email}
								</td>
								<td className="px-4 py-2 border">
									{pessoa.telefone}
								</td>
								<td className="py-2 border text-center space-x-3">
									{(pessoa.id === currentUser?.id || currentUser?.secretarioId) &&
									<Link href={`/pessoa/${pessoa.id}`}>
										<button  className="text-slate-600 hover:text-blue-800 h-full" title="Abrir Formulário">
											<ArrowTopRightOnSquareIcon className="w-5 h-6" />
										</button>
									</Link>
									}
  
									{
										currentUser?.secretarioId &&
										<button onClick={() => setConfirmDelete(getId(pessoa))} className="text-slate-600 hover:text-red-900 h-full" title="Deletar">
											<TrashIcon className="w-5 h-6" />
										</button>
									}
								</td>
							</tr>
						)) : (
							<tr>
								<td className="px-4 py-2 border" colSpan={7}>Nenhum usuário encontrado</td>
							</tr>
						))
					}
				</tbody>
			</table>

			<ConfirmModal
				open={!!confirmDelete}
				title="Deletar Usuário"
				message="Tem certeza que deseja deletar este usuário?"
				onConfirm={() => {
					axios.delete(`/api/${type}/${confirmDelete}`)
						.then(() => {
							if (type === 'secretario') {
								setData(data?.filter(pessoa => pessoa.secretarioId !== confirmDelete));
							} else if (type === 'professor') {
								setData(data?.filter(pessoa => pessoa.professorId !== confirmDelete));
							}

							setConfirmDelete(undefined);
							toast('Usuário deletado com sucesso', {
								type: 'success',
							});
						})
						.catch(error => {
							setConfirmDelete(undefined);
							console.error(error);
							const message = error.response?.data?.message;
							toast(message ? message : 'Ocorreu um erro ao deletar o Usuário', {
								type: 'error',
							});
						});
				}}
				onCancel={() => setConfirmDelete(undefined)}
			/>
		</>

	);
}