import { WorkspaceMemberRole } from "@/enums";
import { WorkspaceContextGuard } from "@/modules/permissions/guards/workspace-context.guard";
import type { ExecutionContext } from "@nestjs/common";
import "reflect-metadata";

const { getGqlRequest } = vi.hoisted(() => ({ getGqlRequest: vi.fn() }));
vi.mock("@/utils", () => ({ getGqlRequest }));

const ctx = {} as ExecutionContext;

const createGuard = (role: WorkspaceMemberRole | null) => {
	const getMemberRole = vi.fn().mockResolvedValue(role);
	const setWorkspaceContext = vi.fn();
	const guard = new WorkspaceContextGuard(
		{ getMemberRole } as never,
		{ setWorkspaceContext } as never,
	);
	return { guard, getMemberRole, setWorkspaceContext };
};

beforeEach(() => {
	getGqlRequest.mockReset();
});

describe("WorkspaceContextGuard", () => {
	it("does nothing when no workspace header is present", async () => {
		getGqlRequest.mockReturnValue({ headers: {}, user: { userId: "user-1" } });
		const { guard, getMemberRole, setWorkspaceContext } = createGuard(WorkspaceMemberRole.ADMIN);

		await expect(guard.canActivate(ctx)).resolves.toBe(true);
		expect(getMemberRole).not.toHaveBeenCalled();
		expect(setWorkspaceContext).not.toHaveBeenCalled();
	});

	it("caches the member role when the caller belongs to the workspace", async () => {
		getGqlRequest.mockReturnValue({
			headers: { "x-workspace-id": "ws-1" },
			user: { userId: "user-1" },
		});
		const { guard, getMemberRole, setWorkspaceContext } = createGuard(WorkspaceMemberRole.MEMBER);

		await expect(guard.canActivate(ctx)).resolves.toBe(true);
		expect(getMemberRole).toHaveBeenCalledWith("ws-1", "user-1");
		expect(setWorkspaceContext).toHaveBeenCalledWith({
			workspaceId: "ws-1",
			member: { userId: "user-1", role: WorkspaceMemberRole.MEMBER },
		});
	});

	it("caches a null member when the caller is not in the workspace", async () => {
		getGqlRequest.mockReturnValue({
			headers: { "x-workspace-id": "ws-1" },
			user: { userId: "user-1" },
		});
		const { guard, setWorkspaceContext } = createGuard(null);

		await guard.canActivate(ctx);
		expect(setWorkspaceContext).toHaveBeenCalledWith({ workspaceId: "ws-1", member: null });
	});

	it("caches a null member when the request is unauthenticated", async () => {
		getGqlRequest.mockReturnValue({ headers: { "x-workspace-id": "ws-1" }, user: undefined });
		const { guard, getMemberRole, setWorkspaceContext } = createGuard(WorkspaceMemberRole.OWNER);

		await guard.canActivate(ctx);
		expect(getMemberRole).not.toHaveBeenCalled();
		expect(setWorkspaceContext).toHaveBeenCalledWith({ workspaceId: "ws-1", member: null });
	});
});
