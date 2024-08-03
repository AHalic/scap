import { NextApiRequest, NextApiResponse } from "next";

import DocumentoController from "../../../../lib/controllers/DocumentoController";
import DocumentoRepository from "../../../../lib/repositories/DocumentoRepository";
import DocumentoService from "../../../../lib/services/DocumentoService";

const documentoRepository = new DocumentoRepository();
const documentoService = new DocumentoService(documentoRepository);
const documentoController = new DocumentoController(documentoService);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		await documentoController.criar(req, res);
	}
}

