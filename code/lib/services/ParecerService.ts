import {
	EstadoSolicitacao,
	FonteParecer,
	Parecer,
	TipoAfastamento,
	TipoParecer,
} from "@prisma/client";

import { AfastamentoCompleto } from "../interfaces/Filtros";
import AfastamentoRepository from "../repositories/AfastamentoRepository";
import ParecerRepository from "../repositories/ParecerRepository";
import PessoaRepository from "../repositories/PessoaRepository";
import Errors from "./interfaces/Errors";
import { IParecerService } from "./interfaces/IParecerService";

export default class ParecerService implements IParecerService {
	private readonly parecerRepository: ParecerRepository;
	private readonly pessoaRepository: PessoaRepository;
	private readonly afastamentoRepository: AfastamentoRepository;

	constructor(
		parecerRepository: ParecerRepository = new ParecerRepository(),
		pessoaRepository: PessoaRepository = new PessoaRepository(),
		afastamentoRepository: AfastamentoRepository = new AfastamentoRepository()
	) {
		this.parecerRepository = parecerRepository;
		this.pessoaRepository = pessoaRepository;
		this.afastamentoRepository = afastamentoRepository;
	}

	async buscarPorId(id: string, userId: string): Promise<Parecer | null> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const parecer = await this.parecerRepository.getById(id);

		if (!parecer) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return parecer;
	}

	async criar(data: Parecer, userId: string): Promise<Parecer> {
		const professor = await this.pessoaRepository.getById(userId);

		if (!professor) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!professor.professorId && !professor.secretarioId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		} else if (professor.professorId && data.fonte !== FonteParecer.DI) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		} else if (professor.secretarioId && data.fonte === FonteParecer.DI) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		if (!data.fonte || !data.julgamento || !data.afastamentoId || !data.data) {
			return Promise.reject(new Error(Errors.CAMPO_OBRIGATORIO.toString()));
		}

		const afastamento = await this.afastamentoRepository.getById(
			data.afastamentoId
		);

		if (!afastamento) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		// Casos em que o o afastamento é internacional:
		// - O parecer é do relator
		// - O parecer é do secretário (CT e PRPPG)
		if (
			afastamento.tipo === TipoAfastamento.INTERNACIONAL &&
			afastamento.relatorId !== professor.professorId &&
			!professor.secretarioId
		) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		if (afastamento.solicitanteId === data.professorId) {
			return Promise.reject(new Error(Errors.DADO_INVALIDO.toString()));
		}

		const parecer = await this.parecerRepository.post(data);

		if (!parecer) {
			return parecer;
		}

		let estado;

		if (parecer.julgamento === TipoParecer.FAVORAVEL) {
			if (parecer.fonte === FonteParecer.DI)
				estado = EstadoSolicitacao.APROVADO_DI;

			if (parecer.fonte === FonteParecer.CT)
				estado = EstadoSolicitacao.APROVADO_CT;

			if (parecer.fonte === FonteParecer.PRPPG)
				estado = EstadoSolicitacao.APROVADO_PRPPG;
		} else if (parecer.julgamento === TipoParecer.DESFAVORAVEL) {
			estado = EstadoSolicitacao.REPROVADO;
		}

		const afastamentoEditado = await this.afastamentoRepository.put({
			id: parecer.afastamentoId,
			estado,
		} as AfastamentoCompleto);

		if (!afastamentoEditado) {
			return Promise.reject(new Error(Errors.ESTADO_INVALIDO.toString()));
		}

		return parecer;
	}

	async deletar(id: string, userId: string): Promise<Parecer> {
		const professor = await this.parecerRepository.getById(userId);

		if (!professor) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const parecerEditada = await this.parecerRepository.getById(id);

		if (!parecerEditada) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		if (professor.professorId !== parecerEditada.professorId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		return this.parecerRepository.delete(id);
	}
}

