import { NextApiRequest, NextApiResponse } from "next";

import { FiltrosAfastamento } from "../interfaces/Filtros";
import AfastamentoService from "../services/AfastamentoService";

export default class AfastamentoController {
	private readonly afastamentoService: AfastamentoService;

	constructor(
		afastamentoService: AfastamentoService = new AfastamentoService()
	) {
		this.afastamentoService = afastamentoService;
	}

	async buscarPorId(req: NextApiRequest, res: NextApiResponse) {
		const { id } = req.query;
		const afastamento = await this.afastamentoService.buscarPorId(id as string);
		if (!afastamento) {
			res.status(404).json({ message: "Afastamento não encontrado" });
			return;
		}
		res.status(200).json(afastamento);
	}

	async buscar(req: NextApiRequest, res: NextApiResponse) {
		const filtros = { ...req.query } as unknown as FiltrosAfastamento;
		const afastamentos = await this.afastamentoService.buscar(filtros);

		if (!afastamentos) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao buscar os afastamentos" });
			return;
		}

		res.status(200).json(afastamentos);
	}

	async criar(req: NextApiRequest, res: NextApiResponse) {
		const afastamento = await this.afastamentoService.criar(req.body);

		if (!afastamento) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao criar o Afastamento" });
			return;
		}

		res.status(201).json(afastamento);
	}

	async editar(req: NextApiRequest, res: NextApiResponse) {
		const afastamento = await this.afastamentoService.editar(req.body);

		if (!afastamento) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao editar o Afastamento" });
			return;
		}

		res.status(200).json(afastamento);
	}

	async deletar(req: NextApiRequest, res: NextApiResponse) {
		const { id } = req.query;
		const afastamento = await this.afastamentoService.deletar(id as string);

		if (!afastamento) {
			res
				.status(404)
				.json({ message: "Ocorreu um erro ao deletar o Afastamento" });
			return;
		}

		res.status(200).json(afastamento);
	}
}

