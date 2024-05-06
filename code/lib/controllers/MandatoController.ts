import { NextApiRequest, NextApiResponse } from "next";

import Errors from "../services/interfaces/Errors";
import MandatoService from "../services/MandatoService";

export default class MandatoController {
	private readonly mandatoService: MandatoService;

	constructor(mandatoService: MandatoService) {
		this.mandatoService = mandatoService;
	}

	async buscaMandatoAtual(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		if (!user) {
			res.status(401).json({
				message: "Usuário sem permissão para acessar o sistema",
			});
			return;
		}

		const { id: userId } = JSON.parse(user);

		const { isChefe } = req.query;

		const mandato = await this.mandatoService
			.buscaMandatoAtual(userId, isChefe === "true" ? true : false)
			.catch((error) => {
				if (error.message === Errors.USUARIO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Usuário não encontrado",
					});
					return;
				}
				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(204).end();
					return;
				}
			});

		res.status(200).json(mandato);
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

		const mandato = await this.mandatoService
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
						message: "Mandato não encontrado",
					});
					return;
				}
			});

		if (!mandato) {
			res.status(404).json({ message: "Ocorreu um erro ao buscar o Mandato" });
			return;
		}
		res.status(200).json(mandato);
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

		const { isChefe, ...rest } = req.body;

		const mandato = await this.mandatoService
			.criar(
				{
					...rest,
					isChefe: isChefe === "true" ? true : false,
				},
				userId
			)
			.catch((error) => {
				if (error.message === Errors.USUARIO_SEM_PERMISSAO.toString()) {
					res.status(401).json({
						message: "Usuário sem permissão para criação de Mandatos",
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

				if (error.message === Errors.ESTADO_INVALIDO.toString()) {
					res.status(404).json({
						message: "Já existe um Mandato em andamento",
					});
					return;
				}

				if (error.message === Errors.PROF_COM_MANDATO.toString()) {
					res.status(404).json({
						message: "O Professor já possui um Mandato em andamento",
					});
					return;
				}

				if (error.message === Errors.DATA_INVALIDA.toString()) {
					res.status(404).json({
						message: "Data de Fim deve ser maior que a Data de Início",
					});
					return;
				}
			});

		if (!mandato) {
			res.status(404).json({ message: "Ocorreu um erro ao criar o Mandato" });
			return;
		}

		res.status(201).json(mandato);
	}

	async editar(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		if (!user) {
			res.status(401).json({
				message: "Usuário sem permissão para acessar o sistema",
			});
			return;
		}

		const { id: userId } = JSON.parse(user);

		const mandato = await this.mandatoService
			.editar(req.body, userId)
			.catch((error) => {
				if (error.message === Errors.USUARIO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Usuário logado não encontrado no sistema",
					});
					return;
				}

				if (error.message === Errors.USUARIO_SEM_PERMISSAO.toString()) {
					res.status(401).json({
						message: "Usuário sem permissão para editar o Mandato",
					});
					return;
				}

				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(404).json({
						message: "Mandato não encontrado",
					});
					return;
				}

				if (error.message === Errors.ESTADO_INVALIDO.toString()) {
					res.status(404).json({
						message: "Mandato já finalizado não pode ser editado",
					});
					return;
				}

				if (error.message === Errors.DATA_INVALIDA.toString()) {
					res.status(404).json({
						message: "Data de Fim deve ser maior que a Data de Início",
					});
					return;
				}

				if (error.message === Errors.CAMPO_OBRIGATORIO.toString()) {
					res.status(404).json({
						message:
							"Data de Fim é um campo obrigatório para finalizar o mandato",
					});
					return;
				}
			});

		if (!mandato) {
			res.status(404).json({ message: "Ocorreu um erro ao editar o Mandato" });
			return;
		}

		res.status(200).json(mandato);
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
		const mandato = await this.mandatoService
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
						message: "Usuário sem permissão para deletar o Mandato",
					});
					return;
				}

				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(404).json({
						message: "Mandato não encontrado",
					});
					return;
				}
			});

		if (!mandato) {
			res.status(404).json({ message: "Ocorreu um erro ao deletar o Mandato" });
			return;
		}

		res.status(200).json(mandato);
	}
}

