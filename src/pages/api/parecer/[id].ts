import { NextApiRequest, NextApiResponse } from "next";

import ParecerController from "../../../../lib/controllers/ParecerController";
import ParecerRepository from "../../../../lib/repositories/ParecerRepository";
import ParecerService from "../../../../lib/services/ParecerService";

const parecerRepository = new ParecerRepository();
const parecerService = new ParecerService(parecerRepository);
const parecerController = new ParecerController(parecerService);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		await parecerController.buscarPorId(req, res);
	} else if (req.method === "DELETE") {
		await parecerController.deletar(req, res);
	}
}

