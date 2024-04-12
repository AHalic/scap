import { Afastamento } from "@prisma/client";

import { FiltrosAfastamento } from "../interfaces/Filtros";
import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";

export default class AfastamentoRepository extends BaseRepository<
	Afastamento,
	FiltrosAfastamento
> {
	async post(data: Afastamento): Promise<Afastamento> {
		const afastamento = await prisma.afastamento.create({
			data: data,
		});
		return afastamento;
	}

	async put(data: Afastamento): Promise<Afastamento> {
		const afastamento = await prisma.afastamento.update({
			where: { id: data.id },
			data: {
				motivo: data.motivo,
				estado: data.estado,
				dataInicio: data.dataInicio,
				dataFim: data.dataFim,
				dataInicioEvento: data.dataInicioEvento,
				dataFimEvento: data.dataFimEvento,
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
			},
			where: { id },
		});
		return afastamento;
	}

	async get(filtros: FiltrosAfastamento): Promise<Afastamento[]> {
		const afastamentos = await prisma.afastamento.findMany({
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

