import { NextApiRequest, NextApiResponse } from "next";

import ParentescoController from "../../../lib/controllers/ParentescoController";
import ParentescoRepository from "../../../lib/repositories/ParentescoRepository";
import ParentescoService from "../../../lib/services/ParentescoService";

const parentescoRepository = new ParentescoRepository();
const parentescoService = new ParentescoService(parentescoRepository);
const parentescoController = new ParentescoController(parentescoService);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		await parentescoController.verificaParentesco(req, res);
	}
}

