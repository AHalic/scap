/* eslint-disable @typescript-eslint/no-explicit-any */

import { Parentesco } from "@prisma/client";

import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";
import { IParentescoRepository } from "./interfaces/IParentescoRepository";

export default class ParentescoRepository
	extends BaseRepository<Parentesco, any>
	implements IParentescoRepository
{
	async verificaParentesco(
		professor1: string,
		professor2: string
	): Promise<boolean> {
		const parentesco = await prisma.parentesco.findFirst({
			where: {
				OR: [
					{ professorAId: professor1, professorBId: professor2 },
					{ professorAId: professor2, professorBId: professor1 },
				],
			},
		});
		return !!parentesco;
	}

	async post(data: Parentesco): Promise<Parentesco> {
		const parentesco = await prisma.parentesco.create({
			data: {
				tipo: data.tipo,
				professorA: {
					connect: {
						id: data.professorAId,
					},
				},
				professorB: {
					connect: {
						id: data.professorBId,
					},
				},
			},
		});

		await prisma.parentesco.create({
			data: {
				tipo: data.tipo,
				professorA: {
					connect: {
						id: data.professorBId,
					},
				},
				professorB: {
					connect: {
						id: data.professorAId,
					},
				},
			},
		});

		return parentesco;
	}

	async delete(id: string): Promise<Parentesco> {
		return prisma.parentesco.delete({
			where: {
				id: id,
			},
		});
	}

	async getById(id: string): Promise<Parentesco | null> {
		return prisma.parentesco.findUnique({
			where: {
				id: id,
			},
		});
	}
}

