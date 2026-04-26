import { type BaseModel } from "@/models/Base.model";
import { type DeepPartial, type FindOptionsWhere, In, type Repository } from "typeorm";

export abstract class BaseRepository<T extends BaseModel> {
	constructor(protected readonly repo: Repository<T>) {}

	public async findAll(): Promise<T[]> {
		return this.repo.find();
	}

	public async findById(id: string): Promise<T | null> {
		return this.repo.findOne({ where: { id } as FindOptionsWhere<T> });
	}

	public async findByIds(ids: readonly string[]): Promise<T[]> {
		return this.repo.find({ where: { id: In([...ids]) } as FindOptionsWhere<T> });
	}

	public async create(data: DeepPartial<T>): Promise<T> {
		const entity = this.repo.create(data);
		return this.repo.save(entity);
	}

	public async update(id: string, data: DeepPartial<T>): Promise<T | null> {
		const entity = await this.findById(id);
		if (!entity) return null;
		Object.assign(entity, data);
		return this.repo.save(entity);
	}

	public softDelete(id: string) {
		return this.repo.softDelete(id);
	}

	public createQueryBuilder(alias: string) {
		return this.repo.createQueryBuilder(alias);
	}
}
