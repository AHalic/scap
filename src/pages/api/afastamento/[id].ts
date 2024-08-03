import { NextApiRequest, NextApiResponse } from "next";

import AfastamentoController from "../../../../lib/controllers/AfastamentoController";
import AfastamentoRepository from "../../../../lib/repositories/AfastamentoRepository";
import AfastamentoService from "../../../../lib/services/AfastamentoService";

const afastamentoRepository = new AfastamentoRepository();
const afastamentoService = new AfastamentoService(afastamentoRepository);
const afastamentoController = new AfastamentoController(afastamentoService);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		await afastamentoController.buscarPorId(req, res);
	} else if (req.method === "DELETE") {
		await afastamentoController.deletar(req, res);
	} else if (req.method === "PUT") {
		await afastamentoController.editar(req, res);
	} else {
		res.status(405).json({ message: "Método não existente" });
	}
}

