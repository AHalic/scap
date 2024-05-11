import { Parentesco } from "@prisma/client";

export interface IParentescoService {
	verificaParentesco(
		professor1Id: string,
		professor2Id: string,
		userId: string
	): Promise<boolean>;
	criar(data: Parentesco, userId: string): Promise<Parentesco>;
	deletar(id: string, userId: string): Promise<Parentesco>;
	buscarPorId(id: string, userId: string): Promise<Parentesco | null>;
}

