import { WorkspaceMemberRole } from "@/enums";
import type { WorkspaceMembersRepository } from "@/modules/workspace-members/workspace-members.repository";
import { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { MemberJoinedEvent } from "@/modules/workspace-members/events";
import type { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import type { EventEmitter2 } from "@nestjs/event-emitter";

const mockRepo: Partial<WorkspaceMembersRepository> = {
	create: vi.fn(),
	findAdminsByWorkspaceId: vi.fn(),
	findByWorkspaceId: vi.fn(),
	findOneByWorkspaceAndUser: vi.fn(),
};
const mockEventEmitter: Partial<EventEmitter2> = { emit: vi.fn(), emitAsync: vi.fn() };

const buildService = () =>
	new WorkspaceMembersService(
		mockRepo as WorkspaceMembersRepository,
		mockEventEmitter as EventEmitter2,
	);

describe("WorkspaceMembersService", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("findAdminsByWorkspaceId", () => {
		it("delegates to the repository", async () => {
			const members = [{ userId: "admin-1", role: WorkspaceMemberRole.ADMIN }];
			vi.mocked(mockRepo.findAdminsByWorkspaceId!).mockResolvedValue(members as never);

			const result = await buildService().findAdminsByWorkspaceId("ws-1");

			expect(mockRepo.findAdminsByWorkspaceId).toHaveBeenCalledWith("ws-1");
			expect(result).toBe(members);
		});
	});

	describe("findByWorkspaceId", () => {
		it("delegates to the repository", async () => {
			const members = [{ id: "mem-1", workspaceId: "ws-1" }];
			vi.mocked(mockRepo.findByWorkspaceId!).mockResolvedValue(members as never);

			const result = await buildService().findByWorkspaceId("ws-1");

			expect(mockRepo.findByWorkspaceId).toHaveBeenCalledWith("ws-1");
			expect(result).toBe(members);
		});
	});

	describe("findOneByWorkspaceAndUser", () => {
		it("delegates to the repository", async () => {
			const member = { id: "mem-1", workspaceId: "ws-1", userId: "user-1" };
			vi.mocked(mockRepo.findOneByWorkspaceAndUser!).mockResolvedValue(member as never);

			const result = await buildService().findOneByWorkspaceAndUser("ws-1", "user-1");

			expect(mockRepo.findOneByWorkspaceAndUser).toHaveBeenCalledWith("ws-1", "user-1");
			expect(result).toBe(member);
		});

		it("returns null when there is no membership", async () => {
			vi.mocked(mockRepo.findOneByWorkspaceAndUser!).mockResolvedValue(null);

			const result = await buildService().findOneByWorkspaceAndUser("ws-1", "outsider");

			expect(result).toBeNull();
		});
	});

	describe("create", () => {
		it("creates the member record and emits MemberJoinedEvent", async () => {
			const member = {
				id: "mem-1",
				workspaceId: "ws-1",
				userId: "user-1",
				role: WorkspaceMemberRole.MEMBER,
			} as WorkspaceMemberModel;
			vi.mocked(mockRepo.create!).mockResolvedValue(member);

			const result = await buildService().create({
				workspaceId: "ws-1",
				userId: "user-1",
				role: WorkspaceMemberRole.MEMBER,
				actorId: "actor-1",
			});

			expect(mockRepo.create).toHaveBeenCalledWith({
				workspaceId: "ws-1",
				userId: "user-1",
				role: WorkspaceMemberRole.MEMBER,
			});
			expect(mockEventEmitter.emitAsync).toHaveBeenCalledWith(
				MemberJoinedEvent.EVENT,
				new MemberJoinedEvent("ws-1", "user-1", "actor-1"),
			);
			expect(result).toBe(member);
		});
	});

	describe("createRootMember", () => {
		it("creates the owner membership with role OWNER", async () => {
			const member = {
				id: "mem-1",
				workspaceId: "ws-1",
				userId: "user-1",
				role: WorkspaceMemberRole.OWNER,
			} as WorkspaceMemberModel;
			vi.mocked(mockRepo.create!).mockResolvedValue(member);

			const result = await buildService().createRootMember({
				workspaceId: "ws-1",
				userId: "user-1",
			});

			expect(mockRepo.create).toHaveBeenCalledTimes(1);
			expect(mockRepo.create).toHaveBeenCalledWith({
				workspaceId: "ws-1",
				userId: "user-1",
				role: WorkspaceMemberRole.OWNER,
			});
			expect(result).toBe(member);
		});

		it("does not emit MemberJoinedEvent — an owner is not notified about joining their own workspace", async () => {
			vi.mocked(mockRepo.create!).mockResolvedValue({
				id: "mem-1",
				workspaceId: "ws-1",
				userId: "user-1",
				role: WorkspaceMemberRole.OWNER,
			} as WorkspaceMemberModel);

			await buildService().createRootMember({ workspaceId: "ws-1", userId: "user-1" });

			expect(mockEventEmitter.emitAsync).not.toHaveBeenCalled();
			expect(mockEventEmitter.emit).not.toHaveBeenCalled();
		});
	});
});
