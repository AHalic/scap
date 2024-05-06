import { Pessoa } from "@prisma/client";

import { FiltrosPessoa, PessoaCompleta } from "../../interfaces/Filtros";

export interface IPessoaService {
	login(email: string, senha: string): Promise<Pessoa | null>;
	criar(data: PessoaCompleta, userId: string): Promise<Pessoa>;
	editar(data: Pessoa, userId: string): Promise<Pessoa>;
	deletar(id: string, userId: string): Promise<Pessoa>;
	buscarPorId(id: string): Promise<Pessoa | null>;
	buscar(filtros: FiltrosPessoa): Promise<Pessoa[]>;
}

