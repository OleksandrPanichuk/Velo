import type { APIRequestContext } from "@playwright/test";

import { GRAPHQL_URL } from "@/config";
import type { TestUserInput } from "@/helpers/factory";

export interface GraphQLFailure {
	message: string;
	status?: number;
	code?: string;
}

export class GraphQLError extends Error {
	constructor(
		message: string,
		readonly failures: GraphQLFailure[],
	) {
		super(message);
		this.name = "GraphQLError";
	}
}

export class ApiClient {
	constructor(private readonly request: APIRequestContext) {}

	async raw<T>(
		query: string,
		variables?: Record<string, unknown>,
		headers?: Record<string, string>,
	): Promise<{ data?: T; failures: GraphQLFailure[] }> {
		const response = await this.request.post(GRAPHQL_URL, {
			data: { query, variables },
			headers: { "content-type": "application/json", ...headers },
		});

		const body = (await response.json()) as {
			data?: T;
			errors?: { message: string; extensions?: Record<string, unknown> }[];
		};

		const failures = (body.errors ?? []).map((error) => {
			const extensions = error.extensions ?? {};
			const original = extensions["originalError"] as { statusCode?: number } | undefined;

			return {
				message: error.message,
				status:
					typeof extensions["status"] === "number" ? extensions["status"] : original?.statusCode,
				code: typeof extensions["code"] === "string" ? extensions["code"] : undefined,
			};
		});

		return { data: body.data, failures };
	}

	async call<T>(
		query: string,
		variables?: Record<string, unknown>,
		headers?: Record<string, string>,
	): Promise<T> {
		const { data, failures } = await this.raw<T>(query, variables, headers);

		if (failures.length) {
			throw new GraphQLError(failures.map((f) => f.message).join("; "), failures);
		}

		return data as T;
	}

	workspaceHeaders(workspaceId: string) {
		return { "x-workspace-id": workspaceId };
	}

	signUp(user: TestUserInput) {
		return this.call<{ signUp: { id: string; email: string } }>(
			`mutation SignUp($input: SignUpInput!) {
				signUp(input: $input) { id email }
			}`,
			{ input: user },
		);
	}

	signIn(email: string, password: string) {
		return this.call<{ signIn: { id: string; email: string } }>(
			`mutation SignIn($input: SignInInput!) {
				signIn(input: $input) { id email }
			}`,
			{ input: { email, password } },
		);
	}

	signOut() {
		return this.call<{ signOut: boolean }>(`mutation { signOut }`);
	}

	currentUser() {
		return this.call<{ getCurrentUser: { id: string; email: string } | null }>(
			`query { getCurrentUser { id email } }`,
		);
	}

	createWorkspace(input: { name: string; slug: string }) {
		return this.call<{ createWorkspace: { id: string; slug: string; name: string } }>(
			`mutation CreateWorkspace($input: CreateWorkspaceInput!) {
				createWorkspace(input: $input) { id slug name }
			}`,
			{ input },
		);
	}

	inviteMember(workspaceId: string, email: string, role: "ADMIN" | "MEMBER" | "GUEST") {
		return this.call<{ inviteMember: { id: string; email: string; role: string } }>(
			`mutation InviteMember($input: InviteMemberInput!) {
				inviteMember(input: $input) { id email role }
			}`,
			{ input: { workspaceId, email, role } },
			this.workspaceHeaders(workspaceId),
		);
	}

	pendingInvites(workspaceId: string) {
		return this.call<{ pendingInvites: { id: string; email: string; role: string }[] }>(
			`query PendingInvites($workspaceId: UUID!) {
				pendingInvites(workspaceId: $workspaceId) { id email role }
			}`,
			{ workspaceId },
			this.workspaceHeaders(workspaceId),
		);
	}

	acceptInvite(token: string) {
		return this.raw<{ acceptInvite: { id: string; slug: string } }>(
			`mutation AcceptInvite($token: String!) {
				acceptInvite(token: $token) { id slug }
			}`,
			{ token },
		);
	}

	members(workspaceId: string) {
		return this.call<{
			members: { id: string; role: string; user: { id: string; email: string } }[];
		}>(
			`query Members($workspaceId: UUID!) {
				members(workspaceId: $workspaceId) { id role user { id email } }
			}`,
			{ workspaceId },
			this.workspaceHeaders(workspaceId),
		);
	}

	notifications(workspaceId: string) {
		return this.call<{ notifications: { id: string; title: string; isRead: boolean }[] }>(
			`query Notifications($workspaceId: UUID!) {
				notifications(workspaceId: $workspaceId) { id title isRead }
			}`,
			{ workspaceId },
		);
	}
}
