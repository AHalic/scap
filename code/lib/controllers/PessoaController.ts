import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

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

		const sessionData = { email: pessoa.email, id: pessoa.id }; // Customize as per your requirements
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
}

