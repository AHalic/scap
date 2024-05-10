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
}

