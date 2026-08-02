import { type BaseModel } from "@/models/Base.model";
import { TransactionHost } from "@nestjs-cls/transactional";
import { type TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Inject } from "@nestjs/common";
import {
	type DeepPartial,
	type EntityManager,
	type FindOptionsWhere,
	In,
	type Repository,
	type SelectQueryBuilder,
	type UpdateResult,
} from "typeorm";

export abstract class BaseRepository<T extends BaseModel> {
	@Inject(TransactionHost)
	private readonly txHost!: TransactionHost<TransactionalAdapterTypeOrm>;

	constructor(protected readonly repo: Repository<T>) {}

	protected get em(): EntityManager {
		return this.txHost.tx ?? this.repo.manager;
	}

	public async findAll(): Promise<T[]> {
		return this.em.find(this.repo.target);
	}

	public async findById(id: string): Promise<T | null> {
		return this.em.findOne(this.repo.target, { where: { id } as FindOptionsWhere<T> });
	}

	public async findByIds(ids: readonly string[]): Promise<T[]> {
		return this.em.find(this.repo.target, { where: { id: In([...ids]) } as FindOptionsWhere<T> });
	}

	public async create(data: DeepPartial<T>): Promise<T> {
		const entity = this.em.create(this.repo.target, data);
		return this.em.save(entity);
	}

	public async update(id: string, data: DeepPartial<T>): Promise<T | null> {
		const entity = await this.findById(id);
		if (!entity) return null;
		Object.assign(entity, data);
		return this.em.save(entity);
	}

	public async softDelete(id: string): Promise<UpdateResult> {
		return this.em.softDelete(this.repo.target, id);
	}

	public createQueryBuilder(alias: string): SelectQueryBuilder<T> {
		return this.em.createQueryBuilder(this.repo.target, alias);
	}
}
