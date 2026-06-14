/**
 * Integration test for the event-driven notifications flow.
 *
 * Proves that WorkspaceMembersService.create() → MemberJoinedEvent →
 * NotificationsListener → NotificationsService.create() is wired together
 * correctly via EventEmitter2, with no mocks on the service layer.
 */
import { PUBSUB } from "@/infrastructure/pubsub/pubsub.constants";
import { NotificationModel } from "@/models/Notification.model";
import { MemberJoinedEvent } from "@/modules/workspace-members/events";
import { WorkspaceMembersRepository } from "@/modules/workspace-members/workspace-members.repository";
import { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { NotificationsListener } from "@/modules/notifications/notifications.listener";
import { NotificationsRepository } from "@/modules/notifications/notifications.repository";
import { NotificationsService } from "@/modules/notifications/notifications.service";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { TestingModule, Test } from "@nestjs/testing";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";

const OWNER_ID = "owner-1";
const ADMIN_ID = "admin-1";
const NEW_MEMBER_ID = "new-member-1";
const WORKSPACE_ID = "ws-1";

const makeAdmin = (userId: string) => ({ userId }) as WorkspaceMemberModel;

const mockWorkspaceMembersRepository: Partial<WorkspaceMembersRepository> = {
	create: vi.fn(),
	findAdminsByWorkspaceId: vi.fn(),
};

const mockNotificationsRepository: Partial<NotificationsRepository> = {
	create: vi.fn(),
};

const mockPubSub = { publish: vi.fn() };

let module: TestingModule;
let workspaceMembersService: WorkspaceMembersService;
let notificationsService: NotificationsService;

beforeAll(async () => {
	module = await Test.createTestingModule({
		imports: [EventEmitterModule.forRoot({ wildcard: true, delimiter: "." })],
		providers: [
			WorkspaceMembersService,
			{ provide: WorkspaceMembersRepository, useValue: mockWorkspaceMembersRepository },
			NotificationsService,
			{ provide: NotificationsRepository, useValue: mockNotificationsRepository },
			{ provide: PUBSUB, useValue: mockPubSub },
			NotificationsListener,
		],
	}).compile();

	workspaceMembersService = module.get(WorkspaceMembersService);
	notificationsService = module.get(NotificationsService);

	await module.init();
});

afterAll(async () => {
	await module.close();
});

describe("Notifications event-driven flow", () => {
	beforeEach(() => vi.clearAllMocks());

	it("creates notifications for all admins except the new member when a member joins", async () => {
		vi.mocked(mockWorkspaceMembersRepository.create!).mockResolvedValue({
			userId: NEW_MEMBER_ID,
		} as WorkspaceMemberModel);

		vi.mocked(mockWorkspaceMembersRepository.findAdminsByWorkspaceId!).mockResolvedValue([
			makeAdmin(OWNER_ID),
			makeAdmin(ADMIN_ID),
			makeAdmin(NEW_MEMBER_ID),
		]);

		vi.mocked(mockNotificationsRepository.create!).mockResolvedValue({} as NotificationModel);
		vi.mocked(mockPubSub.publish).mockResolvedValue(undefined);

		await workspaceMembersService.create({
			workspaceId: WORKSPACE_ID,
			userId: NEW_MEMBER_ID,
			actorId: NEW_MEMBER_ID,
			role: "member" as never,
		});

		expect(mockNotificationsRepository.create).toHaveBeenCalledTimes(2);

		const calls = vi.mocked(mockNotificationsRepository.create!).mock.calls;
		const recipientIds = calls.map((c) => c[0].recipientId);
		expect(recipientIds).toContain(OWNER_ID);
		expect(recipientIds).toContain(ADMIN_ID);
		expect(recipientIds).not.toContain(NEW_MEMBER_ID);
	});

	it("sends no notifications when the only admin is the new member", async () => {
		vi.mocked(mockWorkspaceMembersRepository.create!).mockResolvedValue({
			userId: NEW_MEMBER_ID,
		} as WorkspaceMemberModel);

		vi.mocked(mockWorkspaceMembersRepository.findAdminsByWorkspaceId!).mockResolvedValue([
			makeAdmin(NEW_MEMBER_ID),
		]);

		await workspaceMembersService.create({
			workspaceId: WORKSPACE_ID,
			userId: NEW_MEMBER_ID,
			actorId: NEW_MEMBER_ID,
			role: "member" as never,
		});

		expect(mockNotificationsRepository.create).not.toHaveBeenCalled();
	});

	it("sets recipientId, workspaceId, and actorId correctly on each notification", async () => {
		vi.mocked(mockWorkspaceMembersRepository.create!).mockResolvedValue({
			userId: NEW_MEMBER_ID,
		} as WorkspaceMemberModel);

		vi.mocked(mockWorkspaceMembersRepository.findAdminsByWorkspaceId!).mockResolvedValue([
			makeAdmin(OWNER_ID),
		]);

		vi.mocked(mockNotificationsRepository.create!).mockResolvedValue({} as NotificationModel);
		vi.mocked(mockPubSub.publish).mockResolvedValue(undefined);

		await workspaceMembersService.create({
			workspaceId: WORKSPACE_ID,
			userId: NEW_MEMBER_ID,
			actorId: NEW_MEMBER_ID,
			role: "member" as never,
		});

		expect(mockNotificationsRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				recipientId: OWNER_ID,
				workspaceId: WORKSPACE_ID,
				actorId: NEW_MEMBER_ID,
			}),
		);
	});

	it("publishes to pubsub for each notification created", async () => {
		vi.mocked(mockWorkspaceMembersRepository.create!).mockResolvedValue({
			userId: NEW_MEMBER_ID,
		} as WorkspaceMemberModel);

		vi.mocked(mockWorkspaceMembersRepository.findAdminsByWorkspaceId!).mockResolvedValue([
			makeAdmin(OWNER_ID),
			makeAdmin(ADMIN_ID),
		]);

		vi.mocked(mockNotificationsRepository.create!).mockResolvedValue({
			id: "notif-1",
		} as NotificationModel);

		vi.mocked(mockPubSub.publish).mockResolvedValue(undefined);

		await workspaceMembersService.create({
			workspaceId: WORKSPACE_ID,
			userId: NEW_MEMBER_ID,
			actorId: NEW_MEMBER_ID,
			role: "member" as never,
		});

		expect(mockPubSub.publish).toHaveBeenCalledTimes(2);
	});

	it("emits MemberJoinedEvent directly and triggers listener", async () => {
		const eventEmitter = module.get(EventEmitter2);

		vi.mocked(mockWorkspaceMembersRepository.findAdminsByWorkspaceId!).mockResolvedValue([
			makeAdmin(OWNER_ID),
		]);
		vi.mocked(mockNotificationsRepository.create!).mockResolvedValue({} as NotificationModel);
		vi.mocked(mockPubSub.publish).mockResolvedValue(undefined);

		await eventEmitter.emitAsync(
			MemberJoinedEvent.EVENT,
			new MemberJoinedEvent(WORKSPACE_ID, NEW_MEMBER_ID, NEW_MEMBER_ID),
		);

		expect(mockNotificationsRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({ recipientId: OWNER_ID }),
		);
	});
});
