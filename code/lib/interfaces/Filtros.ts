import { EstadoSolicitacao, Onus, TipoAfastamento } from "@prisma/client";

enum TipoPessoa {
	professor,
	secretario,
}

interface FiltrosPessoa {
	nome: string | null;
	sobrenome: string | null;
	email: string | null;
	telefone: string | null;
	tipo: TipoPessoa | null;
}

interface FiltrosAfastamento {
	estado: EstadoSolicitacao | null;
	onus: Onus | null;
	dataSolicitacao: Date | null;
	dataInicio: Date | null;
	dataFim: Date | null;
	dataInicioEvento: Date | null;
	dataFimEvento: Date | null;
	solicitanteId: string | null;
	tipo: TipoAfastamento | null;
}

export type { FiltrosPessoa, FiltrosAfastamento };
export { TipoPessoa };

