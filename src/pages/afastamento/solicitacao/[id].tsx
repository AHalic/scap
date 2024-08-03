import axios from "axios";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import SolicitacaoPage, { checkEstado } from "@/components/afastamento/SolicitacaoPage";
import { LoadingCircle } from "@/components/LoadingPage";
import { Documento, EstadoSolicitacao } from "@prisma/client";

import { AfastamentoCompleto, PessoaCompleta } from "../../../../lib/interfaces/Filtros";

export default function AfastamentoSolicitacaoPage()  {
	const [user, setUser] = useState<PessoaCompleta>();
	const [data, setData] = useState<AfastamentoCompleto>();
	const [loading, setLoading] = useState(true);
	const [loadingUser, setLoadingUser] = useState(true);
	
	const router = useRouter();

	const { id } = router.query;

	const session = Cookies.get('session');
	const userId = session ? JSON.parse(session).id : undefined;

	useEffect(() => {
		if (userId) {
			setLoadingUser(true);
			axios.get(`/api/pessoa/${userId}`)
				.then(response => {
					setLoadingUser(false);
					setUser(response.data);
				})
				.catch(error => {
					console.error(error);
					setLoadingUser(false);
					
					const message = error.response?.data?.message;

					toast(message ? message : 'Ocorreu um erro ao buscar o Usuário', {
						type: 'error',
					});
				});
		} 
	}, [userId]);


	useEffect(() => {
		if (id) {
			setLoading(true);
			axios.get(`/api/afastamento/${id}`)
				.then(response => {
					setLoading(false);
					setData(response.data);
				})
				.catch(error => {
					setLoading(false);
					console.error(error);

					const message = error.response?.data?.message;
					toast(message ? message : 'Ocorreu um erro ao buscar o Afastamento', {
						type: 'error',
					});
				});
		}
	}, [id]);

	const checkIfDisabled = () => {
		if (user?.secretarioId) {
			return true;
		} else if (user?.professorId === data?.solicitanteId && !checkEstado(data?.estado)) {
			return false;
		} 
		
		return true;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	 
		const formData = new FormData(event.currentTarget);

		
		if (user?.secretarioId) {
			const estado = formData.get('estado') as EstadoSolicitacao;
			const documentos = JSON.parse(formData.get('documentos') as string);

			const body = {
				id,
				estado,
				documentos: documentos.map((d: Documento) => ({
					titulo: d.titulo,
					url: d.url,
				})),
			};

			axios.put(`/api/afastamento/${id}`, body)
				.then(() => {
					toast('Afastamento atualizado com sucesso', {
						type: 'success',
					});

					router.reload();
				})
				.catch(error => {
					console.error(error);
					const message = error.response?.data?.message;
					toast(message ? message : 'Ocorreu um erro ao atualizar o Afastamento', {
						type: 'error',
					});
				});
		} else if (user?.professorId === data?.solicitanteId) {
			const nomeEvento = formData.get('nomeEvento') as string;
			const cidadeEvento = formData.get('cidadeEvento') as string;

			const dataInicio = DateTime.fromISO(formData.get('dataInicio') as string).toISO();
			const dataFim = DateTime.fromISO(formData.get('dataFim') as string).toISO();
			const dataInicioEvento = DateTime.fromISO(formData.get('dataInicioEvento') as string).toISO();
			const dataFimEvento = DateTime.fromISO(formData.get('dataFimEvento') as string).toISO();
			const motivo = formData.get('motivo') as string;
			const documentos = JSON.parse(formData.get('documentos') as string);

			// Verifica se as datas de fim são maiores que as datas de início
			if ((dataFim && dataInicio && DateTime.fromISO(dataFim) < DateTime.fromISO(dataInicio)) ||
				(dataFimEvento && dataInicioEvento && DateTime.fromISO(dataFimEvento) < DateTime.fromISO(dataInicioEvento))){
				toast('Datas de Fim devem ser maiores que as respectivas Datas de Início', {
					type: 'error',
				});
				return;
			}

			// Verifica se as datas do evento estão dentro do intervalo de afastamento
			if ((dataInicioEvento && dataInicio && DateTime.fromISO(dataInicioEvento) < DateTime.fromISO(dataInicio)) ||
				(dataFimEvento && dataFim && DateTime.fromISO(dataFimEvento) > DateTime.fromISO(dataFim))){
				toast('Datas do Evento devem estar dentro do intervalo de afastamento', {
					type: 'error',
				});
				return;
			}

			const body = {
				id,
				nomeEvento,
				cidadeEvento,
				dataInicio,
				dataFim,
				dataInicioEvento,
				dataFimEvento,
				motivo,
				documentos: documentos.map((d: Documento) => ({
					titulo: d.titulo,
					url: d.url,
				})),
			};

			axios.put(`/api/afastamento/${id}`, body)
				.then(() => {
					toast('Afastamento atualizado com sucesso', {
						type: 'success',
					});

					router.reload();
				})
				.catch(error => {
					console.error(error);
					const message = error.response?.data?.message;
					toast(message ? message : 'Ocorreu um erro ao atualizar o Afastamento', {
						type: 'error',
					});
				});
		} else if (user?.professor?.mandato.length && data?.estado === EstadoSolicitacao.INICIADO) {
			const relatorId = formData.get('relatorId') as string;

			axios.put(`/api/afastamento/${id}`, { relatorId, id})
				.then(() => {
					toast('Afastamento atualizado com sucesso', {
						type: 'success',
					});

					router.reload();
				})
				.catch(error => {
					console.error(error);
					const message = error.response?.data?.message;
					toast(message ? message : 'Ocorreu um erro ao atualizar o Afastamento', {
						type: 'error',
					});
				});
		} else {
			toast('Você não tem permissão para editar este Afastamento', {
				type: 'error',
			});
		}
	};

	return (
		<main>
			{
				(loading || loadingUser) && 
				<div className=" z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
					<LoadingCircle height="24" width="24" />
				</div>
			}

			<SolicitacaoPage 
				data={data}
				handleSubmit={handleSubmit}
				disabled={checkIfDisabled()}
				isSecretario={!!user?.secretarioId}
				user={user} />
		</main>
	);
}