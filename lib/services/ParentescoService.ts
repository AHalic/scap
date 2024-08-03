import { Parentesco } from "@prisma/client";

import ParentescoRepository from "../repositories/ParentescoRepository";
import PessoaRepository from "../repositories/PessoaRepository";
import Errors from "./interfaces/Errors";
import { IParentescoService } from "./interfaces/IParentescoService";

export default class ParentescoService implements IParentescoService {
	private readonly parentescoRepository: ParentescoRepository;
	private readonly pessoaRepository: PessoaRepository;

	constructor(
		parentescoRepository: ParentescoRepository = new ParentescoRepository(),
		pessoaRepository: PessoaRepository = new PessoaRepository()
	) {
		this.parentescoRepository = parentescoRepository;
		this.pessoaRepository = pessoaRepository;
	}

	async criar(data: Parentesco, userId: string): Promise<Parentesco> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const { professorAId, professorBId } = data;

		const professorA = await this.pessoaRepository.getById(professorAId);

		if (!professorA || !professorA.professorId) {
			return Promise.reject(new Error(Errors.DADO_INVALIDO.toString()));
		}

		const professorB = await this.pessoaRepository.getById(professorBId);

		if (!professorB || !professorB.professorId) {
			return Promise.reject(new Error(Errors.DADO_INVALIDO.toString()));
		}

		return this.parentescoRepository.post(data);
	}

	async verificaParentesco(
		professor1Id: string,
		professor2Id: string,
		userId: string
	): Promise<boolean> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const professor1 = await this.pessoaRepository.getById(professor1Id);

		if (!professor1 || !professor1.professorId) {
			return Promise.reject(new Error(Errors.DADO_INVALIDO.toString()));
		}

		const professor2 = await this.pessoaRepository.getById(professor2Id);

		if (!professor2 || !professor2.professorId) {
			return Promise.reject(new Error(Errors.DADO_INVALIDO.toString()));
		}

		return this.parentescoRepository.verificaParentesco(
			professor1Id,
			professor2Id
		);
	}

	async deletar(id: string, userId: string): Promise<Parentesco> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const parentesco = await this.parentescoRepository.getById(id);

		if (!parentesco) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return this.parentescoRepository.delete(id);
	}

	async buscarPorId(id: string, userId: string): Promise<Parentesco | null> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const parentesco = await this.parentescoRepository.getById(id);

		if (!parentesco) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return parentesco;
	}
}

