import {
	Afastamento,
	Documento,
	EstadoSolicitacao,
	Pessoa,
	TipoAfastamento,
} from "@prisma/client";

import {
	AfastamentoCompleto,
	FiltrosAfastamento,
	PessoaCompleta,
} from "../interfaces/Filtros";
import AfastamentoRepository from "../repositories/AfastamentoRepository";
import PessoaRepository from "../repositories/PessoaRepository";
import Errors from "./interfaces/Errors";

export default class AfastamentoService {
	private readonly afastamentoRepository: AfastamentoRepository;
	private readonly pessoaRepository: PessoaRepository;

	constructor(
		afastamentoRepository: AfastamentoRepository = new AfastamentoRepository(),
		pessoaRepository: PessoaRepository = new PessoaRepository()
	) {
		this.afastamentoRepository = afastamentoRepository;
		this.pessoaRepository = pessoaRepository;
	}

	async buscarPorId(id: string): Promise<Afastamento | null> {
		const afastamento = await this.afastamentoRepository.getById(id);

		if (!afastamento) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return afastamento;
	}

	async buscar(filtros: FiltrosAfastamento): Promise<Afastamento[]> {
		return this.afastamentoRepository.get(filtros);
	}

	async criar(data: Afastamento, userId: string): Promise<Afastamento> {
		const professor = await this.pessoaRepository.getById(userId);

		if (!professor) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!professor.professorId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		return this.afastamentoRepository.post({
			...data,
			solicitanteId: professor.professorId,
		} as AfastamentoCompleto);
	}

	async editar(
		data: Afastamento & {
			documentos: Documento[];
			relator: { pessoa: Pessoa };
		},
		userId: string
	): Promise<Afastamento> {
		const pessoa = (await this.pessoaRepository.getById(
			userId
		)) as PessoaCompleta;

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const afastamento = (await this.afastamentoRepository.getById(
			data.id
		)) as AfastamentoCompleto;
		if (
			afastamento?.solicitante?.pessoa?.id !== userId &&
			!pessoa.secretarioId &&
			!pessoa.professor?.mandato.length
		) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		if (!afastamento) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		if (
			afastamento.estado === EstadoSolicitacao.ARQUIVADO ||
			afastamento.estado === EstadoSolicitacao.CANCELADO ||
			afastamento.estado === EstadoSolicitacao.REPROVADO ||
			(data?.estado === EstadoSolicitacao.ARQUIVADO &&
				afastamento.estado !== EstadoSolicitacao.APROVADO_PRPPG) ||
			(afastamento.tipo === TipoAfastamento.NACIONAL &&
				data?.estado === EstadoSolicitacao.APROVADO_PRPPG) ||
			(afastamento.tipo === TipoAfastamento.NACIONAL &&
				data?.estado === EstadoSolicitacao.APROVADO_CT)
		) {
			return Promise.reject(new Error(Errors.ESTADO_INVALIDO.toString()));
		}

		if (pessoa.secretarioId) {
			return this.afastamentoRepository.put({
				estado: data.estado,
				id: data.id,
			} as AfastamentoCompleto);
		} else if (
			pessoa?.professor?.mandato.length &&
			pessoa?.professorId !== afastamento.solicitanteId
		) {
			if (afastamento.estado !== EstadoSolicitacao.INICIADO) {
				return Promise.reject(new Error(Errors.ESTADO_INVALIDO.toString()));
			}

			if (data.tipo === TipoAfastamento.INTERNACIONAL && !afastamento.relator) {
				return Promise.reject(new Error(Errors.CAMPO_OBRIGATORIO.toString()));
			}

			// TODO: adicionar validação de parentesco

			return this.afastamentoRepository.put({
				relatorId: data.relatorId,
				id: data.id,
				estado: EstadoSolicitacao.LIBERADO,
			} as AfastamentoCompleto);
		} else {
			if (data.estado !== EstadoSolicitacao.CANCELADO) {
				return Promise.reject(
					new Error(Errors.USUARIO_SEM_PERMISSAO.toString())
				);
			}

			return this.afastamentoRepository.put({
				id: data.id,
				nomeEvento: data.nomeEvento,
				motivo: data.motivo,
				dataInicio: data.dataInicio,
				dataFim: data.dataFim,
				dataInicioEvento: data.dataInicioEvento,
				dataFimEvento: data.dataFimEvento,
				documentos: data?.documentos,
				cidadeEvento: data.cidadeEvento,
				estado: data.estado,
			} as AfastamentoCompleto);
		}
	}

	async deletar(id: string, userId: string): Promise<Afastamento> {
		const professor = await this.pessoaRepository.getById(userId);

		if (!professor) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!professor.professorId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		const afastamento = (await this.afastamentoRepository.getById(
			id
		)) as AfastamentoCompleto;
		if (!afastamento) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		if (afastamento?.solicitante?.pessoa?.id !== userId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		return this.afastamentoRepository.delete(id);
	}
}

