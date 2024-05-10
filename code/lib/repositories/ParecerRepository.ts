/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Parecer } from "@prisma/client";

import { FiltrosAfastamento } from "../interfaces/Filtros";
import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";

export default class ParecerRepository extends BaseRepository<
	Parecer,
	FiltrosAfastamento
> {
	async post(data: Parecer): Promise<Parecer> {
		const professor = data.professorId
			? {
					professor: {
						connect: {
							id: data.professorId,
						},
					},
				}
			: {};

		const parecer = await prisma.parecer.create({
			data: {
				data: data.data,
				motivo: data.motivo,
				julgamento: data.julgamento,
				fonte: data.fonte,

				afastamento: {
					connect: {
						id: data.afastamentoId,
					},
				},
				...professor,
			},
		});
		return parecer;
	}

	async delete(id: string): Promise<Parecer> {
		const parecer = await prisma.parecer.delete({
			where: { id },
		});
		return parecer;
	}

	async getById(id: string): Promise<Parecer | null> {
		const parecer = await prisma.parecer.findUnique({
			include: {
				afastamento: true,
				professor: true,
			},
			where: { id },
		});
		return parecer;
	}
}

