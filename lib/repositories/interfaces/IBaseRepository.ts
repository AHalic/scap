export interface IBaseRepository<T, Z> {
	post(data: T): Promise<T>;
	put(data: T): Promise<T>;
	delete(id: string): Promise<T>;
	getById(id: string): Promise<T | null>;
	get(filtros: Z): Promise<T[]>;
}

