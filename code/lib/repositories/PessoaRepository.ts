/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
import { Parentesco, Pessoa } from "@prisma/client";

import {
	FiltrosPessoa,
	PessoaCompleta,
	TipoPessoa,
} from "../interfaces/Filtros";
import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";

export default class PessoaRepository extends BaseRepository<
	Pessoa,
	FiltrosPessoa
> {
	async post(data: Pessoa): Promise<Pessoa> {
		const dataComTipo = data as PessoaCompleta;
		const nestedProf =
			Number(dataComTipo?.tipoPessoa) === TipoPessoa.professor
				? {
						professor: {
							create: {},
						},
					}
				: {};

		const nestedSecretario =
			Number(dataComTipo?.tipoPessoa) === TipoPessoa.secretario
				? {
						secretario: {
							create: {},
						},
					}
				: {};

		const pessoa = await prisma.pessoa.create({
			data: {
				email: data.email,
				nome: data.nome,
				telefone: data.telefone,
				senha: data.senha,
				...nestedProf,
				...nestedSecretario,
			},
		});

		if (dataComTipo?.professor?.parentescoA && pessoa.professorId !== null) {
			const parentescos = dataComTipo.professor.parentescoA.map((p) => ({
				tipo: p.tipo,
				professorAId: p.professorAId,
				professorBId: pessoa.professorId ? pessoa.professorId : "",
			}));

			try {
				for (const p of parentescos) {
					await prisma.parentesco.create({
						data: {
							tipo: p.tipo,
							professorA: {
								connect: {
									id: p.professorAId,
								},
							},
							professorB: {
								connect: {
									id: p.professorBId,
								},
							},
						},
					});

					await prisma.parentesco.create({
						data: {
							tipo: p.tipo,
							professorA: {
								connect: {
									id: p.professorBId,
								},
							},
							professorB: {
								connect: {
									id: p.professorAId,
								},
							},
						},
					});
				}
			} catch (error) {
				console.error("Error creating parentesco: ", error);
			}
		}

		return pessoa;
	}

	async put(data: Pessoa | any): Promise<Pessoa> {
		const dataComTipo = data as PessoaCompleta;

		const pessoa = await prisma.pessoa.update({
			where: { id: data.id },
			data: {
				email: data.email,
				nome: data.nome,
				telefone: data.telefone,
				senha: data.senha,
			},
		});

		if (
			Number(dataComTipo?.tipoPessoa) === TipoPessoa.professor &&
			data.professor?.parentescoA &&
			data.professor?.parentescoB
		) {
			const ids = data.professor.parentescoA
				.concat(data.professor.parentescoB)
				.map((p: Parentesco) => p.id);

			// Get the current parentescos from the database
			const currentParentescos = await prisma.parentesco.findMany({
				where: {
					OR: [
						{ professorAId: pessoa.professorId ?? "" },
						{ professorBId: pessoa.professorId ?? "" },
					],
				},
			});

			const parentescosToDelete = currentParentescos.filter(
				(p) => !ids.includes(p.id)
			);
			const parentescosToCreate = data.professor.parentescoA
				.concat(data.professor.parentescoB)
				.filter(
					(p: Parentesco) => !currentParentescos.find((cp) => cp.id === p.id)
				);

			// Delete the parentescos
			if (parentescosToDelete.length > 0) {
				await prisma.parentesco.deleteMany({
					where: {
						OR: parentescosToDelete.map((p) => ({
							OR: [
								{
									professorAId: p.professorAId,
									professorBId: p.professorBId,
								},
								{
									professorAId: p.professorBId,
									professorBId: p.professorAId,
								},
							],
						})),
					},
				});
			}

			// Create the parentescos
			if (parentescosToCreate.length > 0) {
				try {
					for (const p of parentescosToCreate) {
						await prisma.parentesco.create({
							data: {
								tipo: p.tipo,
								professorA: {
									connect: {
										id: p.professorAId,
									},
								},
								professorB: {
									connect: {
										id: p.professorBId,
									},
								},
							},
						});

						await prisma.parentesco.create({
							data: {
								tipo: p.tipo,
								professorA: {
									connect: {
										id: p.professorBId,
									},
								},
								professorB: {
									connect: {
										id: p.professorAId,
									},
								},
							},
						});
					}
				} catch (error) {
					console.error("Error creating parentesco: ", error);
				}
			}
		}

		return pessoa;
	}

	async delete(id: string): Promise<Pessoa> {
		const pessoa = await prisma.pessoa.delete({
			where: { id },
		});
		return pessoa;
	}

	async getById(id: string, selectPassword = true): Promise<Pessoa | null> {
		const pessoa = await prisma.pessoa.findUnique({
			where: { id },
			select: {
				professor: {
					select: {
						mandato: true,
						parentescoA: {
							select: {
								id: true,
								professorA: {
									select: {
										id: true,
										pessoa: true,
									},
								},
								tipo: true,
							},
						},
						parentescoB: {
							select: {
								id: true,
								professorA: {
									select: {
										id: true,
										pessoa: true,
									},
								},
								tipo: true,
							},
						},
					},
				},
				id: true,
				nome: true,
				email: true,
				telefone: true,
				secretarioId: true,
				professorId: true,
				senha: selectPassword ? true : undefined,
			},
		});
		return pessoa;
	}

	async get(filtros: FiltrosPessoa, selectPassword = true): Promise<Pessoa[]> {
		const pessoas = await prisma.pessoa.findMany({
			orderBy: {
				nome: "asc",
			},
			select: {
				professor: {
					select: {
						mandato: true,
						parentescoA: true,
					},
				},
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

