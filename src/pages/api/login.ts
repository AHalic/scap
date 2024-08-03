import { NextApiRequest, NextApiResponse } from "next";

import PessoaController from "../../../lib/controllers/PessoaController";
import PessoaRepository from "../../../lib/repositories/PessoaRepository";
import PessoaService from "../../../lib/services/PessoaService";

// Create an instance of your dependencies
const pessoaRepository = new PessoaRepository();
const pessoaService = new PessoaService(pessoaRepository);
const pessoaController = new PessoaController(pessoaService);

// Export the API route handler
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		await pessoaController.login(req, res);
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

