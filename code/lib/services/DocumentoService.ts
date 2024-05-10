import { Documento } from "@prisma/client";

import DocumentoRepository from "../repositories/DocumentoRepository";
import PessoaRepository from "../repositories/PessoaRepository";
import Errors from "./interfaces/Errors";

export default class DocumentoService {
	private readonly documentoRepository: DocumentoRepository;
	private readonly pessoaRepository: PessoaRepository;

	constructor(
		documentoRepository: DocumentoRepository = new DocumentoRepository(),
		pessoaRepository: PessoaRepository = new PessoaRepository()
	) {
		this.documentoRepository = documentoRepository;
		this.pessoaRepository = pessoaRepository;
	}

	async buscarPorId(id: string, userId: string): Promise<Documento | null> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const documento = await this.documentoRepository.getById(id);

		if (!documento) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return documento;
	}

	async criar(data: Documento, userId: string): Promise<Documento> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		return this.documentoRepository.post({
			...data,
		});
	}

	async deletar(id: string, userId: string): Promise<Documento> {
		const pessoa = await this.pessoaRepository.getById(userId);

		if (!pessoa) {
			return Promise.reject(
				new Error(Errors.USUARIO_NAO_ENCONTRADO.toString())
			);
		}

		const documento = await this.documentoRepository.getById(id);

		if (!documento) {
			return Promise.reject(new Error(Errors.OBJETO_NAO_ENCONTRADO.toString()));
		}

		return this.documentoRepository.delete(id);
	}
}

