import { NextApiRequest, NextApiResponse } from "next";

import MandatoController from "../../../../lib/controllers/MandatoController";
import MandatoRepository from "../../../../lib/repositories/MandatoRepository";
import MandatoService from "../../../../lib/services/MandatoService";

const mandatoRepository = new MandatoRepository();
const mandatoService = new MandatoService(mandatoRepository);
const mandatoController = new MandatoController(mandatoService);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		await mandatoController.buscarPorId(req, res);
	} else if (req.method === "PUT") {
		await mandatoController.editar(req, res);
	} else if (req.method === "DELETE") {
		await mandatoController.deletar(req, res);
	}
}

