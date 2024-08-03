import {
	Afastamento,
	Documento,
	EstadoSolicitacao,
	Mandato,
	Onus,
	Parecer,
	Parentesco,
	Pessoa,
	Secretario,
	TipoAfastamento,
} from "@prisma/client";

enum TipoPessoa {
	professor,
	secretario,
}

interface FiltrosPessoa {
	nome: string | null;
	email: string | null;
	telefone: string | null;
	tipo: TipoPessoa | null;
}

interface FiltrosMandato {
	professorId: string | null;
	dataInicio: string | null;
	dataFim: string | null;
	isChefe: boolean | null;
}

interface FiltrosDocumento {
	titulo: string | null;
}

interface FiltrosAfastamento {
	estado: EstadoSolicitacao | null;
	onus: Onus | null;
	dataSolicitacao: string | null;
	dataInicio: string | null;
	dataFim: string | null;
	dataInicioEvento: string | null;
	dataFimEvento: string | null;
	solicitante: string | null;
	tipo: TipoAfastamento | null;
}

const estadoAfastamentoColors = {
	[EstadoSolicitacao.INICIADO]: {
		estado: EstadoSolicitacao.INICIADO,
		color: "indigo",
	},
	[EstadoSolicitacao.BLOQUEADO]: {
		estado: EstadoSolicitacao.BLOQUEADO,
		color: "yellow",
	},
	[EstadoSolicitacao.LIBERADO]: {
		estado: EstadoSolicitacao.LIBERADO,
		color: "teal",
	},
	[EstadoSolicitacao.APROVADO_DI]: {
		estado: EstadoSolicitacao.APROVADO_DI,
		color: "blue",
	},
	[EstadoSolicitacao.APROVADO_CT]: {
		estado: EstadoSolicitacao.APROVADO_CT,
		color: "cyan",
	},
	[EstadoSolicitacao.APROVADO_PRPPG]: {
		estado: EstadoSolicitacao.APROVADO_PRPPG,
		color: "sky",
	},
	[EstadoSolicitacao.ARQUIVADO]: {
		estado: EstadoSolicitacao.ARQUIVADO,
		color: "green",
	},
	[EstadoSolicitacao.CANCELADO]: {
		estado: EstadoSolicitacao.CANCELADO,
		color: "zinc",
	},
	[EstadoSolicitacao.REPROVADO]: {
		estado: EstadoSolicitacao.REPROVADO,
		color: "red",
	},
};

interface AfastamentoCompleto extends Afastamento {
	solicitante: {
		pessoa: Pessoa;
	};
	relator: {
		pessoa: Pessoa;
	};
	documentos: Documento[];
	pareceres: Parecer[];
}

interface ParentescoCompleto extends Parentesco {
	professorA: {
		pessoa: Pessoa;
	};
	professorB: {
		pessoa: Pessoa;
	};
}

interface PessoaCompleta extends Pessoa {
	tipoPessoa: TipoPessoa;
	secretario?: Secretario;
	professor?: {
		mandato: Mandato[];
		parentescoA: ParentescoCompleto[];
		parentescoB: ParentescoCompleto[];
	};
}

interface MandatoCompleto extends Mandato {
	professor: {
		pessoa: Pessoa;
	};
}

export type {
	AfastamentoCompleto,
	FiltrosPessoa,
	FiltrosAfastamento,
	FiltrosDocumento,
	FiltrosMandato,
	PessoaCompleta,
	ParentescoCompleto,
	MandatoCompleto,
};
export { TipoPessoa, estadoAfastamentoColors };

