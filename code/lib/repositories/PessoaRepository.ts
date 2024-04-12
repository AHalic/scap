import { Pessoa } from "@prisma/client";

import { FiltrosPessoa, TipoPessoa } from "../interfaces/Filtros";
import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";

export default class PessoaRepository extends BaseRepository<
	Pessoa,
	FiltrosPessoa
> {
	async post(data: Pessoa): Promise<Pessoa> {
		const pessoa = await prisma.pessoa.create({
			data: data,
		});
		return pessoa;
	}

	async put(data: Pessoa): Promise<Pessoa> {
		const pessoa = await prisma.pessoa.update({
			where: { id: data.id },
			data: {
				senha: data.senha,
			},
		});
		return pessoa;
	}

	async delete(id: string): Promise<Pessoa> {
		const pessoa = await prisma.pessoa.delete({
			where: { id },
		});
		return pessoa;
	}

	async getById(id: string): Promise<Pessoa | null> {
		const pessoa = await prisma.pessoa.findUnique({
			where: { id },
		});
		return pessoa;
	}

	async get(filtros: FiltrosPessoa, selectPassword = true): Promise<Pessoa[]> {
		const pessoas = await prisma.pessoa.findMany({
			select: {
				id: true,
				nome: true,
				email: true,
				telefone: true,
				secretarioId: true,
				professorId: true,
				// if selectPassword is false, then do not select senha
				senha: selectPassword ? true : undefined,
			},
			where: {
				AND: [
					{
						OR: [
							{ nome: filtros.nome ? { contains: filtros.nome } : undefined },
						],
					},
					{ email: filtros.email ? { equals: filtros.email } : undefined },
					{
						telefone: filtros.telefone
							? { equals: filtros.telefone }
							: undefined,
					},
					// if pessoa.secretarioId is not null, then pessoa is a secretario
					// if pessoa.professorId is not null, then pessoa is a professor
					{
						secretarioId:
							filtros.tipo === TipoPessoa.secretario
								? { not: null }
								: undefined,
					},
					{
						professorId:
							filtros.tipo === TipoPessoa.professor ? { not: null } : undefined,
					},
				],
			},
		});
		return pessoas;
	}
}

