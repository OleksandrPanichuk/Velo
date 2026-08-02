import { PaginationService } from "@/shared/pagination/pagination.service";
import { encode } from "base-64";
import type { SelectQueryBuilder } from "typeorm";

interface Entity {
	id: string;
}

const makeQb = (entities: Entity[], totalCount = entities.length) => {
	const qb = {
		alias: "entity",
		clone: vi.fn(),
		andWhere: vi.fn().mockReturnThis(),
		orderBy: vi.fn().mockReturnThis(),
		take: vi.fn().mockReturnThis(),
		getManyAndCount: vi.fn().mockResolvedValue([entities, totalCount]),
	};
	qb.clone.mockReturnValue(qb);
	return qb as unknown as SelectQueryBuilder<Entity>;
};

const buildService = () => new PaginationService();

describe("PaginationService", () => {
	describe("paginate", () => {
		it("returns all entities with no next page when count <= first", async () => {
			const entities = [{ id: "1" }, { id: "2" }];
			const qb = makeQb(entities, 2);

			const result = await buildService().paginate(qb, { first: 10 });

			expect(result.nodes).toHaveLength(2);
			expect(result.totalCount).toBe(2);
			expect(result.pageInfo.hasNextPage).toBe(false);
			expect(result.pageInfo.hasPreviousPage).toBe(false);
		});

		it("detects hasNextPage when repository returns more than first", async () => {
			const entities = [{ id: "1" }, { id: "2" }, { id: "3" }];
			const qb = makeQb(entities, 3);

			const result = await buildService().paginate(qb, { first: 2 });

			expect(result.nodes).toHaveLength(2);
			expect(result.pageInfo.hasNextPage).toBe(true);
		});

		it("applies cursor filter when after is provided", async () => {
			const entities = [{ id: "2" }];
			const qb = makeQb(entities, 1);
			const cursor = encode("1");

			await buildService().paginate(qb, { first: 10, after: cursor });

			expect(qb.andWhere).toHaveBeenCalledWith(expect.stringContaining("id > :cursorId"), {
				cursorId: "1",
			});
		});

		it("sets hasPreviousPage when after cursor is provided", async () => {
			const entities = [{ id: "2" }];
			const qb = makeQb(entities, 1);

			const result = await buildService().paginate(qb, { first: 10, after: encode("1") });

			expect(result.pageInfo.hasPreviousPage).toBe(true);
		});

		it("encodes cursors correctly as base64 entity ids", async () => {
			const entities = [{ id: "abc-1" }];
			const qb = makeQb(entities, 1);

			const result = await buildService().paginate(qb, { first: 10 });

			expect(result.edges[0]?.cursor).toBe(encode("abc-1"));
		});

		it("uses default first=10 when not provided", async () => {
			const entities = Array.from({ length: 5 }, (_, i) => ({ id: String(i + 1) }));
			const qb = makeQb(entities, 5);

			await buildService().paginate(qb, {});

			expect(qb.take).toHaveBeenCalledWith(11);
		});

		it("returns empty page info when there are no entities", async () => {
			const qb = makeQb([], 0);

			const result = await buildService().paginate(qb, { first: 10 });

			expect(result.nodes).toHaveLength(0);
			expect(result.pageInfo.startCursor).toBeUndefined();
			expect(result.pageInfo.endCursor).toBeUndefined();
		});
	});
});
