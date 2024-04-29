import { Professor } from "@prisma/client";

import PessoaRepository from "../repositories/PessoaRepository";
import ProfessorRepository from "../repositories/ProfessorRepository";
import Errors from "./interfaces/Errors";

export default class ProfessorService {
	private readonly professorRepository: ProfessorRepository;
	private readonly pessoaRepository: PessoaRepository;

	constructor(
		professorRepository: ProfessorRepository = new ProfessorRepository(),
		pessoaRepository: PessoaRepository = new PessoaRepository()
	) {
		this.professorRepository = professorRepository;
		this.pessoaRepository = pessoaRepository;
	}

	async deletar(id: string, userId: string): Promise<Professor> {
		const secretario = await this.pessoaRepository.getById(userId);

		if (!secretario) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		} else if (!secretario.secretarioId) {
			return Promise.reject(new Error(Errors.USUARIO_SEM_PERMISSAO.toString()));
		}

		const professorEditado = await this.professorRepository.getById(id);

		if (!professorEditado) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return this.professorRepository.delete(id);
	}
}

