import { PoliciesGuard } from "@/modules/permissions/guards/policies.guard";
import { Permission } from "@/modules/permissions/permissions.constants";
import type { PermissionService } from "@/modules/permissions/permissions.service";
import { ForbiddenException, type ExecutionContext } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import "reflect-metadata";

const executionContext = () =>
	({
		getHandler: () => () => {},
		getClass: () => class {},
	}) as unknown as ExecutionContext;

const createGuard = (required: Permission[] | undefined) => {
	const reflector = {
		getAllAndOverride: vi.fn().mockReturnValue(required),
	} as unknown as Reflector;
	const assert = vi.fn();
	const permissions = { assert } as unknown as PermissionService;
	return { guard: new PoliciesGuard(reflector, permissions), assert };
};

describe("PoliciesGuard", () => {
	it("allows handlers without a permission requirement", () => {
		const { guard, assert } = createGuard(undefined);
		expect(guard.canActivate(executionContext())).toBe(true);
		expect(assert).not.toHaveBeenCalled();
	});

	it("allows handlers with an empty permission list", () => {
		const { guard, assert } = createGuard([]);
		expect(guard.canActivate(executionContext())).toBe(true);
		expect(assert).not.toHaveBeenCalled();
	});

	it("asserts every required permission and allows when all pass", () => {
		const { guard, assert } = createGuard([Permission.MemberInvite, Permission.MemberRead]);
		expect(guard.canActivate(executionContext())).toBe(true);
		expect(assert).toHaveBeenCalledWith(Permission.MemberInvite);
		expect(assert).toHaveBeenCalledWith(Permission.MemberRead);
	});

	it("propagates ForbiddenException when a permission is denied", () => {
		const { guard, assert } = createGuard([Permission.WorkspaceDelete]);
		assert.mockImplementation(() => {
			throw new ForbiddenException();
		});
		expect(() => guard.canActivate(executionContext())).toThrow(ForbiddenException);
	});
});
