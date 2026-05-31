import "reflect-metadata";
import { WorkspaceMemberRole } from "@/enums";
import { ClsKeys } from "@/infrastructure/cls/cls.constants";
import { AppClsService } from "@/infrastructure/cls/cls.service";
import type { WorkspaceContext } from "@/modules/permissions/permissions.types";

const createFakeCls = () => {
	const store = new Map<string, unknown>();
	return {
		get: (key: string) => store.get(key),
		set: (key: string, value: unknown) => store.set(key, value),
		getId: () => "req-1",
	};
};

describe("AppClsService workspace context", () => {
	it("stores and reads the workspace context", () => {
		const cls = createFakeCls();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const service = new AppClsService(cls as any);
		const ctx: WorkspaceContext = {
			workspaceId: "ws-1",
			member: { userId: "user-1", role: WorkspaceMemberRole.ADMIN },
		};

		service.setWorkspaceContext(ctx);

		expect(service.workspaceContext).toEqual(ctx);
		expect(cls.get(ClsKeys.WORKSPACE_CONTEXT)).toEqual(ctx);
	});

	it("returns undefined when no workspace context is set", () => {
		const cls = createFakeCls();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const service = new AppClsService(cls as any);

		expect(service.workspaceContext).toBeUndefined();
	});
});