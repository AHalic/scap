import { NextApiRequest, NextApiResponse } from "next";

import DocumentoService from "../services/DocumentoService";
import Errors from "../services/interfaces/Errors";

export default class DocumentoController {
	private readonly documentoService: DocumentoService;

	constructor(documentoService: DocumentoService) {
		this.documentoService = documentoService;
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
		const documento = await this.documentoService
			.buscarPorId(id as string, userId)
			.catch((error) => {
				if (error.message === Errors.USUARIO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Usuário logado não encontrado no sistema",
					});
					return;
				}
				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(401).json({
						message: "Documento não encontrado",
					});
					return;
				}
			});

		if (!documento) {
			res.status(404).json({ message: "Ocorreu um erro ao buscar o Usuário" });
			return;
		}
		res.status(200).json(documento);
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

		const documento = await this.documentoService
			.criar(req.body, userId)
			.catch((error) => {
				if (error.message === Errors.USUARIO_SEM_PERMISSAO.toString()) {
					res.status(401).json({
						message: "Usuário sem permissão para criação de Usuários",
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

		if (!documento) {
			res.status(404).json({ message: "Ocorreu um erro ao criar o Documento" });
			return;
		}

		res.status(201).json(documento);
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
		const documento = await this.documentoService
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
					res.status(401).json({
						message: "Usuário não encontrado",
					});
					return;
				}
			});

		if (!documento) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao deletar o Documento" });
			return;
		}

		res.status(200).json(documento);
	}
}

