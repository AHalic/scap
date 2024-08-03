/* eslint-disable @typescript-eslint/no-unused-vars */
import { IBaseRepository } from "./interfaces/IBaseRepository";

export class BaseRepository<T, Z> implements IBaseRepository<T, Z> {
	async post(data: T): Promise<T> {
		throw new Error("Method not implemented.");
	}
	put(data: T): Promise<T> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<T> {
		throw new Error("Method not implemented.");
	}
	getById(id: string): Promise<T | null> {
		throw new Error("Method not implemented.");
	}
	get(filtros: Z): Promise<T[]> {
		throw new Error("Method not implemented.");
	}
}

