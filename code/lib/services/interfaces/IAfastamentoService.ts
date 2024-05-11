import { Afastamento } from "@prisma/client";

import { FiltrosAfastamento } from "../../interfaces/Filtros";

export interface IAfastamentoService {
	buscarPorId(id: string, userId: string): Promise<Afastamento | null>;
	buscar(filtros: FiltrosAfastamento, userId: string): Promise<Afastamento[]>;
	criar(data: Afastamento, userId: string): Promise<Afastamento>;
	editar(data: Afastamento, userId: string): Promise<Afastamento>;
	deletar(id: string, userId: string): Promise<Afastamento>;
}

