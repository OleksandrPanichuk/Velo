import { CacheService } from "@/infrastructure/cache/cache.service";
import type { Cache } from "@nestjs/cache-manager";

const mockCache: Partial<Cache> = {
	get: vi.fn(),
	set: vi.fn(),
	del: vi.fn(),
	mget: vi.fn(),
	mset: vi.fn(),
	mdel: vi.fn(),
};

const buildService = () => {
	const service = new CacheService(mockCache as Cache);
	return service;
};

describe("CacheService", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("buildKey", () => {
		it("builds a tenant-scoped key", () => {
			const key = buildService().buildKey("tenant-1", "users", "u1");
			expect(key).toBe("t:tenant-1:users:u1");
		});

		it("joins multiple parts with colon", () => {
			const key = buildService().buildKey("t1", "ns", "a", "b", "c");
			expect(key).toBe("t:t1:ns:a:b:c");
		});
	});

	describe("globalKey", () => {
		it("builds a global key without tenant prefix", () => {
			const key = buildService().globalKey("settings", "flag-1");
			expect(key).toBe("g:settings:flag-1");
		});
	});

	describe("get", () => {
		it("returns the cached value when present", async () => {
			vi.mocked(mockCache.get!).mockResolvedValue("cached-value");

			const result = await buildService().get("key1");

			expect(mockCache.get).toHaveBeenCalledWith("key1");
			expect(result).toBe("cached-value");
		});

		it("returns null when cache returns undefined", async () => {
			vi.mocked(mockCache.get!).mockResolvedValue(undefined);

			const result = await buildService().get("key1");

			expect(result).toBeNull();
		});

		it("returns null and logs on cache error", async () => {
			vi.mocked(mockCache.get!).mockRejectedValue(new Error("redis down"));

			const result = await buildService().get("key1");

			expect(result).toBeNull();
		});
	});

	describe("set", () => {
		it("sets value in cache", async () => {
			vi.mocked(mockCache.set!).mockResolvedValue(undefined);

			await buildService().set("key1", "value1", { ttl: 60 });

			expect(mockCache.set).toHaveBeenCalledWith("key1", "value1", 60);
		});

		it("indexes tags when provided", async () => {
			vi.mocked(mockCache.set!).mockResolvedValue(undefined);
			vi.mocked(mockCache.mdel!).mockResolvedValue(undefined);

			const service = buildService();
			await service.set("key1", "value1", { tags: ["tag-a"] });

			const count = await service.invalidateTag("tag-a");
			expect(count).toBe(1);
		});

		it("silently ignores cache set errors", async () => {
			vi.mocked(mockCache.set!).mockRejectedValue(new Error("write fail"));

			await expect(buildService().set("key1", "val")).resolves.toBeUndefined();
		});
	});

	describe("del", () => {
		it("deletes key from cache", async () => {
			vi.mocked(mockCache.del!).mockResolvedValue(undefined);

			await buildService().del("key1");

			expect(mockCache.del).toHaveBeenCalledWith("key1");
		});

		it("silently ignores delete errors", async () => {
			vi.mocked(mockCache.del!).mockRejectedValue(new Error("del fail"));

			await expect(buildService().del("key1")).resolves.toBeUndefined();
		});
	});

	describe("getOrSet", () => {
		it("returns cached value without calling fetcher", async () => {
			vi.mocked(mockCache.get!).mockResolvedValue("cached");
			const fetcher = vi.fn();

			const result = await buildService().getOrSet("key1", fetcher);

			expect(fetcher).not.toHaveBeenCalled();
			expect(result).toBe("cached");
		});

		it("calls fetcher when cache miss and caches result", async () => {
			vi.mocked(mockCache.get!).mockResolvedValue(undefined);
			vi.mocked(mockCache.set!).mockResolvedValue(undefined);
			const fetcher = vi.fn().mockResolvedValue("fetched");

			const result = await buildService().getOrSet("key1", fetcher);

			expect(fetcher).toHaveBeenCalled();
			expect(result).toBe("fetched");
		});

		it("bypasses cache lookup when bypass option is set", async () => {
			vi.mocked(mockCache.get!).mockResolvedValue("cached");
			vi.mocked(mockCache.set!).mockResolvedValue(undefined);
			const fetcher = vi.fn().mockResolvedValue("fresh");

			const result = await buildService().getOrSet("key1", fetcher, { bypass: true });

			expect(mockCache.get).not.toHaveBeenCalled();
			expect(fetcher).toHaveBeenCalled();
			expect(result).toBe("fresh");
		});
	});

	describe("getOrSetSafe", () => {
		it("deduplicates concurrent requests for the same key", async () => {
			vi.mocked(mockCache.get!).mockResolvedValue(undefined);
			vi.mocked(mockCache.set!).mockResolvedValue(undefined);

			let resolveFirst!: (v: string) => void;
			const firstPromise = new Promise<string>((r) => {
				resolveFirst = r;
			});
			const fetcher = vi.fn().mockReturnValueOnce(firstPromise).mockResolvedValue("second");

			const service = buildService();
			const p1 = service.getOrSetSafe("key1", fetcher);
			const p2 = service.getOrSetSafe("key1", fetcher);

			resolveFirst("shared-value");
			const [r1, r2] = await Promise.all([p1, p2]);

			expect(fetcher).toHaveBeenCalledTimes(1);
			expect(r1).toBe("shared-value");
			expect(r2).toBe("shared-value");
		});
	});

	describe("invalidateTag", () => {
		it("returns 0 when tag has no keys", async () => {
			const count = await buildService().invalidateTag("unknown-tag");
			expect(count).toBe(0);
		});

		it("deletes all keys for a tag and returns count", async () => {
			vi.mocked(mockCache.set!).mockResolvedValue(undefined);
			vi.mocked(mockCache.mdel!).mockResolvedValue(undefined);

			const service = buildService();
			await service.set("k1", "v1", { tags: ["tag-1"] });
			await service.set("k2", "v2", { tags: ["tag-1"] });

			const count = await service.invalidateTag("tag-1");

			expect(count).toBe(2);
			expect(mockCache.mdel).toHaveBeenCalledWith(expect.arrayContaining(["k1", "k2"]));
		});
	});

	describe("invalidateTags", () => {
		it("invalidates multiple tags", async () => {
			vi.mocked(mockCache.set!).mockResolvedValue(undefined);
			vi.mocked(mockCache.mdel!).mockResolvedValue(undefined);

			const service = buildService();
			await service.set("k1", "v1", { tags: ["t1"] });
			await service.set("k2", "v2", { tags: ["t2"] });

			await service.invalidateTags(["t1", "t2"]);

			expect(mockCache.mdel).toHaveBeenCalledTimes(2);
		});
	});

	describe("onModuleDestroy", () => {
		it("clears tag index and inflight requests", () => {
			const service = buildService();
			expect(() => service.onModuleDestroy()).not.toThrow();
		});
	});
});
