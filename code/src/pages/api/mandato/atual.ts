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
		await mandatoController.buscaMandatoAtual(req, res);
	}
}

