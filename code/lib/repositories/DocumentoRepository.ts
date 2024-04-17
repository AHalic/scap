import { Documento } from "@prisma/client";

import { FiltrosDocumento } from "../interfaces/Filtros";
import prisma from "../prisma";
import { BaseRepository } from "./BaseRepository";

export default class DocumentoRepository extends BaseRepository<
	Documento,
	FiltrosDocumento
> {
	async post(data: Documento): Promise<Documento> {
		const documento = await prisma.documento.create({
			data: {
				titulo: data.titulo,
				url: data.url,
			},
		});
		return documento;
	}

	async delete(id: string): Promise<Documento> {
		const documento = await prisma.documento.delete({
			where: { id },
		});
		return documento;
	}

	async getById(id: string): Promise<Documento | null> {
		const documento = await prisma.documento.findUnique({
			where: { id },
		});
		return documento;
	}
}

