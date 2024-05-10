/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Afastamento } from "@prisma/client";

import { AfastamentoCompleto, FiltrosAfastamento } from "../interfaces/Filtros";
import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";

export default class AfastamentoRepository extends BaseRepository<
	Afastamento,
	FiltrosAfastamento
> {
	async post(data: AfastamentoCompleto): Promise<Afastamento> {
		const { relator, solicitante, ...afastamentoData } = data;

		const afastamento = await prisma.afastamento.create({
			data: {
				...afastamentoData,
				pareceres: undefined,
				documentos: {
					create: data.documentos,
				},
			},
		});
		return afastamento;
	}

	async put(data: AfastamentoCompleto): Promise<Afastamento> {
		// only properties of data that are different than undefined
		const relator = data.relatorId
			? {
					relator: {
						connect: { id: data.relatorId },
					},
				}
			: {};

		// only documents that are not already in the database aka dont have an id
		const documentsToCreate = data.documentos
			? data.documentos.filter((d) => !d.id)
			: [];

		const afastamento = await prisma.afastamento.update({
			where: { id: data.id },
			data: {
				estado: data.estado,
				nomeEvento: data.nomeEvento,
				motivo: data.motivo,
				dataInicio: data.dataInicio,
				dataFim: data.dataFim,
				dataInicioEvento: data.dataInicioEvento,
				dataFimEvento: data.dataFimEvento,
				cidadeEvento: data.cidadeEvento,
				...relator,
				documentos: {
					deleteMany: {
						AND: {
							id: {
								notIn: data?.documentos?.map((d) => d.id).filter(Boolean),
							},
							afastamentoId: data.id,
						},
					},
					createMany: {
						data: documentsToCreate,
					},
				},
			},
		});

		return afastamento;
	}

	async delete(id: string): Promise<Afastamento> {
		const afastamento = await prisma.afastamento.delete({
			where: { id },
		});
		return afastamento;
	}

	async getById(id: string): Promise<Afastamento | null> {
		const afastamento = await prisma.afastamento.findUnique({
			include: {
				documentos: true,
				solicitante: {
					include: {
						pessoa: {
							select: {
								id: true,
								nome: true,
								email: true,
								secretarioId: true,
								professorId: true,
							},
						},
					},
				},
				relator: {
					include: {
						pessoa: {
							select: {
								id: true,
								nome: true,
								email: true,
								professorId: true,
							},
						},
					},
				},
			},
			where: { id },
		});
		return afastamento;
	}

	async get(filtros: FiltrosAfastamento): Promise<Afastamento[]> {
		const afastamentos = await prisma.afastamento.findMany({
			orderBy: {
				dataSolicitacao: "desc",
			},
			include: {
				solicitante: {
					include: {
						pessoa: {
							select: {
								id: true,
								nome: true,
								email: true,
								secretarioId: true,
								professorId: true,
							},
						},
					},
				},
				relator: {
					include: {
						pessoa: {
							select: {
								id: true,
								nome: true,
								email: true,
								professorId: true,
							},
						},
					},
				},
			},
			where: {
				AND: [
					{ estado: filtros.estado ? { equals: filtros.estado } : undefined },
					{ onus: filtros.onus ? { equals: filtros.onus } : undefined },
					{
						dataSolicitacao: filtros.dataSolicitacao
							? { equals: filtros.dataSolicitacao }
							: undefined,
					},
					{
						dataInicio: filtros.dataInicio
							? { gte: filtros.dataInicio }
							: undefined,
					},
					{
						dataFim: filtros.dataFim ? { lte: filtros.dataFim } : undefined,
					},
					{
						dataInicioEvento: filtros.dataInicioEvento
							? { gte: filtros.dataInicioEvento }
							: undefined,
					},
					{
						dataFimEvento: filtros.dataFimEvento
							? { lte: filtros.dataFimEvento }
							: undefined,
					},
					{
						OR: [
							{
								solicitante: {
									pessoa: {
										nome: filtros.solicitante
											? { contains: filtros.solicitante }
											: undefined,
									},
								},
							},
						],
					},
					{ tipo: filtros.tipo ? { equals: filtros.tipo } : undefined },
				],
			},
		});

		return afastamentos;
	}
}

