import { compare, hash } from "bcrypt";

import { Pessoa } from "@prisma/client";

import { FiltrosPessoa } from "../interfaces/Filtros";
import PessoaRepository from "../repositories/PessoaRepository";
import { IPessoaService } from "./interfaces/IPessoaService";

export default class PessoaService implements IPessoaService {
	private readonly pessoaRepository: PessoaRepository;

	constructor(pessoaRepository: PessoaRepository = new PessoaRepository()) {
		this.pessoaRepository = pessoaRepository;
	}

	async buscarPorId(id: string): Promise<Pessoa | null> {
		return this.pessoaRepository.getById(id);
	}

	async buscar(filtros: FiltrosPessoa): Promise<Pessoa[]> {
		return this.pessoaRepository.get(filtros);
	}

	async criar(data: Pessoa): Promise<Pessoa> {
		return this.pessoaRepository.post({
			...data,
			senha: await hash(data.senha, 10),
		});
	}

	async editar(data: Pessoa): Promise<Pessoa> {
		return this.pessoaRepository.put({
			...data,
			senha: await hash(data.senha, 10),
		});
	}

	async deletar(id: string): Promise<Pessoa> {
		return this.pessoaRepository.delete(id);
	}

	async login(email: string, senha: string): Promise<Pessoa | null> {
		const pessoa = await this.pessoaRepository.get({ email } as FiltrosPessoa);

		console.log(await hash("12345", 10));

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

