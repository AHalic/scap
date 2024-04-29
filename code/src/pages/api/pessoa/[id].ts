import { NextApiRequest, NextApiResponse } from "next";

import PessoaController from "../../../../lib/controllers/PessoaController";
import PessoaRepository from "../../../../lib/repositories/PessoaRepository";
import PessoaService from "../../../../lib/services/PessoaService";

const pessoaRepository = new PessoaRepository();
const pessoaService = new PessoaService(pessoaRepository);
const pessoaController = new PessoaController(pessoaService);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		await pessoaController.buscarPorId(req, res);
	} else if (req.method === "PUT") {
		await pessoaController.editar(req, res);
	} else if (req.method === "DELETE") {
		await pessoaController.deletar(req, res);
	}
}

