import { WorkspaceMemberRole } from "@/enums";
import { AppClsService, ClsKeys } from "@/infrastructure/cls";
import { type WorkspaceContext } from "@/modules/permissions";
import { type ServerResponse } from "node:http";

const mockCls = {
	getId: vi.fn(),
	get: vi.fn(),
	set: vi.fn(),
};

describe("`AppClsService`", () => {
	let service: AppClsService;

	beforeEach(() => {
		service = new AppClsService(mockCls as never);
		vi.clearAllMocks();
	});

	describe("requestId", () => {
		it("returns the value from cls.getId()", () => {
			mockCls.getId.mockReturnValue("req-123");

			expect(service.requestId).toBe("req-123");
			expect(mockCls.getId).toHaveBeenCalled();
		});
	});

	describe("userId", () => {
		it("returns the userId from the CLS store", () => {
			mockCls.get.mockReturnValue("user-abc");

			expect(service.userId).toBe("user-abc");
			expect(mockCls.get).toHaveBeenCalledWith(ClsKeys.USER_ID);
		});

		it("returns undefined when userId is not set", () => {
			mockCls.get.mockReturnValue(undefined);

			expect(service.userId).toBeUndefined();
		});
	});

	describe("setUserId", () => {
		it("stores the userId under ClsKeys.USER_ID", () => {
			service.setUserId("user-abc");

			expect(mockCls.set).toHaveBeenCalledWith(ClsKeys.USER_ID, "user-abc");
		});
	});

	describe("response", () => {
		it("returns the response from the CLS store", () => {
			const res = { statusCode: 200 } as unknown as ServerResponse;
			mockCls.get.mockReturnValue(res);

			expect(service.response).toBe(res);
			expect(mockCls.get).toHaveBeenCalledWith(ClsKeys.RESPONSE);
		});

		it("returns undefined when response is not set", () => {
			mockCls.get.mockReturnValue(undefined);

			expect(service.response).toBeUndefined();
		});
	});

	describe("setResponse", () => {
		it("stores the response under ClsKeys.RESPONSE", () => {
			const res = { statusCode: 200 } as unknown as ServerResponse;

			service.setResponse(res);

			expect(mockCls.set).toHaveBeenCalledWith(ClsKeys.RESPONSE, res);
		});
	});

	describe("workspaceContext", () => {
		it("returns the workspace context from the CLS store", () => {
			const context: WorkspaceContext = {
				workspaceId: "ws-1",
				member: { userId: "user-abc", role: WorkspaceMemberRole.ADMIN },
			};
			mockCls.get.mockReturnValue(context);

			expect(service.workspaceContext).toBe(context);
			expect(mockCls.get).toHaveBeenCalledWith(ClsKeys.WORKSPACE_CONTEXT);
		});

		it("returns undefined when workspace context is not set", () => {
			mockCls.get.mockReturnValue(undefined);

			expect(service.workspaceContext).toBeUndefined();
		});
	});

	describe("setWorkspaceContext", () => {
		it("stores the workspace context under ClsKeys.WORKSPACE_CONTEXT", () => {
			const context: WorkspaceContext = {
				workspaceId: "ws-1",
				member: null,
			};

			service.setWorkspaceContext(context);

			expect(mockCls.set).toHaveBeenCalledWith(ClsKeys.WORKSPACE_CONTEXT, context);
		});
	});
});
