import { UserModel } from "@/models/User.model";
import { UsersService } from "@/modules/users/users.service";
import { UsersRepository } from "@/modules/users/users.repository";
import { PaginationService } from "@/shared/pagination";

const mockUsersRepository: Partial<UsersRepository> = {
	findAll: vi.fn(),
	findById: vi.fn(),
	findByIds: vi.fn(),
	update: vi.fn(),
	createQueryBuilder: vi.fn(),
};

const mockPaginationService: Partial<PaginationService> = {
	paginate: vi.fn(),
};

const buildService = () =>
	new UsersService(
		mockUsersRepository as UsersRepository,
		mockPaginationService as PaginationService,
	);

describe("UsersService", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("findAll", () => {
		it("delegates to repository", async () => {
			const users = [{ id: "u1" }, { id: "u2" }];
			vi.mocked(mockUsersRepository.findAll!).mockResolvedValue(users as UserModel[]);

			const result = await buildService().findAll();

			expect(mockUsersRepository.findAll).toHaveBeenCalled();
			expect(result).toBe(users);
		});
	});

	describe("findById", () => {
		it("returns user when found", async () => {
			const user = { id: "u1" };
			vi.mocked(mockUsersRepository.findById!).mockResolvedValue(user as UserModel);

			const result = await buildService().findById("u1");

			expect(mockUsersRepository.findById).toHaveBeenCalledWith("u1");
			expect(result).toBe(user);
		});

		it("returns null when not found", async () => {
			vi.mocked(mockUsersRepository.findById!).mockResolvedValue(null);

			const result = await buildService().findById("missing");

			expect(result).toBeNull();
		});
	});

	describe("findByIds", () => {
		it("delegates to repository with the given ids", async () => {
			const users = [{ id: "u1" }];
			vi.mocked(mockUsersRepository.findByIds!).mockResolvedValue(users as UserModel[]);

			const result = await buildService().findByIds(["u1"]);

			expect(mockUsersRepository.findByIds).toHaveBeenCalledWith(["u1"]);
			expect(result).toBe(users);
		});
	});

	describe("findAllPaginated", () => {
		it("creates query builder and delegates to pagination service", async () => {
			const qb = {} as never;
			const paginated = { edges: [], nodes: [], totalCount: 0, pageInfo: {} as never };
			vi.mocked(mockUsersRepository.createQueryBuilder!).mockResolvedValue(qb);
			vi.mocked(mockPaginationService.paginate!).mockResolvedValue(paginated);

			const paginationArgs = { first: 10 };
			const result = await buildService().findAllPaginated(paginationArgs);

			expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalledWith("user");
			expect(mockPaginationService.paginate).toHaveBeenCalledWith(qb, paginationArgs);
			expect(result).toBe(paginated);
		});
	});

	describe("update", () => {
		it("delegates to repository and returns updated user", async () => {
			const updated = { id: "u1", fullName: "New Name" };
			vi.mocked(mockUsersRepository.update!).mockResolvedValue(updated as UserModel);

			const result = await buildService().update("u1", { fullName: "New Name" });

			expect(mockUsersRepository.update).toHaveBeenCalledWith("u1", { fullName: "New Name" });
			expect(result).toBe(updated);
		});

		it("returns null when user not found", async () => {
			vi.mocked(mockUsersRepository.update!).mockResolvedValue(null);

			const result = await buildService().update("missing", { fullName: "X" });

			expect(result).toBeNull();
		});
	});
});
