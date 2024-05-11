import { Secretario } from "@prisma/client";

export interface ISecretarioService {
	deletar(id: string, userId: string): Promise<Secretario>;
}

