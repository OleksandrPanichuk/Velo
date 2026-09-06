/**
 * Integration test for the event-driven notifications flow.
 *
 * Proves that WorkspaceMembersService.create() → MemberJoinedEvent →
 * NotificationsListener → NotificationsService.create() is wired together
 * correctly via EventEmitter2, with no mocks on the service layer.
 */
import { PUBSUB } from "@/infrastructure/pubsub/pubsub.constants";
import { MemberJoinedEvent } from "@/modules/workspace-members/events";
import { WorkspaceMembersRepository } from "@/modules/workspace-members/workspace-members.repository";
import { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { NotificationsListener } from "@/modules/notifications/notifications.listener";
import { NotificationsRepository } from "@/modules/notifications/notifications.repository";
import { NotificationsService } from "@/modules/notifications/notifications.service";
import { WorkspaceMemberRole } from "@/enums";
import { Test, type TestingModule } from "@nestjs/testing";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";
import {
	mockWorkspaceMembersRepository,
	mockNotificationsRepository,
	mockPubSub,
} from "../../../helpers/mocks";
import { UserFactory, WorkspaceMemberFactory, NotificationFactory } from "../../../factories";

const WORKSPACE_ID = "ws-integration-1";

let module: TestingModule;
let workspaceMembersService: WorkspaceMembersService;
let wmRepo: ReturnType<typeof mockWorkspaceMembersRepository>;
let notifRepo: ReturnType<typeof mockNotificationsRepository>;
let pubSub: ReturnType<typeof mockPubSub>;

beforeAll(async () => {
	wmRepo = mockWorkspaceMembersRepository();
	notifRepo = mockNotificationsRepository();
	pubSub = mockPubSub();

	module = await Test.createTestingModule({
		imports: [EventEmitterModule.forRoot({ wildcard: true, delimiter: "." })],
		providers: [
			WorkspaceMembersService,
			{ provide: WorkspaceMembersRepository, useValue: wmRepo },
			NotificationsService,
			{ provide: NotificationsRepository, useValue: notifRepo },
			{ provide: PUBSUB, useValue: pubSub },
			NotificationsListener,
		],
	}).compile();

	workspaceMembersService = module.get(WorkspaceMembersService);
	await module.init();
});

afterAll(async () => module.close());
beforeEach(() => vi.clearAllMocks());

describe("Notifications event-driven flow", () => {
	it("notifies all admins except the new member when a member joins", async () => {
		const newMember = UserFactory.build();
		const owner = UserFactory.build();
		const admin = UserFactory.build();

		vi.mocked(wmRepo.create).mockResolvedValue(
			WorkspaceMemberFactory.build({ userId: newMember.id, workspaceId: WORKSPACE_ID }),
		);
		vi.mocked(wmRepo.findAdminsByWorkspaceId).mockResolvedValue([
			WorkspaceMemberFactory.buildOwner({ userId: owner.id, workspaceId: WORKSPACE_ID }),
			WorkspaceMemberFactory.buildAdmin({ userId: admin.id, workspaceId: WORKSPACE_ID }),
			WorkspaceMemberFactory.build({ userId: newMember.id, workspaceId: WORKSPACE_ID }),
		]);
		vi.mocked(notifRepo.create).mockResolvedValue(NotificationFactory.build());
		vi.mocked(pubSub.publish).mockResolvedValue(undefined);

		await workspaceMembersService.create({
			workspaceId: WORKSPACE_ID,
			userId: newMember.id,
			actorId: newMember.id,
			role: WorkspaceMemberRole.MEMBER,
		});

		expect(notifRepo.create).toHaveBeenCalledTimes(2);

		const recipientIds = vi.mocked(notifRepo.create).mock.calls.map((c) => c[0].recipientId);
		expect(recipientIds).toContain(owner.id);
		expect(recipientIds).toContain(admin.id);
		expect(recipientIds).not.toContain(newMember.id);
	});

	it("sends no notifications when the only admin is the new member", async () => {
		const newMember = UserFactory.build();

		vi.mocked(wmRepo.create).mockResolvedValue(
			WorkspaceMemberFactory.build({ userId: newMember.id }),
		);
		vi.mocked(wmRepo.findAdminsByWorkspaceId).mockResolvedValue([
			WorkspaceMemberFactory.buildOwner({ userId: newMember.id }),
		]);

		await workspaceMembersService.create({
			workspaceId: WORKSPACE_ID,
			userId: newMember.id,
			actorId: newMember.id,
			role: WorkspaceMemberRole.MEMBER,
		});

		expect(notifRepo.create).not.toHaveBeenCalled();
	});

	it("sets correct recipientId, workspaceId, and actorId on each notification", async () => {
		const newMember = UserFactory.build();
		const owner = UserFactory.build();

		vi.mocked(wmRepo.create).mockResolvedValue(
			WorkspaceMemberFactory.build({ userId: newMember.id, workspaceId: WORKSPACE_ID }),
		);
		vi.mocked(wmRepo.findAdminsByWorkspaceId).mockResolvedValue([
			WorkspaceMemberFactory.buildOwner({ userId: owner.id, workspaceId: WORKSPACE_ID }),
		]);
		vi.mocked(notifRepo.create).mockResolvedValue(NotificationFactory.build());
		vi.mocked(pubSub.publish).mockResolvedValue(undefined);

		await workspaceMembersService.create({
			workspaceId: WORKSPACE_ID,
			userId: newMember.id,
			actorId: newMember.id,
			role: WorkspaceMemberRole.MEMBER,
		});

		expect(notifRepo.create).toHaveBeenCalledWith(
			expect.objectContaining({
				recipientId: owner.id,
				workspaceId: WORKSPACE_ID,
				actorId: newMember.id,
			}),
		);
	});

	it("publishes to pubsub once per notification created", async () => {
		const newMember = UserFactory.build();
		const owner = UserFactory.build();
		const admin = UserFactory.build();

		vi.mocked(wmRepo.create).mockResolvedValue(
			WorkspaceMemberFactory.build({ userId: newMember.id }),
		);
		vi.mocked(wmRepo.findAdminsByWorkspaceId).mockResolvedValue([
			WorkspaceMemberFactory.buildOwner({ userId: owner.id }),
			WorkspaceMemberFactory.buildAdmin({ userId: admin.id }),
		]);
		vi.mocked(notifRepo.create).mockResolvedValue(NotificationFactory.build());
		vi.mocked(pubSub.publish).mockResolvedValue(undefined);

		await workspaceMembersService.create({
			workspaceId: WORKSPACE_ID,
			userId: newMember.id,
			actorId: newMember.id,
			role: WorkspaceMemberRole.MEMBER,
		});

		expect(pubSub.publish).toHaveBeenCalledTimes(2);
	});

	it("emitting MemberJoinedEvent directly also triggers the listener", async () => {
		const eventEmitter = module.get(EventEmitter2);
		const newMember = UserFactory.build();
		const owner = UserFactory.build();

		vi.mocked(wmRepo.findAdminsByWorkspaceId).mockResolvedValue([
			WorkspaceMemberFactory.buildOwner({ userId: owner.id, workspaceId: WORKSPACE_ID }),
		]);
		vi.mocked(notifRepo.create).mockResolvedValue(NotificationFactory.build());
		vi.mocked(pubSub.publish).mockResolvedValue(undefined);

		await eventEmitter.emitAsync(
			MemberJoinedEvent.EVENT,
			new MemberJoinedEvent(WORKSPACE_ID, newMember.id, newMember.id),
		);

		expect(notifRepo.create).toHaveBeenCalledWith(
			expect.objectContaining({ recipientId: owner.id }),
		);
	});
});
