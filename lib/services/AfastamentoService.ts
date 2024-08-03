import { DateTime } from "luxon";

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
import ParentescoRepository from "../repositories/ParentescoRepository";
import PessoaRepository from "../repositories/PessoaRepository";
import Errors from "./interfaces/Errors";
import { IAfastamentoService } from "./interfaces/IAfastamentoService";

export default class AfastamentoService implements IAfastamentoService {
	private readonly afastamentoRepository: AfastamentoRepository;
	private readonly pessoaRepository: PessoaRepository;
	private readonly parentescoRepository: ParentescoRepository;

	constructor(
		afastamentoRepository: AfastamentoRepository = new AfastamentoRepository(),
		pessoaRepository: PessoaRepository = new PessoaRepository(),
		parentescoRepository: ParentescoRepository = new ParentescoRepository()
	) {
		this.afastamentoRepository = afastamentoRepository;
		this.pessoaRepository = pessoaRepository;
		this.parentescoRepository = parentescoRepository;
	}

	async buscarPorId(id: string, userId: string): Promise<Afastamento | null> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const afastamento = await this.afastamentoRepository.getById(id);

		if (!afastamento) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return afastamento;
	}

	async buscar(
		filtros: FiltrosAfastamento,
		userId: string
	): Promise<Afastamento[]> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

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
			afastamento?.solicitanteId !== pessoa.professorId &&
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
				data?.estado === EstadoSolicitacao.APROVADO_CT) ||
			(afastamento.tipo === TipoAfastamento.NACIONAL &&
				data?.estado === EstadoSolicitacao.LIBERADO) ||
			(afastamento.tipo === TipoAfastamento.INTERNACIONAL &&
				data?.estado === EstadoSolicitacao.BLOQUEADO)
		) {
			return Promise.reject(new Error(Errors.ESTADO_INVALIDO.toString()));
		}

		if (
			afastamento.estado === EstadoSolicitacao.LIBERADO &&
			data.estado === EstadoSolicitacao.REPROVADO
		) {
			data.estado = EstadoSolicitacao.BLOQUEADO;
		}

		if (pessoa.secretarioId) {
			if (
				afastamento.tipo === TipoAfastamento.INTERNACIONAL &&
				!afastamento.relatorId &&
				data.estado !== EstadoSolicitacao.LIBERADO
			) {
				return Promise.reject(new Error(Errors.CAMPO_OBRIGATORIO.toString()));
			}

			// se ainda não completaram 10 dias da data de solicitação, não é possível aprovar
			if (
				afastamento.tipo === TipoAfastamento.NACIONAL &&
				data.estado === EstadoSolicitacao.APROVADO_DI &&
				afastamento.dataSolicitacao &&
				DateTime.now().diff(DateTime.fromJSDate(afastamento.dataSolicitacao))
					.days > 10
			) {
				return Promise.reject(new Error(Errors.ESTADO_INVALIDO.toString()));
			}

			return this.afastamentoRepository.put({
				estado: data.estado,
				id: data.id,
				documentos: data?.documentos,
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

			if (data.relatorId === afastamento.solicitanteId) {
				return Promise.reject(new Error(Errors.DADO_INVALIDO.toString()));
			}

			const parentesco = await this.parentescoRepository.verificaParentesco(
				afastamento.solicitanteId,
				data.relatorId as string
			);

			console.log(parentesco, afastamento.solicitanteId, data.relatorId);

			if (parentesco) {
				return Promise.reject(
					new Error(Errors.PARENTE_NAO_ENCONTRADO.toString())
				);
			}

			return this.afastamentoRepository.put({
				relatorId: data.relatorId,
				id: data.id,
				estado: EstadoSolicitacao.LIBERADO,
			} as AfastamentoCompleto);
		} else {
			if (
				data.estado &&
				afastamento.estado !== data.estado &&
				data.estado !== EstadoSolicitacao.CANCELADO
			) {
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

