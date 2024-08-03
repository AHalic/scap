import { Pessoa } from "@prisma/client";

export interface IPessoaRepository {
	login(email: string, senha: string): Promise<Pessoa | null>;
}
