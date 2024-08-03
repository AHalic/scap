import { compare, hash } from "bcrypt";

import { Pessoa } from "@prisma/client";

import {
	FiltrosPessoa,
	PessoaCompleta,
	TipoPessoa,
} from "../interfaces/Filtros";
import PessoaRepository from "../repositories/PessoaRepository";
import Errors from "./interfaces/Errors";
import { IPessoaService } from "./interfaces/IPessoaService";

export default class PessoaService implements IPessoaService {
	private readonly pessoaRepository: PessoaRepository;

	constructor(pessoaRepository: PessoaRepository = new PessoaRepository()) {
		this.pessoaRepository = pessoaRepository;
	}

	async buscarPorId(id: string, userId: string): Promise<Pessoa | null> {
		const pessoaReq = await this.pessoaRepository.getById(userId);

		if (!pessoaReq) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const pessoa = await this.pessoaRepository.getById(id);

		if (!pessoa) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return pessoa;
	}

	async buscar(filtros: FiltrosPessoa, userId: string): Promise<Pessoa[]> {
		const pessoaReq = await this.pessoaRepository.getById(userId);

		if (!pessoaReq) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const pessoas = await this.pessoaRepository.get(filtros, false);

		return pessoas.filter((pessoa) => {
			if (
				Number(filtros.tipo) === TipoPessoa.secretario &&
				pessoa.secretarioId
			) {
				return pessoa;
			} else if (
				Number(filtros.tipo) === TipoPessoa.professor &&
				pessoa.professorId
			) {
				return pessoa;
			}
		});
	}

	async criar(data: PessoaCompleta, userId: string): Promise<Pessoa> {
		const secretario = await this.pessoaRepository.getById(userId);

		if (!secretario) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!secretario.secretarioId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		return this.pessoaRepository.post({
			...data,
			senha: await hash(data.senha, 10),
		});
	}

	async editar(data: Pessoa, userId: string): Promise<Pessoa> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!pessoa.secretarioId && data?.id !== userId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		const pessoaEditada = await this.pessoaRepository.getById(data.id);

		if (!pessoaEditada) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		const { senha, ...rest } = data;
		const hasSenha =
			data?.id === userId && senha ? { senha: await hash(senha, 10) } : {};

		return this.pessoaRepository.put({
			...rest,
			...hasSenha,
		});
	}

	async deletar(id: string, userId: string): Promise<Pessoa> {
		const secretario = await this.pessoaRepository.getById(userId);

		if (!secretario) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!secretario.secretarioId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		const pessoaEditada = await this.pessoaRepository.getById(id);

		if (!pessoaEditada) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return this.pessoaRepository.delete(id);
	}

	async login(email: string, senha: string): Promise<Pessoa | null> {
		const pessoa = await this.pessoaRepository.get({ email } as FiltrosPessoa);

		if (pessoa.length === 0) {
			return null;
		}

		return compare(senha, pessoa[0].senha).then((result) => {
			if (!result) {
				return null;
			}
			return pessoa[0];
		});
	}
}

