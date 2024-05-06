import axios from "axios";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import SolicitacaoPage from "@/components/afastamento/SolicitacaoPage";
import { Documento, Onus, TipoAfastamento } from "@prisma/client";


export default function AfastamentoSolicitacaoPage() {
	const router = useRouter();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	 
		const formData = new FormData(event.currentTarget);
		const nomeEvento = formData.get('nomeEvento') as string;
		const cidadeEvento = formData.get('cidadeEvento') as string;
		const tipo = formData.get('tipo') as TipoAfastamento;
		const onus = formData.get('onus') as Onus;
		const dataInicio = DateTime.fromISO(formData.get('dataInicio') as string).toISO();
		const dataFim = DateTime.fromISO(formData.get('dataFim') as string).toISO();
		const dataInicioEvento = DateTime.fromISO(formData.get('dataInicioEvento') as string).toISO();
		const dataFimEvento = DateTime.fromISO(formData.get('dataFimEvento') as string).toISO();
		const motivo = formData.get('motivo') as string;
		const documentos = JSON.parse(formData.get('documentos') as string);

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
			nomeEvento,
			tipo,
			onus,
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
		
		axios.post('/api/afastamento', body)
			.then(response => {
				toast('Solicitação de Afastamento realizada com sucesso', {
					type: 'success',
				});

				router.push(`/afastamento/solicitacao/${response.data.id}`);
			})
			.catch(error => {
				console.error(error);

				const message = error.response?.data?.message;
				toast(message ? message : 'Ocorreu um erro ao solicitar o Afastamento', {
					type: 'error',
				});
			});
	};

	return (
		<main>
			<SolicitacaoPage handleSubmit={handleSubmit} />
		</main>
	);
}