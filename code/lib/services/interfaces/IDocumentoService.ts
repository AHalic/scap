import { Documento } from "@prisma/client";

export interface IDocumentoService {
	buscarPorId(id: string, userId: string): Promise<Documento | null>;
	criar(data: Documento, userId: string): Promise<Documento>;
	deletar(id: string, userId: string): Promise<Documento>;
}

