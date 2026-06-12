import { IS_PUBLIC_KEY } from "@/shared/decorators";
import { AppAuthGuard } from "@/shared/guards/app-auth.guard";
import { JwtAccessGuard } from "@/modules/auth/auth.guards";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

const mockReflector = { getAllAndOverride: vi.fn() };

const buildGuard = () => new AppAuthGuard(mockReflector as unknown as Reflector);

const makeContext = (): ExecutionContext =>
	({
		getHandler: vi.fn(),
		getClass: vi.fn(),
	}) as unknown as ExecutionContext;

describe("AppAuthGuard", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("canActivate", () => {
		it("returns true for public routes even when super would reject", async () => {
			mockReflector.getAllAndOverride.mockReturnValue(true);
			vi.spyOn(JwtAccessGuard.prototype, "canActivate").mockReturnValue(
				Promise.reject(new Error("Unauthorized")),
			);

			const result = await buildGuard().canActivate(makeContext());

			expect(result).toBe(true);
		});

		it("returns true for public routes when super succeeds", async () => {
			mockReflector.getAllAndOverride.mockReturnValue(true);
			vi.spyOn(JwtAccessGuard.prototype, "canActivate").mockResolvedValue(true as never);

			const result = await buildGuard().canActivate(makeContext());

			expect(result).toBe(true);
		});

		it("delegates to super.canActivate for protected routes", async () => {
			mockReflector.getAllAndOverride.mockReturnValue(false);
			vi.spyOn(JwtAccessGuard.prototype, "canActivate").mockResolvedValue(true as never);

			const ctx = makeContext();
			const result = await buildGuard().canActivate(ctx);

			expect(result).toBe(true);
			expect(JwtAccessGuard.prototype.canActivate).toHaveBeenCalledWith(ctx);
		});

		it("propagates rejection from super for protected routes", async () => {
			mockReflector.getAllAndOverride.mockReturnValue(false);
			vi.spyOn(JwtAccessGuard.prototype, "canActivate").mockReturnValue(
				Promise.reject(new Error("Unauthorized")),
			);

			await expect(buildGuard().canActivate(makeContext())).rejects.toThrow("Unauthorized");
		});

		it("checks IS_PUBLIC_KEY on handler and class", () => {
			const ctx = makeContext();
			mockReflector.getAllAndOverride.mockReturnValue(false);
			vi.spyOn(JwtAccessGuard.prototype, "canActivate").mockResolvedValue(true as never);

			buildGuard().canActivate(ctx);

			expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
				ctx.getHandler(),
				ctx.getClass(),
			]);
		});
	});
});
