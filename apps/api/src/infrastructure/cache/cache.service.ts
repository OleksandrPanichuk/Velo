import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";

export interface CacheSetOptions {
	ttl?: number;
	tags?: string[];
	bypass?: boolean;
}

@Injectable()
export class CacheService implements OnModuleDestroy {
	private readonly logger = new Logger(CacheService.name);

	private readonly tagIndex = new Map<string, Set<string>>();

	private readonly inflightRequests = new Map<string, Promise<unknown>>();

	constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

	public buildKey(tenantId: string, namespace: string, ...parts: (string | number)[]): string {
		return `t:${tenantId}:${namespace}:${parts.join(":")}`;
	}

	public globalKey(namespace: string, ...parts: (string | number)[]): string {
		return `g:${namespace}:${parts.join(":")}`;
	}

	public async get<T>(key: string): Promise<T | null> {
		try {
			const value = await this.cache.get<T>(key);

			if (value !== undefined && value !== null) {
				return value;
			}

			return null;
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn(`Cache GET failed for key "${key}": ${err.message}`);
			}
			return null;
		}
	}

	public async set<T>(key: string, value: T, options: CacheSetOptions = {}): Promise<void> {
		try {
			await this.cache.set(key, value, options.ttl);
			if (options.tags?.length) {
				this.indexTags(key, options.tags);
			}
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn(`Cache SET failed for key "${key}": ${err.message}`);
			}
		}
	}

	public async del(key: string): Promise<void> {
		try {
			await this.cache.del(key);
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn(`Cache DEL failed for key "${key}": ${err.message}`);
			}
		}
	}

	public async getOrSet<T>(
		key: string,
		fetcher: () => Promise<T>,
		options: CacheSetOptions = {},
	): Promise<T> {
		if (!options.bypass) {
			const cached = await this.get<T>(key);
			if (cached !== null) return cached;
		}

		const value = await fetcher();
		this.set(key, value, options).catch(() => {});
		return value;
	}

	public async getOrSetSafe<T>(
		key: string,
		fetcher: () => Promise<T>,
		options: CacheSetOptions = {},
	): Promise<T> {
		if (!options.bypass) {
			const cached = await this.get<T>(key);
			if (cached !== null) return cached;
		}

		if (this.inflightRequests.has(key)) {
			return this.inflightRequests.get(key) as Promise<T>;
		}

		const promise = fetcher()
			.then(async (value) => {
				await this.set(key, value, options);
				this.inflightRequests.delete(key);
				return value;
			})
			.catch((err) => {
				this.inflightRequests.delete(key);
				throw err;
			});

		this.inflightRequests.set(key, promise);
		return promise;
	}

	public async mget<T>(keys: string[]): Promise<Map<string, T | null>> {
		const results = await this.cache.mget<T>(keys);
		const map = new Map<string, T | null>();
		keys.forEach((key, i) => {
			const r = results[i];
			map.set(key, r ?? null);
		});
		return map;
	}

	public async mset<T>(
		entries: Array<{ key: string; value: T; options?: CacheSetOptions }>,
	): Promise<void> {
		await this.cache.mset(entries);
	}

	public async mdel(keys: string[]): Promise<void> {
		await this.cache.mdel(keys);
	}

	public async invalidateTag(tag: string): Promise<number> {
		const keys = this.tagIndex.get(tag);
		if (!keys?.size) return 0;

		await this.cache.mdel(Array.from(keys));
		this.tagIndex.delete(tag);
		return keys.size;
	}

	public async invalidateTags(tags: string[]): Promise<void> {
		await Promise.allSettled(tags.map(async (t) => this.invalidateTag(t)));
	}

	private indexTags(key: string, tags: string[]) {
		for (const tag of tags) {
			if (!this.tagIndex.has(tag)) {
				this.tagIndex.set(tag, new Set());
			}
			this.tagIndex.get(tag)?.add(key);
		}
	}

	public onModuleDestroy(): void {
		this.tagIndex.clear();
		this.inflightRequests.clear();
	}
}
