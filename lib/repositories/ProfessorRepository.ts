/* eslint-disable indent */
import { Professor } from "@prisma/client";

import { FiltrosPessoa } from "../interfaces/Filtros";
import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";

export default class ProfessorRepository extends BaseRepository<
	Professor,
	FiltrosPessoa
> {
	async getById(id: string): Promise<Professor | null> {
		const professor = await prisma.professor.findUnique({
			where: { id },
		});
		return professor;
	}

	async delete(id: string): Promise<Professor> {
		const professor = await prisma.professor.delete({
			where: { id },
		});
		return professor;
	}
}

