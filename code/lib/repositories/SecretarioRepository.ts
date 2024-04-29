/* eslint-disable indent */
import { Secretario } from "@prisma/client";

import { FiltrosPessoa } from "../interfaces/Filtros";
import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";

export default class SecretarioRepository extends BaseRepository<
	Secretario,
	FiltrosPessoa
> {
	async getById(id: string): Promise<Secretario | null> {
		const secretario = await prisma.secretario.findUnique({
			where: { id },
		});
		return secretario;
	}

	async delete(id: string): Promise<Secretario> {
		const secretario = await prisma.secretario.delete({
			where: { id },
		});
		return secretario;
	}
}

