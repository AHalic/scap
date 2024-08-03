/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */

import { Mandato } from "@prisma/client";

import { FiltrosMandato } from "../interfaces/Filtros";
import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";
import { IMandatoRepository } from "./interfaces/IMandatoRepository";

export default class MandatoRepository
	extends BaseRepository<Mandato, FiltrosMandato>
	implements IMandatoRepository
{
	async post(data: Mandato): Promise<Mandato> {
		const mandato = await prisma.mandato.create({
			data: {
				dataFim: data.dataFim || null,
				dataInicio: data.dataInicio,
				isChefe: data.isChefe,
				professor: {
					connect: {
						id: data.professorId,
					},
				},
			},
		});

		return mandato;
	}

	async put(data: Mandato | any): Promise<Mandato> {
		const mandato = await prisma.mandato.update({
			where: { id: data.id },
			data: {
				dataFim: data.dataFim,
			},
		});

		return mandato;
	}

	async delete(id: string): Promise<Mandato> {
		const mandato = await prisma.mandato.delete({
			where: { id },
		});
		return mandato;
	}

	async getById(id: string): Promise<Mandato | null> {
		const mandato = await prisma.mandato.findUnique({
			where: { id },
			select: {
				professor: {
					select: {
						pessoa: true,
					},
				},
				professorId: true,
				id: true,
				isChefe: true,
				dataInicio: true,
				dataFim: true,
			},
		});

		return mandato;
	}

	async get(filtros: FiltrosMandato): Promise<Mandato[]> {
		const mandatos = await prisma.mandato.findMany({
			orderBy: {
				dataInicio: "desc",
			},
			select: {
				professor: {
					select: {
						pessoa: true,
					},
				},
				professorId: true,
				id: true,
				isChefe: true,
				dataInicio: true,
				dataFim: true,
			},
			where: {
				AND: [
					{
						professorId: {
							equals: filtros.professorId ?? undefined,
						},
					},
					{
						isChefe: {
							equals: filtros.isChefe ?? undefined,
						},
					},
					{
						dataInicio: filtros.dataInicio
							? { gte: filtros.dataInicio }
							: undefined,
					},
					{
						dataFim: filtros.dataFim ? { lte: filtros.dataFim } : undefined,
					},
				],
			},
		});
		return mandatos;
	}

	async getLast(isChefe: boolean): Promise<Mandato | null> {
		const mandato = await prisma.mandato.findFirst({
			select: {
				professor: {
					select: {
						pessoa: true,
					},
				},
				professorId: true,
				id: true,
				isChefe: true,
				dataInicio: true,
				dataFim: true,
			},
			where: {
				AND: [
					{
						isChefe: {
							equals: isChefe,
						},
						dataFim: { equals: null },
					},
				],
			},
		});
		return mandato;
	}
}

