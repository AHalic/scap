import { Afastamento } from "@prisma/client";

import { FiltrosAfastamento } from "../interfaces/Filtros";
import AfastamentoRepository from "../repositories/AfastamentoRepository";

export default class AfastamentoService {
	private readonly afastamentoRepository: AfastamentoRepository;

	constructor(
		afastamentoRepository: AfastamentoRepository = new AfastamentoRepository()
	) {
		this.afastamentoRepository = afastamentoRepository;
	}

	async buscarPorId(id: string): Promise<Afastamento | null> {
		return this.afastamentoRepository.getById(id);
	}

	async buscar(filtros: FiltrosAfastamento): Promise<Afastamento[]> {
		return this.afastamentoRepository.get(filtros);
	}

	async criar(data: Afastamento): Promise<Afastamento> {
		return this.afastamentoRepository.post(data);
	}

	async editar(data: Afastamento): Promise<Afastamento> {
		return this.afastamentoRepository.put(data);
	}

	async deletar(id: string): Promise<Afastamento> {
		return this.afastamentoRepository.delete(id);
	}
}

