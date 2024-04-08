import { Afastamento } from "@prisma/client";

import { FiltrosAfastamento } from "../interfaces/Filtros";
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

		return this.afastamentoRepository.post(data);
	}

	async editar(data: Afastamento, userId: string): Promise<Afastamento> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}
		if (data.solicitanteId !== userId && !pessoa.secretarioId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		const afastamento = await this.afastamentoRepository.getById(data.id);
		if (!afastamento) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return this.afastamentoRepository.put(data);
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

		const afastamento = await this.afastamentoRepository.getById(id);
		if (!afastamento) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		if (afastamento.solicitanteId !== userId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		return this.afastamentoRepository.delete(id);
	}
}

