import { Mandato } from "@prisma/client";

export interface IMandatoRepository {
	getLast(isChefe: boolean): Promise<Mandato | null>;
}

