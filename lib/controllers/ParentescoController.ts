import { NextApiRequest, NextApiResponse } from "next";

import Errors from "../services/interfaces/Errors";
import ParentescoService from "../services/ParentescoService";

export default class ParentescoController {
	private readonly parentescoService: ParentescoService;

	constructor(parentescoService: ParentescoService) {
		this.parentescoService = parentescoService;
	}

	async verificaParentesco(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		if (!user) {
			res.status(401).json({
				message: "Usuário sem permissão para acessar o sistema",
			});
			return;
		}

		const { id: userId } = JSON.parse(user);

		const { professor1Id, professor2Id } = req.query as {
			professor1Id: string;
			professor2Id: string;
		};

		const parentesco = await this.parentescoService
			.verificaParentesco(professor1Id, professor2Id, userId)
			.catch((error) => {
				if (error.message === Errors.USUARIO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Usuário logado não encontrado no sistema",
					});
					return;
				}

				if (error.message === Errors.DADO_INVALIDO.toString()) {
					res.status(401).json({
						message: "Pelo menos um professor não foi encontrado",
					});
					return;
				}
			});

		res.status(200).json(parentesco);
	}
}

