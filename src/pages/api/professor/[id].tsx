import { NextApiRequest, NextApiResponse } from "next";

import ProfessorController from "../../../../lib/controllers/ProfessorController";
import ProfessorRepository from "../../../../lib/repositories/ProfessorRepository";
import ProfessorService from "../../../../lib/services/ProfessorService";

const professorRepository = new ProfessorRepository();
const professorService = new ProfessorService(professorRepository);
const professorController = new ProfessorController(professorService);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "DELETE") {
		await professorController.deletar(req, res);
	}
}

