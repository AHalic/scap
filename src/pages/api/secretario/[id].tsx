import { NextApiRequest, NextApiResponse } from "next";

import SecretarioController from "../../../../lib/controllers/SecretarioController";
import SecretarioRepository from "../../../../lib/repositories/SecretarioRepository";
import SecretarioService from "../../../../lib/services/SecretarioService";

const secretarioRepository = new SecretarioRepository();
const secretarioService = new SecretarioService(secretarioRepository);
const secretarioController = new SecretarioController(secretarioService);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "DELETE") {
		await secretarioController.deletar(req, res);
	}
}

