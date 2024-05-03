import { NextApiRequest, NextApiResponse } from "next";

import Errors from "../services/interfaces/Errors";
import ProfessorService from "../services/ProfessorService";

export default class ProfessorController {
	private readonly professorService: ProfessorService;

	constructor(professorService: ProfessorService) {
		this.professorService = professorService;
	}

	async deletar(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		if (!user) {
			res.status(401).json({
				message: "Usuário sem permissão para acessar o sistema",
			});
			return;
		}

		const { id: userId } = JSON.parse(user);

		const { id } = req.query;
		const professor = await this.professorService
			.deletar(id as string, userId)
			.catch((error) => {
				if (error.message === Errors.USUARIO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Usuário logado não encontrado no sistema",
					});
					return;
				}

				if (error.message === Errors.USUARIO_SEM_PERMISSAO.toString()) {
					res.status(401).json({
						message: "Usuário sem permissão para deletar o Usuário",
					});
					return;
				}

				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(204).json({
						message: "Professor não encontrado",
					});
					return;
				}
			});

		if (!professor) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao deletar o Professor" });
			return;
		}

		res.status(200).json(professor);
	}
}

