import axios from "axios";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import SolicitacaoPage, { checkEstado } from "@/components/afastamento/SolicitacaoPage";
import { LoadingCircle } from "@/components/LoadingPage";
import { Documento, EstadoSolicitacao, Mandato, Pessoa } from "@prisma/client";

import { AfastamentoCompleto } from "../../../../lib/interfaces/Filtros";

export default function AfastamentoSolicitacaoPage()  {
	const [user, setUser] = useState<Pessoa & {mandato: Mandato}>();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<AfastamentoCompleto>();
	const router = useRouter();

	const { id } = router.query;

	const session = Cookies.get('session');
	const userId = session ? JSON.parse(session).id : undefined;

	useEffect(() => {
		if (userId){
			axios.get(`/api/pessoa/${userId}`)
				.then(response => {
					setUser(response.data);
				})
				.catch(error => {
					console.error(error);
					toast('Ocorreu um erro ao buscar o Usuário', {
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
					console.log(DateTime.fromISO(response.data.dataInicio).toFormat('yyyy-MM-dd'), response.data.dataInicio);
					
					setLoading(false);
					setData(response.data);
				})
				.catch(error => {
					setLoading(false);
					console.error(error);
					toast(error.message ? error.message : 'Ocorreu um erro ao buscar o Afastamento', {
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
		} else if (user?.mandato.isChefe && data?.estado === EstadoSolicitacao.INICIADO) {
			return false;
		} 
		
		return true;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	 
		const formData = new FormData(event.currentTarget);

		
		if (user?.secretarioId) {
			const estado = formData.get('estado') as EstadoSolicitacao;
			axios.put(`/api/afastamento/${id}`, { estado, id })
				.then(() => {
					toast('Afastamento atualizado com sucesso', {
						type: 'success',
					});
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

			const dataInicio = DateTime.fromISO(formData.get('dataInicio') as string).toISO();
			const dataFim = DateTime.fromISO(formData.get('dataFim') as string).toISO();
			const dataInicioEvento = DateTime.fromISO(formData.get('dataInicioEvento') as string).toISO();
			const dataFimEvento = DateTime.fromISO(formData.get('dataFimEvento') as string).toISO();
			const motivo = formData.get('motivo') as string;
			const documentos = JSON.parse(formData.get('documentos') as string);

			const body = {
				id,
				nomeEvento,
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
				})
				.catch(error => {
					console.error(error);
					const message = error.response?.data?.message;
					toast(message ? message : 'Ocorreu um erro ao atualizar o Afastamento', {
						type: 'error',
					});
				});
		} else if (user?.mandato.isChefe && data?.estado === EstadoSolicitacao.INICIADO) {
			const relator = formData.get('relator') as string;

			axios.put(`/api/afastamento/${id}`, { relator, id})
				.then(() => {
					toast('Afastamento atualizado com sucesso', {
						type: 'success',
					});
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
				loading && 
				<div className=" z-10 absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
					<LoadingCircle height="24" width="24" />
				</div>
			}

			<SolicitacaoPage data={data} handleSubmit={handleSubmit} disabled={checkIfDisabled()} isSecretario={!!user?.secretarioId} />
		</main>
	);
}