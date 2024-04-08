import { NextApiRequest, NextApiResponse } from "next";

import { FiltrosAfastamento } from "../interfaces/Filtros";
import AfastamentoService from "../services/AfastamentoService";
import Errors from "../services/interfaces/Errors";

export default class AfastamentoController {
	private readonly afastamentoService: AfastamentoService;

	constructor(
		afastamentoService: AfastamentoService = new AfastamentoService()
	) {
		this.afastamentoService = afastamentoService;
	}

	async buscarPorId(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		if (!user) {
			res.status(401).json({
				message: "Usuário sem permissão para acessar o sistema",
			});
			return;
		}

		const { id } = req.query;
		const afastamento = await this.afastamentoService
			.buscarPorId(id as string)
			.catch((error) => {
				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Afastamento não encontrado",
					});
					return;
				}
			});

		if (!afastamento) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao buscar o Afastamento" });
			return;
		}
		res.status(200).json(afastamento);
	}

	async buscar(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		if (!user) {
			res.status(401).json({
				message: "Usuário sem permissão para acessar o sistema",
			});
			return;
		}

		const filtros = { ...req.query } as unknown as FiltrosAfastamento;
		const afastamentos = await this.afastamentoService
			.buscar(filtros)
			.catch((error) => {
				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Afastamentos não encontrados",
					});
					return;
				}
			});

		if (!afastamentos) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao buscar os afastamentos" });
			return;
		}

		res.status(200).json(afastamentos);
	}

	async criar(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		const { id: userId } = JSON.parse(user ? user : "");

		const afastamento = await this.afastamentoService
			.criar(req.body, userId)
			.catch((error) => {
				if (error.message === Errors.USUARIO_SEM_PERMISSAO.toString()) {
					res.status(401).json({
						message: "Usuário sem permissão para criar Afastamento",
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
			});

		if (!afastamento) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao criar o Afastamento" });
			return;
		}

		res.status(201).json(afastamento);
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

		const afastamento = await this.afastamentoService
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
						message: "Usuário sem permissão para editar o Afastamento",
					});
					return;
				}

				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Afastamento não encontrado",
					});
					return;
				}
			});

		if (!afastamento) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao editar o Afastamento" });
			return;
		}

		res.status(200).json(afastamento);
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
		const afastamento = await this.afastamentoService
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
						message: "Usuário sem permissão para deletar o Afastamento",
					});
					return;
				}

				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Afastamento não encontrado",
					});
					return;
				}
			});

		if (!afastamento) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao deletar o Afastamento" });
			return;
		}

		res.status(200).json(afastamento);
	}
}

