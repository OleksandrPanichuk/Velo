/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
	| T
	| { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
/** Input for creating a workspace */
export type CreateWorkspaceInput = {
	/** The professional role of the creator */
	jobRole: MemberJobRole | null | undefined;
	/** The name of the workspace */
	name: string;
	/** The size of the workspace team */
	size: WorkspaceSize | null | undefined;
	/** The slug of the workspace */
	slug: string;
};

/** Email to send a password reset link to */
export type ForgotPasswordInput = {
	/** The email address associated with the account */
	email: string;
};

/** Input for inviting someone to a workspace */
export type InviteMemberInput = {
	/** The email address to send the invite to */
	email: string;
	/** The role the invitee will get once accepted */
	role: WorkspaceInviteRole;
	/** The workspace to invite the person into */
	workspaceId: string;
};

/** The professional role of a workspace member */
export type MemberJobRole = "DESIGNER" | "DEVELOPER" | "OTHER" | "PM";

export type NotificationType = "MEMBER_JOINED";

/** New password and the reset token from the email link */
export type ResetPasswordInput = {
	/** The new password (minimum 8 characters) */
	password: string;
	/** The password reset token from the email link */
	token: string;
};

/** Credentials required to sign in to an existing account */
export type SignInInput = {
	/** The email address associated with the account */
	email: string;
	/** The account password (minimum 8 characters) */
	password: string;
};

/** Details required to register a new user account */
export type SignUpInput = {
	/** A unique, valid email address */
	email: string;
	/** Full display name */
	fullName: string;
	/** A strong password of at least 8 characters */
	password: string;
	/** A unique display name between 3 and 35 characters */
	username: string;
};

export type WorkspaceInviteRole = "ADMIN" | "GUEST" | "MEMBER";

export type WorkspaceMemberRole = "ADMIN" | "GUEST" | "MEMBER" | "OWNER";

/** The size of the workspace team */
export type WorkspaceSize = "ENTERPRISE" | "LARGE" | "MEDIUM" | "SMALL";

export type SignInMutationVariables = Exact<{
	input: SignInInput;
}>;

export type SignInMutation = {
	signIn: {
		id: string;
		email: string;
		username: string;
		fullName: string;
		avatarUrl: string | null;
		timezone: string;
		locale: string;
		isEmailVerified: boolean;
		createdAt: string;
		updatedAt: string;
	};
};

export type SignUpMutationVariables = Exact<{
	input: SignUpInput;
}>;

export type SignUpMutation = {
	signUp: {
		id: string;
		email: string;
		username: string;
		fullName: string;
		avatarUrl: string | null;
		timezone: string;
		locale: string;
		isEmailVerified: boolean;
		createdAt: string;
		updatedAt: string;
	};
};

export type RefreshMutationVariables = Exact<{ [key: string]: never }>;

export type RefreshMutation = {
	refresh: {
		id: string;
		email: string;
		username: string;
		fullName: string;
		avatarUrl: string | null;
		timezone: string;
		locale: string;
		isEmailVerified: boolean;
		createdAt: string;
		updatedAt: string;
	};
};

export type SignOutMutationVariables = Exact<{ [key: string]: never }>;

export type SignOutMutation = { signOut: boolean };

export type VerifyEmailMutationVariables = Exact<{
	token: string;
}>;

export type VerifyEmailMutation = { verifyEmail: boolean };

export type ForgotPasswordMutationVariables = Exact<{
	input: ForgotPasswordInput;
}>;

export type ForgotPasswordMutation = { forgotPassword: boolean };

export type ResetPasswordMutationVariables = Exact<{
	input: ResetPasswordInput;
}>;

export type ResetPasswordMutation = { resetPassword: boolean };

export type WorkspaceInviteBaseFragment = {
	id: string;
	email: string;
	role: WorkspaceInviteRole;
	expiresAt: string;
	acceptedAt: string | null;
	createdAt: string;
	inviter: {
		id: string;
		role: WorkspaceMemberRole;
		joinedAt: string;
		user: {
			id: string;
			fullName: string;
			username: string;
			avatarUrl: string | null;
			email: string;
		};
	};
};

export type InviteMemberMutationVariables = Exact<{
	input: InviteMemberInput;
}>;

export type InviteMemberMutation = {
	inviteMember: {
		id: string;
		email: string;
		role: WorkspaceInviteRole;
		expiresAt: string;
		acceptedAt: string | null;
		createdAt: string;
		inviter: {
			id: string;
			role: WorkspaceMemberRole;
			joinedAt: string;
			user: {
				id: string;
				fullName: string;
				username: string;
				avatarUrl: string | null;
				email: string;
			};
		};
	};
};

export type RevokeInviteMutationVariables = Exact<{
	id: string;
}>;

export type RevokeInviteMutation = { revokeInvite: boolean };

export type AcceptInviteMutationVariables = Exact<{
	token: string;
}>;

export type AcceptInviteMutation = {
	acceptInvite: {
		id: string;
		slug: string;
		name: string;
		logo: { url: string; originalName: string } | null;
	};
};

export type GetPendingInvitesQueryVariables = Exact<{
	workspaceId: string;
}>;

export type GetPendingInvitesQuery = {
	pendingInvites: Array<{
		id: string;
		email: string;
		role: WorkspaceInviteRole;
		expiresAt: string;
		acceptedAt: string | null;
		createdAt: string;
		inviter: {
			id: string;
			role: WorkspaceMemberRole;
			joinedAt: string;
			user: {
				id: string;
				fullName: string;
				username: string;
				avatarUrl: string | null;
				email: string;
			};
		};
	}>;
};

export type NotificationBaseFragment = {
	id: string;
	type: NotificationType;
	title: string;
	body: string | null;
	isRead: boolean;
	createdAt: string;
	workspaceId: string;
	actor: { id: string; fullName: string; username: string; avatarUrl: string | null } | null;
};

export type MarkNotificationAsReadMutationVariables = Exact<{
	id: string;
}>;

export type MarkNotificationAsReadMutation = {
	markNotificationAsRead: {
		id: string;
		type: NotificationType;
		title: string;
		body: string | null;
		isRead: boolean;
		createdAt: string;
		workspaceId: string;
		actor: { id: string; fullName: string; username: string; avatarUrl: string | null } | null;
	};
};

export type MarkAllNotificationsAsReadMutationVariables = Exact<{
	workspaceId: string;
}>;

export type MarkAllNotificationsAsReadMutation = { markAllNotificationsAsRead: boolean };

export type GetNotificationsQueryVariables = Exact<{
	workspaceId: string;
}>;

export type GetNotificationsQuery = {
	notifications: Array<{
		id: string;
		type: NotificationType;
		title: string;
		body: string | null;
		isRead: boolean;
		createdAt: string;
		workspaceId: string;
		actor: { id: string; fullName: string; username: string; avatarUrl: string | null } | null;
	}>;
};

export type UserFieldsFragment = {
	id: string;
	email: string;
	username: string;
	fullName: string;
	avatarUrl: string | null;
	timezone: string;
	locale: string;
	isEmailVerified: boolean;
	createdAt: string;
	updatedAt: string;
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetUsersQuery = {
	getUsers: {
		totalCount: number;
		nodes: Array<{
			id: string;
			email: string;
			username: string;
			fullName: string;
			avatarUrl: string | null;
			timezone: string;
			locale: string;
			isEmailVerified: boolean;
			createdAt: string;
			updatedAt: string;
		}> | null;
		pageInfo: {
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			startCursor: string | null;
			endCursor: string | null;
		};
	};
};

export type GetUserByIdQueryVariables = Exact<{
	id: string;
}>;

export type GetUserByIdQuery = {
	getUserById: {
		id: string;
		email: string;
		username: string;
		fullName: string;
		avatarUrl: string | null;
		timezone: string;
		locale: string;
		isEmailVerified: boolean;
		createdAt: string;
		updatedAt: string;
	} | null;
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetCurrentUserQuery = {
	getCurrentUser: {
		id: string;
		email: string;
		username: string;
		fullName: string;
		avatarUrl: string | null;
		timezone: string;
		locale: string;
		isEmailVerified: boolean;
		createdAt: string;
		updatedAt: string;
	} | null;
};

export type WorkspaceBaseFragment = {
	id: string;
	slug: string;
	name: string;
	logo: { url: string; originalName: string } | null;
};

export type WorkspaceMemberBaseFragment = {
	id: string;
	role: WorkspaceMemberRole;
	joinedAt: string;
	user: { id: string; fullName: string; username: string; avatarUrl: string | null; email: string };
};

export type WorkspaceDetailsFragment = {
	size: WorkspaceSize | null;
	createdAt: string;
	id: string;
	slug: string;
	name: string;
	logo: { url: string; originalName: string } | null;
};

export type CreateWorkspaceMutationVariables = Exact<{
	input: CreateWorkspaceInput;
}>;

export type CreateWorkspaceMutation = {
	createWorkspace: {
		id: string;
		slug: string;
		name: string;
		logo: { url: string; originalName: string } | null;
	};
};

export type GetWorkspacesQueryVariables = Exact<{ [key: string]: never }>;

export type GetWorkspacesQuery = {
	getWorkspaces: Array<{
		id: string;
		slug: string;
		name: string;
		logo: { url: string; originalName: string } | null;
	}>;
};

export type GetWorkspaceBySlugQueryVariables = Exact<{
	slug: string;
}>;

export type GetWorkspaceBySlugQuery = {
	workspace: {
		id: string;
		slug: string;
		name: string;
		logo: { url: string; originalName: string } | null;
	};
};

export type GetMembersQueryVariables = Exact<{
	workspaceId: string;
}>;

export type GetMembersQuery = {
	members: Array<{
		id: string;
		role: WorkspaceMemberRole;
		joinedAt: string;
		user: {
			id: string;
			fullName: string;
			username: string;
			avatarUrl: string | null;
			email: string;
		};
	}>;
};

export type GetWorkspaceDetailsQueryVariables = Exact<{
	slug: string;
}>;

export type GetWorkspaceDetailsQuery = {
	workspace: {
		size: WorkspaceSize | null;
		createdAt: string;
		id: string;
		slug: string;
		name: string;
		logo: { url: string; originalName: string } | null;
	};
};

export const WorkspaceMemberBaseFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceMemberBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceMemberModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "role" } },
					{ kind: "Field", name: { kind: "Name", value: "joinedAt" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "user" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "fullName" } },
								{ kind: "Field", name: { kind: "Name", value: "username" } },
								{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
								{ kind: "Field", name: { kind: "Name", value: "email" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<WorkspaceMemberBaseFragment, unknown>;
export const WorkspaceInviteBaseFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceInviteBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceInviteModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "role" } },
					{ kind: "Field", name: { kind: "Name", value: "expiresAt" } },
					{ kind: "Field", name: { kind: "Name", value: "acceptedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "inviter" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceMemberBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceMemberBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceMemberModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "role" } },
					{ kind: "Field", name: { kind: "Name", value: "joinedAt" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "user" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "fullName" } },
								{ kind: "Field", name: { kind: "Name", value: "username" } },
								{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
								{ kind: "Field", name: { kind: "Name", value: "email" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<WorkspaceInviteBaseFragment, unknown>;
export const NotificationBaseFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "NotificationBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "NotificationModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "type" } },
					{ kind: "Field", name: { kind: "Name", value: "title" } },
					{ kind: "Field", name: { kind: "Name", value: "body" } },
					{ kind: "Field", name: { kind: "Name", value: "isRead" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "workspaceId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "actor" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "fullName" } },
								{ kind: "Field", name: { kind: "Name", value: "username" } },
								{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<NotificationBaseFragment, unknown>;
export const UserFieldsFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "UserFields" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "username" } },
					{ kind: "Field", name: { kind: "Name", value: "fullName" } },
					{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "timezone" } },
					{ kind: "Field", name: { kind: "Name", value: "locale" } },
					{ kind: "Field", name: { kind: "Name", value: "isEmailVerified" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<UserFieldsFragment, unknown>;
export const WorkspaceBaseFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "slug" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "logo" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "url" } },
								{ kind: "Field", name: { kind: "Name", value: "originalName" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<WorkspaceBaseFragment, unknown>;
export const WorkspaceDetailsFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceDetails" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceBase" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "slug" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "logo" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "url" } },
								{ kind: "Field", name: { kind: "Name", value: "originalName" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<WorkspaceDetailsFragment, unknown>;
export const SignIn = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "SignIn" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "SignInInput" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "signIn" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: { kind: "Variable", name: { kind: "Name", value: "input" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserFields" } }],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "UserFields" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "username" } },
					{ kind: "Field", name: { kind: "Name", value: "fullName" } },
					{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "timezone" } },
					{ kind: "Field", name: { kind: "Name", value: "locale" } },
					{ kind: "Field", name: { kind: "Name", value: "isEmailVerified" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUp = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "SignUp" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "SignUpInput" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "signUp" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: { kind: "Variable", name: { kind: "Name", value: "input" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserFields" } }],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "UserFields" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "username" } },
					{ kind: "Field", name: { kind: "Name", value: "fullName" } },
					{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "timezone" } },
					{ kind: "Field", name: { kind: "Name", value: "locale" } },
					{ kind: "Field", name: { kind: "Name", value: "isEmailVerified" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const Refresh = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "Refresh" },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "refresh" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserFields" } }],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "UserFields" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "username" } },
					{ kind: "Field", name: { kind: "Name", value: "fullName" } },
					{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "timezone" } },
					{ kind: "Field", name: { kind: "Name", value: "locale" } },
					{ kind: "Field", name: { kind: "Name", value: "isEmailVerified" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const SignOut = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "SignOut" },
			selectionSet: {
				kind: "SelectionSet",
				selections: [{ kind: "Field", name: { kind: "Name", value: "signOut" } }],
			},
		},
	],
} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const VerifyEmail = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "VerifyEmail" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "token" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "verifyEmail" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "token" },
								value: { kind: "Variable", name: { kind: "Name", value: "token" } },
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const ForgotPassword = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "ForgotPassword" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ForgotPasswordInput" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "forgotPassword" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: { kind: "Variable", name: { kind: "Name", value: "input" } },
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPassword = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "ResetPassword" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ResetPasswordInput" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "resetPassword" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: { kind: "Variable", name: { kind: "Name", value: "input" } },
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const InviteMember = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "InviteMember" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "InviteMemberInput" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "inviteMember" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: { kind: "Variable", name: { kind: "Name", value: "input" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceInviteBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceMemberBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceMemberModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "role" } },
					{ kind: "Field", name: { kind: "Name", value: "joinedAt" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "user" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "fullName" } },
								{ kind: "Field", name: { kind: "Name", value: "username" } },
								{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
								{ kind: "Field", name: { kind: "Name", value: "email" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceInviteBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceInviteModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "role" } },
					{ kind: "Field", name: { kind: "Name", value: "expiresAt" } },
					{ kind: "Field", name: { kind: "Name", value: "acceptedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "inviter" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceMemberBase" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<InviteMemberMutation, InviteMemberMutationVariables>;
export const RevokeInvite = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "RevokeInvite" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "revokeInvite" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: { kind: "Variable", name: { kind: "Name", value: "id" } },
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<RevokeInviteMutation, RevokeInviteMutationVariables>;
export const AcceptInvite = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "AcceptInvite" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "token" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "acceptInvite" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "token" },
								value: { kind: "Variable", name: { kind: "Name", value: "token" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "slug" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "logo" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "url" } },
								{ kind: "Field", name: { kind: "Name", value: "originalName" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<AcceptInviteMutation, AcceptInviteMutationVariables>;
export const GetPendingInvites = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "GetPendingInvites" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "workspaceId" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "pendingInvites" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "workspaceId" },
								value: { kind: "Variable", name: { kind: "Name", value: "workspaceId" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceInviteBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceMemberBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceMemberModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "role" } },
					{ kind: "Field", name: { kind: "Name", value: "joinedAt" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "user" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "fullName" } },
								{ kind: "Field", name: { kind: "Name", value: "username" } },
								{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
								{ kind: "Field", name: { kind: "Name", value: "email" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceInviteBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceInviteModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "role" } },
					{ kind: "Field", name: { kind: "Name", value: "expiresAt" } },
					{ kind: "Field", name: { kind: "Name", value: "acceptedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "inviter" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceMemberBase" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetPendingInvitesQuery, GetPendingInvitesQueryVariables>;
export const MarkNotificationAsRead = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "MarkNotificationAsRead" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "markNotificationAsRead" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: { kind: "Variable", name: { kind: "Name", value: "id" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "NotificationBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "NotificationBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "NotificationModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "type" } },
					{ kind: "Field", name: { kind: "Name", value: "title" } },
					{ kind: "Field", name: { kind: "Name", value: "body" } },
					{ kind: "Field", name: { kind: "Name", value: "isRead" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "workspaceId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "actor" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "fullName" } },
								{ kind: "Field", name: { kind: "Name", value: "username" } },
								{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	MarkNotificationAsReadMutation,
	MarkNotificationAsReadMutationVariables
>;
export const MarkAllNotificationsAsRead = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "MarkAllNotificationsAsRead" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "workspaceId" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "markAllNotificationsAsRead" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "workspaceId" },
								value: { kind: "Variable", name: { kind: "Name", value: "workspaceId" } },
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	MarkAllNotificationsAsReadMutation,
	MarkAllNotificationsAsReadMutationVariables
>;
export const GetNotifications = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "GetNotifications" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "workspaceId" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "notifications" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "workspaceId" },
								value: { kind: "Variable", name: { kind: "Name", value: "workspaceId" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "NotificationBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "NotificationBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "NotificationModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "type" } },
					{ kind: "Field", name: { kind: "Name", value: "title" } },
					{ kind: "Field", name: { kind: "Name", value: "body" } },
					{ kind: "Field", name: { kind: "Name", value: "isRead" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "workspaceId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "actor" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "fullName" } },
								{ kind: "Field", name: { kind: "Name", value: "username" } },
								{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetUsers = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "GetUsers" },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "getUsers" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "Field",
									name: { kind: "Name", value: "nodes" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "FragmentSpread", name: { kind: "Name", value: "UserFields" } },
										],
									},
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "pageInfo" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
											{ kind: "Field", name: { kind: "Name", value: "hasPreviousPage" } },
											{ kind: "Field", name: { kind: "Name", value: "startCursor" } },
											{ kind: "Field", name: { kind: "Name", value: "endCursor" } },
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "totalCount" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "UserFields" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "username" } },
					{ kind: "Field", name: { kind: "Name", value: "fullName" } },
					{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "timezone" } },
					{ kind: "Field", name: { kind: "Name", value: "locale" } },
					{ kind: "Field", name: { kind: "Name", value: "isEmailVerified" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserById = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "GetUserById" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "getUserById" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: { kind: "Variable", name: { kind: "Name", value: "id" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserFields" } }],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "UserFields" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "username" } },
					{ kind: "Field", name: { kind: "Name", value: "fullName" } },
					{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "timezone" } },
					{ kind: "Field", name: { kind: "Name", value: "locale" } },
					{ kind: "Field", name: { kind: "Name", value: "isEmailVerified" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetCurrentUser = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "GetCurrentUser" },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "getCurrentUser" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserFields" } }],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "UserFields" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "email" } },
					{ kind: "Field", name: { kind: "Name", value: "username" } },
					{ kind: "Field", name: { kind: "Name", value: "fullName" } },
					{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "timezone" } },
					{ kind: "Field", name: { kind: "Name", value: "locale" } },
					{ kind: "Field", name: { kind: "Name", value: "isEmailVerified" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const CreateWorkspace = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "CreateWorkspace" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "CreateWorkspaceInput" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "createWorkspace" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: { kind: "Variable", name: { kind: "Name", value: "input" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "slug" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "logo" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "url" } },
								{ kind: "Field", name: { kind: "Name", value: "originalName" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const GetWorkspaces = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "GetWorkspaces" },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "getWorkspaces" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "slug" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "logo" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "url" } },
								{ kind: "Field", name: { kind: "Name", value: "originalName" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetWorkspacesQuery, GetWorkspacesQueryVariables>;
export const GetWorkspaceBySlug = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "GetWorkspaceBySlug" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "workspace" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "slug" },
								value: { kind: "Variable", name: { kind: "Name", value: "slug" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "slug" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "logo" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "url" } },
								{ kind: "Field", name: { kind: "Name", value: "originalName" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetWorkspaceBySlugQuery, GetWorkspaceBySlugQueryVariables>;
export const GetMembers = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "GetMembers" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "workspaceId" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "members" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "workspaceId" },
								value: { kind: "Variable", name: { kind: "Name", value: "workspaceId" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceMemberBase" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceMemberBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceMemberModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "role" } },
					{ kind: "Field", name: { kind: "Name", value: "joinedAt" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "user" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "fullName" } },
								{ kind: "Field", name: { kind: "Name", value: "username" } },
								{ kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
								{ kind: "Field", name: { kind: "Name", value: "email" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetMembersQuery, GetMembersQueryVariables>;
export const GetWorkspaceDetails = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "GetWorkspaceDetails" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "workspace" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "slug" },
								value: { kind: "Variable", name: { kind: "Name", value: "slug" } },
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceDetails" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceBase" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "slug" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "logo" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "url" } },
								{ kind: "Field", name: { kind: "Name", value: "originalName" } },
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "WorkspaceDetails" },
			typeCondition: { kind: "NamedType", name: { kind: "Name", value: "WorkspaceModel" } },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "FragmentSpread", name: { kind: "Name", value: "WorkspaceBase" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<GetWorkspaceDetailsQuery, GetWorkspaceDetailsQueryVariables>;
