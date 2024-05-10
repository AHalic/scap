export interface IParentescoRepository {
	verificaParentesco(professor1: string, professor2: string): Promise<boolean>;
}

