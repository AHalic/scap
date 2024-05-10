import ParentescoRepository from "../repositories/ParentescoRepository";
import PessoaRepository from "../repositories/PessoaRepository";
import Errors from "./interfaces/Errors";

export default class ParentescoService {
	private readonly parentescoRepository: ParentescoRepository;
	private readonly pessoaRepository: PessoaRepository;

	constructor(
		parentescoRepository: ParentescoRepository = new ParentescoRepository(),
		pessoaRepository: PessoaRepository = new PessoaRepository()
	) {
		this.parentescoRepository = parentescoRepository;
		this.pessoaRepository = pessoaRepository;
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
}

