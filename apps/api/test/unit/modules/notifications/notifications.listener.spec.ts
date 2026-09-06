import { NotificationType } from "@/enums";
import { NotificationsListener } from "@/modules/notifications/notifications.listener";
import type { NotificationsService } from "@/modules/notifications/notifications.service";
import type { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { MemberJoinedEvent } from "@/modules/workspace-members/events";
import type { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";

const mockNotificationsService: Partial<NotificationsService> = {
	create: vi.fn(),
};
const mockWorkspaceMembersService: Partial<WorkspaceMembersService> = {
	findAdminsByWorkspaceId: vi.fn(),
};

const buildListener = () =>
	new NotificationsListener(
		mockNotificationsService as NotificationsService,
		mockWorkspaceMembersService as WorkspaceMembersService,
	);

describe("NotificationsListener", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("handleMemberJoined", () => {
		it("creates a notification for each admin, excluding the new member", async () => {
			const admins = [
				{ userId: "admin-1" },
				{ userId: "admin-2" },
				{ userId: "new-member" },
			] as WorkspaceMemberModel[];
			vi.mocked(mockWorkspaceMembersService.findAdminsByWorkspaceId!).mockResolvedValue(admins);
			vi.mocked(mockNotificationsService.create!).mockResolvedValue({} as never);

			await buildListener().handleMemberJoined(
				new MemberJoinedEvent("ws-1", "new-member", "new-member"),
			);

			expect(mockNotificationsService.create).toHaveBeenCalledTimes(2);
			expect(mockNotificationsService.create).toHaveBeenCalledWith({
				recipientId: "admin-1",
				workspaceId: "ws-1",
				actorId: "new-member",
				type: NotificationType.MEMBER_JOINED,
				title: "A new member joined your workspace",
			});
			expect(mockNotificationsService.create).toHaveBeenCalledWith({
				recipientId: "admin-2",
				workspaceId: "ws-1",
				actorId: "new-member",
				type: NotificationType.MEMBER_JOINED,
				title: "A new member joined your workspace",
			});
		});

		it("does nothing when there are no admins in the workspace", async () => {
			vi.mocked(mockWorkspaceMembersService.findAdminsByWorkspaceId!).mockResolvedValue([]);

			await buildListener().handleMemberJoined(new MemberJoinedEvent("ws-1", "user-1", "user-1"));

			expect(mockNotificationsService.create).not.toHaveBeenCalled();
		});

		it("does nothing when the only admin is the new member themselves", async () => {
			const admins = [{ userId: "user-1" }] as WorkspaceMemberModel[];
			vi.mocked(mockWorkspaceMembersService.findAdminsByWorkspaceId!).mockResolvedValue(admins);

			await buildListener().handleMemberJoined(new MemberJoinedEvent("ws-1", "user-1", "user-1"));

			expect(mockNotificationsService.create).not.toHaveBeenCalled();
		});
	});
});
