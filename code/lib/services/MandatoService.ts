import { Mandato } from "@prisma/client";

import MandatoRepository from "../repositories/MandatoRepository";
import PessoaRepository from "../repositories/PessoaRepository";
import Errors from "./interfaces/Errors";
import { IMandatoService } from "./interfaces/IMandatoService";

export default class MandatoService implements IMandatoService {
	private readonly mandatoRepository: MandatoRepository;
	private readonly pessoaRepository: PessoaRepository;

	constructor(
		mandatoRepository: MandatoRepository = new MandatoRepository(),
		pessoaRepository: PessoaRepository = new PessoaRepository()
	) {
		this.mandatoRepository = mandatoRepository;
		this.pessoaRepository = pessoaRepository;
	}

	async buscarPorId(id: string, userId: string): Promise<Mandato | null> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const mandato = await this.mandatoRepository.getById(id);

		if (!mandato) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return mandato;
	}

	async criar(data: Mandato, userId: string): Promise<Mandato> {
		const secretario = await this.pessoaRepository.getById(userId);

		if (!secretario) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!secretario.secretarioId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		return this.mandatoRepository.post(data);
	}

	async editar(data: Mandato, userId: string): Promise<Mandato> {
		const mandato = await this.pessoaRepository.getById(userId);

		if (!mandato) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!mandato.secretarioId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		const mandatoEditado = await this.mandatoRepository.getById(data.id);

		if (!mandatoEditado) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		} else if (mandatoEditado.dataFim) {
			return Promise.reject(new Error(Errors.ESTADO_INVALIDO.toString()));
		}

		const { dataFim } = data;

		return this.mandatoRepository.put({
			dataFim,
		});
	}

	async deletar(id: string, userId: string): Promise<Mandato> {
		const secretario = await this.pessoaRepository.getById(userId);

		if (!secretario) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!secretario.secretarioId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		const mandatoEditada = await this.mandatoRepository.getById(id);

		if (!mandatoEditada) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return this.mandatoRepository.delete(id);
	}

	async buscaMandatoAtual(
		userId: string,
		isChefe: boolean
	): Promise<Mandato | null> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const mandato = await this.mandatoRepository.getLast(isChefe);

		if (!mandato) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return mandato;
	}
}

