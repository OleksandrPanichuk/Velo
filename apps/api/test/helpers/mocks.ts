/**
 * Pre-built vi.fn() mocks for every provider that tests commonly need to stub.
 * Each helper returns a fresh mock object so tests don't share state.
 *
 * Usage:
 *   const repo = mockUsersRepository();
 *   vi.mocked(repo.findByEmail).mockResolvedValue(UserFactory.build());
 */
import type { AppClsService } from "@/infrastructure/cls";
import type { MailerService } from "@/infrastructure/mailer";
import type { NotificationsRepository } from "@/modules/notifications/notifications.repository";
import type { NotificationsService } from "@/modules/notifications/notifications.service";
import type { PermissionsRepository } from "@/modules/permissions/permissions.repository";
import type { UsersRepository } from "@/modules/users/users.repository";
import type { UsersService } from "@/modules/users/users.service";
import type { WorkspaceMembersRepository } from "@/modules/workspace-members/workspace-members.repository";
import type { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import type { WorkspacesRepository } from "@/modules/workspaces/workspaces.repository";
import type { WorkspacesService } from "@/modules/workspaces/workspaces.service";
import type { MailQueue } from "@/queues/mail";
import type { Mock, Mocked } from "vitest";

export const mockUsersRepository = (): Mocked<UsersRepository> =>
	({
		findAll: vi.fn(),
		findById: vi.fn(),
		findByIds: vi.fn(),
		findByEmail: vi.fn(),
		findByEmailWithPassword: vi.fn(),
		findByEmailVerificationToken: vi.fn(),
		findByPasswordResetToken: vi.fn(),
		findByIdWithRefreshToken: vi.fn(),
		findOAuthAccount: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		softDelete: vi.fn(),
		createQueryBuilder: vi.fn(),
		setRefreshToken: vi.fn(),
		clearRefreshToken: vi.fn(),
		verifyEmail: vi.fn(),
		setPasswordResetToken: vi.fn(),
		clearPasswordResetToken: vi.fn(),
		updatePassword: vi.fn(),
		linkOAuthAccount: vi.fn(),
		createUserWithOAuth: vi.fn(),
	}) as never;

export const mockWorkspacesRepository = (): Mocked<WorkspacesRepository> =>
	({
		findAll: vi.fn(),
		findById: vi.fn(),
		findByIds: vi.fn(),
		findByUserId: vi.fn(),
		findBySlug: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		softDelete: vi.fn(),
		createQueryBuilder: vi.fn(),
	}) as never;

export const mockWorkspaceMembersRepository = (): Mocked<WorkspaceMembersRepository> =>
	({
		findAll: vi.fn(),
		findById: vi.fn(),
		findByIds: vi.fn(),
		findAdminsByWorkspaceId: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		softDelete: vi.fn(),
		createQueryBuilder: vi.fn(),
	}) as never;

export const mockNotificationsRepository = (): Mocked<NotificationsRepository> =>
	({
		findAll: vi.fn(),
		findById: vi.fn(),
		findByIds: vi.fn(),
		findByRecipientAndWorkspace: vi.fn(),
		countUnread: vi.fn(),
		markAsRead: vi.fn(),
		markAllAsRead: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		softDelete: vi.fn(),
		createQueryBuilder: vi.fn(),
	}) as never;

export const mockPermissionsRepository = (): Mocked<PermissionsRepository> =>
	({
		getMemberRole: vi.fn(),
	}) as never;

export const mockUsersService = (): Mocked<UsersService> =>
	({
		findAll: vi.fn(),
		findById: vi.fn(),
		findByIds: vi.fn(),
		findAllPaginated: vi.fn(),
		update: vi.fn(),
	}) as never;

export const mockWorkspacesService = (): Mocked<WorkspacesService> =>
	({
		findByUserId: vi.fn(),
		findBySlug: vi.fn(),
		create: vi.fn(),
	}) as never;

export const mockWorkspaceMembersService = (): Mocked<WorkspaceMembersService> =>
	({
		create: vi.fn(),
		createRootMember: vi.fn(),
		findAdminsByWorkspaceId: vi.fn(),
	}) as never;

export const mockNotificationsService = (): Mocked<NotificationsService> =>
	({
		create: vi.fn(),
		findByRecipientAndWorkspace: vi.fn(),
		countUnread: vi.fn(),
		markAsRead: vi.fn(),
		markAllAsRead: vi.fn(),
	}) as never;

export const mockMailQueue = (): Mocked<MailQueue> =>
	({
		enqueueEmailVerification: vi.fn(),
		enqueuePasswordReset: vi.fn(),
		enqueueWelcome: vi.fn(),
		enqueueSignInAlert: vi.fn(),
	}) as never;

export const mockMailerService = (): Mocked<MailerService> =>
	({
		send: vi.fn(),
		sendWelcome: vi.fn(),
		sendPasswordReset: vi.fn(),
		sendEmailVerification: vi.fn(),
		sendSignInAlert: vi.fn(),
	}) as never;

export const mockPubSub = () => ({
	publish: vi.fn(),
	asyncIterator: vi.fn(),
});

export type MockClsService = Omit<Mocked<AppClsService>, "response"> & {
	readonly response: { setHeader: Mock<(name: string, value: string[]) => void> };
};

export const mockClsService = (userId = "user-id"): MockClsService => {
	const response = { setHeader: vi.fn<(name: string, value: string[]) => void>() };
	return {
		get userId() {
			return userId;
		},
		setUserId: vi.fn(),
		get response() {
			return response as never;
		},
		setResponse: vi.fn(),
		get workspaceContext() {
			return null;
		},
		setWorkspaceContext: vi.fn(),
		get requestId() {
			return "req-id";
		},
	} as never;
};
