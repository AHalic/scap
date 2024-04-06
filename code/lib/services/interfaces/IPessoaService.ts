import { FiltrosPessoa } from "../../interfaces/Filtros";
import { Pessoa } from "@prisma/client";

export interface IPessoaService {
	login(email: string, senha: string): Promise<Pessoa | null>;
	criar(data: Pessoa): Promise<Pessoa>;
	editar(data: Pessoa): Promise<Pessoa>;
	deletar(id: string): Promise<Pessoa>;
	buscarPorId(id: string): Promise<Pessoa | null>;
	buscar(filtros: FiltrosPessoa): Promise<Pessoa[]>;
}

