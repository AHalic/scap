import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { Afastamento, Pessoa, TipoAfastamento, EstadoSolicitacao } from "@prisma/client";

import 'react-toastify/dist/ReactToastify.css';
import Chip from "../Chip";

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

	useEffect(() => {
		axios.get('/api/afastamento')
			.then(response => {
				setData(response.data);
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
				toast('Ocorreu um erro ao carregar os dados', {
					type: 'error',
				});
				setLoading(false);
				setData([]);
			});
	}, [params]);


	return (
		<>
			<table className="w-full table-auto text-slate-800 border-collapse">
				<thead>
					<tr className="text-left bg-slate-300">
						<th className="px-4 py-2 border">Solicitante</th>
						<th className="px-4 py-2 border">Evento</th>
						<th className="px-4 py-2 border">Tipo</th>
						<th className="px-4 py-2 border">Estado Solicitação</th>
						<th className="px-4 py-2 border">Data Início</th>
						<th className="px-4 py-2 border">Data Fim</th>
					</tr>
				</thead>
				<tbody>
					{data ? data.map((afastamento) => (
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
						</tr>
					)) : (
						<tr>
							<td className="px-4 py-2 border" colSpan={6}>Nenhum afastamento encontrado</td>
						</tr>
					)}
				</tbody>
			</table>

			<ToastContainer />
		</>

	);
}