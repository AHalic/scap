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
	if (req.method === "POST") {
		await parecerController.criar(req, res);
	}
}

