import { NextApiRequest, NextApiResponse } from "next";

import { FonteParecer, Parecer, TipoParecer } from "@prisma/client";

import Errors from "../services/interfaces/Errors";
import ParecerService from "../services/ParecerService";

export default class ParecerController {
	private readonly parecerService: ParecerService;

	constructor(parecerService: ParecerService) {
		this.parecerService = parecerService;
	}

	async buscarPorId(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		if (!user) {
			res.status(401).json({
				message: "Usuário sem permissão para acessar o sistema",
			});
			return;
		}

		const { id: userId } = JSON.parse(user);
		const { id } = req.query;

		const parecer = await this.parecerService
			.buscarPorId(id as string, userId)
			.catch((error) => {
				if (error.message === Errors.USUARIO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Usuário não encontrado",
					});
					return;
				}
				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(404).json({
						message: "Parecer não encontrado",
					});
					return;
				}
			});

		if (!parecer) {
			res.status(404).json({ message: "Ocorreu um erro ao buscar o Parecer" });
			return;
		}
		res.status(200).json(parecer);
	}

	async criar(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		if (!user) {
			res.status(401).json({
				message: "Usuário sem permissão para acessar o sistema",
			});
			return;
		}

		const { id: userId } = JSON.parse(user ? user : "");

		const { julgamento, fonte, ...resto } = req.body;

		const parecer = await this.parecerService
			.criar(
				{
					...resto,
					julgamento: julgamento as TipoParecer,
					fonte: fonte as FonteParecer,
				} as Parecer,
				userId
			)
			.catch((error) => {
				if (error.message === Errors.USUARIO_SEM_PERMISSAO.toString()) {
					res.status(401).json({
						message: "Usuário sem permissão para criação de Parecer",
					});
					return;
				}

				if (
					error.message === Errors.USUARIO_NAO_LOGADO.toString() ||
					error.message === Errors.USUARIO_NAO_ENCONTRADO.toString()
				) {
					res.status(401).json({
						message: "Usuário sem permissão para acessar o sistema",
					});
					return;
				}

				if (error.message === Errors.DADO_INVALIDO.toString()) {
					res.status(404).json({
						message:
							"Usuário não pode fazer um parecer para um afastamento seu",
					});
					return;
				}

				if (error.message === Errors.CAMPO_OBRIGATORIO.toString()) {
					res.status(404).json({
						message: "Há pelo menos um campo obrigatório não preenchido",
					});
					return;
				}

				if (error.message === Errors.ESTADO_INVALIDO.toString()) {
					res.status(404).json({
						message: "Ocorreu um erro ao atualizar o Afastamento",
					});
					return;
				}
			});

		if (!parecer) {
			res.status(404).json({ message: "Ocorreu um erro ao criar o Parecer" });
			return;
		}

		res.status(201).json(parecer);
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
		const parecer = await this.parecerService
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
						message: "Usuário sem permissão para deletar o Parecer",
					});
					return;
				}

				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(404).json({
						message: "Parecer não encontrado",
					});
					return;
				}
			});

		if (!parecer) {
			res.status(404).json({ message: "Ocorreu um erro ao deletar o Parecer" });
			return;
		}

		res.status(200).json(parecer);
	}
}

