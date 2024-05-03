import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

import { FiltrosPessoa } from "../interfaces/Filtros";
import Errors from "../services/interfaces/Errors";
import PessoaService from "../services/PessoaService";

export default class PessoaController {
	private readonly pessoaService: PessoaService;

	constructor(pessoaService: PessoaService) {
		this.pessoaService = pessoaService;
	}

	async login(req: NextApiRequest, res: NextApiResponse) {
		const { email, senha } = req.body;
		if (!email || !senha) {
			res.status(400).json({ message: "Email e Senha obrigatórios" });
			return;
		}

		const pessoa = await this.pessoaService.login(email, senha);
		if (!pessoa) {
			res.status(401).json({ message: "Email ou Senha inválidos" });
			return;
		}

		const sessionData = {
			email: pessoa.email,
			id: pessoa.id,
			secretarioId: pessoa.secretarioId,
			professorId: pessoa.professorId,
		}; // Customize as per your requirements
		const encryptedSessionData = JSON.stringify(sessionData); // Encrypt the session data if needed
		const cookie = serialize("session", encryptedSessionData, {
			httpOnly: false,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 24 * 7, // One week
			path: "/",
		});
		res.setHeader("Set-Cookie", cookie);

		// In a real application, you would generate a token or session
		res.status(200).json({ message: "Login realizado com sucesso", pessoa });
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
		const pessoa = await this.pessoaService
			.buscarPorId(id as string)
			.catch((error) => {
				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(204).json({
						message: "Usuário não encontrado",
					});
					return;
				}
			});

		if (!pessoa) {
			res.status(404).json({ message: "Ocorreu um erro ao buscar o Usuário" });
			return;
		}
		res.status(200).json(pessoa);
	}

	async buscar(req: NextApiRequest, res: NextApiResponse) {
		const user = req.cookies.session;
		if (!user) {
			res.status(401).json({
				message: "Usuário sem permissão para acessar o sistema",
			});
			return;
		}

		const filtros = { ...req.query } as unknown as FiltrosPessoa;
		const pessoas = await this.pessoaService.buscar(filtros).catch((error) => {
			if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
				res.status(204).json({
					message: "Usuários não encontrados",
				});
				return;
			}
		});

		if (!pessoas) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao buscar os Usuários" });
			return;
		}

		res.status(200).json(pessoas);
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

		const pessoa = await this.pessoaService
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

		if (!pessoa) {
			res.status(404).json({ message: "Ocorreu um erro ao criar o Usuário" });
			return;
		}

		res.status(201).json(pessoa);
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

		const pessoa = await this.pessoaService
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
						message: "Usuário sem permissão para editar Usuários",
					});
					return;
				}

				if (error.message === Errors.OBJETO_NAO_ENCONTRADO.toString()) {
					res.status(204).json({
						message: "Usuário não encontrado",
					});
					return;
				}
			});

		if (!pessoa) {
			res.status(404).json({ message: "Ocorreu um erro ao editar o Usuário" });
			return;
		}

		res.status(200).json(pessoa);
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
		const pessoa = await this.pessoaService
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
						message: "Usuário não encontrado",
					});
					return;
				}
			});

		if (!pessoa) {
			res.status(404).json({ message: "Ocorreu um erro ao deletar o Usuário" });
			return;
		}

		res.status(200).json(pessoa);
	}
}

