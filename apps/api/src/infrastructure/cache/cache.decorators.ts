import type { AnyFunction } from "@/types/common.typedefs";
import type { CacheSetOptions } from "./cache.service";

interface CacheService {
	getOrSet: <T>(
		key: string,
		factory: () => T | Promise<T>,
		options: CacheSetOptions,
	) => T | Promise<T>;

	invalidateTags: (tags: string[]) => Promise<void>;
}

interface CacheableOptions {
	keyFn: (...args: unknown[]) => string;
	ttl?: number;
	tags?: string[] | ((...args: unknown[]) => string[]);
	bypass?: boolean;
}

export function Cacheable(options: CacheableOptions): MethodDecorator {
	return (_target, _propertyKey, descriptor: PropertyDescriptor): PropertyDescriptor => {
		const originalMethod = descriptor.value as AnyFunction;

		descriptor.value = function (this: Record<string, unknown>, ...args: unknown[]): unknown {
			const cacheService = this.cacheService as CacheService | undefined;

			if (!cacheService) {
				return originalMethod.apply(this, args) as unknown;
			}

			const key = options.keyFn(...args);
			const tags = typeof options.tags === "function" ? options.tags(...args) : options.tags;

			return cacheService.getOrSet<unknown>(
				key,
				() => originalMethod.apply(this, args) as unknown,
				{ ttl: options.ttl, tags, bypass: options.bypass },
			);
		};

		return descriptor;
	};
}

interface CacheInvalidateOptions {
	tags: string[] | ((...args: unknown[]) => string[]);
}

export function CacheInvalidate(options: CacheInvalidateOptions): MethodDecorator {
	return (_target, _propertyKet, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value as AnyFunction;

		descriptor.value = async function (this: Record<string, unknown>, ...args: unknown[]) {
			const result = (await originalMethod.apply(this, args)) as unknown;

			const cacheService = this.cacheService as CacheService | undefined;

			if (cacheService) {
				const tags = typeof options.tags === "function" ? options.tags(...args) : options.tags;
				await cacheService.invalidateTags(tags);
			}

			return result;
		};

		return descriptor;
	};
}
