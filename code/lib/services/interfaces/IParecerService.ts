import { Parecer } from "@prisma/client";

export interface IParecerService {
	buscarPorId(id: string, userId: string): Promise<Parecer | null>;
	criar(data: Parecer, userId: string): Promise<Parecer>;
	deletar(id: string, userId: string): Promise<Parecer>;
}

