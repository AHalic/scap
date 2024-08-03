import { NextApiRequest, NextApiResponse } from "next";

import Errors from "../services/interfaces/Errors";
import SecretarioService from "../services/SecretarioService";

export default class SecretarioController {
	private readonly secretarioService: SecretarioService;

	constructor(secretarioService: SecretarioService) {
		this.secretarioService = secretarioService;
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
		const secretario = await this.secretarioService
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
					res.status(404).json({
						message: "Secretário não encontrado",
					});
					return;
				}
			});

		if (!secretario) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao deletar o Secretário" });
			return;
		}

		res.status(200).json(secretario);
	}
}

