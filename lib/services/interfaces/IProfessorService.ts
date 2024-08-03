import { Professor } from "@prisma/client";

export interface IProfessorService {
	deletar(id: string, userId: string): Promise<Professor>;
}
