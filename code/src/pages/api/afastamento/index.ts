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
		await afastamentoController.buscar(req, res);
	}
}

