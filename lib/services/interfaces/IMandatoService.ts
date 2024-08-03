import { Mandato } from "@prisma/client";

export interface IMandatoService {
	buscaMandatoAtual(userId: string, isChefe: boolean): Promise<Mandato | null>;
	buscarPorId(id: string, userId: string): Promise<Mandato | null>;
	criar(data: Mandato, userId: string): Promise<Mandato>;
	editar(data: Mandato, userId: string): Promise<Mandato>;
	deletar(id: string, userId: string): Promise<Mandato>;
}

