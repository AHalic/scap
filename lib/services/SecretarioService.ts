import { Secretario } from "@prisma/client";

import PessoaRepository from "../repositories/PessoaRepository";
import SecretarioRepository from "../repositories/SecretarioRepository";
import Errors from "./interfaces/Errors";

export default class SecretarioService {
	private readonly secretarioRepository: SecretarioRepository;
	private readonly pessoaRepository: PessoaRepository;

	constructor(
		secretarioRepository: SecretarioRepository = new SecretarioRepository(),
		pessoaRepository: PessoaRepository = new PessoaRepository()
	) {
		this.secretarioRepository = secretarioRepository;
		this.pessoaRepository = pessoaRepository;
	}

	async deletar(id: string, userId: string): Promise<Secretario> {
		const secretario = await this.pessoaRepository.getById(userId);

		if (!secretario) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!secretario.secretarioId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		const secretarioEditado = await this.secretarioRepository.getById(id);

		if (!secretarioEditado) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return this.secretarioRepository.delete(id);
	}
}

