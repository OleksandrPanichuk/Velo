import { WorkspaceMemberRole } from "@/enums";
import type { WorkspaceMembersRepository } from "@/modules/workspace-members/workspace-members.repository";
import { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import type { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";

const mockRepo: Partial<WorkspaceMembersRepository> = {
  create: vi.fn(),
  findAdminsByWorkspaceId: vi.fn(),
};

const buildService = () =>
  new WorkspaceMembersService(mockRepo as WorkspaceMembersRepository);

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

  describe("create", () => {
    it("creates the member record", async () => {
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
      });

      expect(mockRepo.create).toHaveBeenCalledWith({
        workspaceId: "ws-1",
        userId: "user-1",
        role: WorkspaceMemberRole.MEMBER,
      });
      expect(result).toBe(member);
    });
  });
});
