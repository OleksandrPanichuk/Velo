import type { UserModel } from "@/models/User.model";
import { CurrentUserPipe, OptionalCurrentUserPipe } from "@/shared/pipes/current-user.pipe";
import { getGqlRequest } from "@/utils";
import { createParamDecorator, type ExecutionContext, UnauthorizedException } from "@nestjs/common";

export type SafeUser = Omit<UserModel, "password" | "refreshToken">;
export type SafeUserKey = keyof SafeUser;

const extractUserId = (ctx: ExecutionContext): string => {
	const req = getGqlRequest(ctx);
	if (!req.user) throw new UnauthorizedException();
	return req.user.userId;
};

const GetUserId = createParamDecorator((_: unknown, ctx: ExecutionContext): string =>
	extractUserId(ctx),
);

const GetUserData = createParamDecorator(
	(
		key: SafeUserKey | undefined,
		ctx: ExecutionContext,
	): { userId: string; key: SafeUserKey | undefined } => ({
		userId: extractUserId(ctx),
		key,
	}),
);

const GetOptionalUserData = createParamDecorator(
	(
		key: SafeUserKey | undefined,
		ctx: ExecutionContext,
	): { userId: string | null; key: SafeUserKey | undefined } => {
		const req = getGqlRequest(ctx);
		return { userId: req.user?.userId ?? null, key };
	},
);

export function CurrentUser(key: "id"): ParameterDecorator;
export function CurrentUser(): ParameterDecorator;
export function CurrentUser<K extends Exclude<SafeUserKey, "id">>(key: K): ParameterDecorator;
export function CurrentUser(key?: SafeUserKey): ParameterDecorator {
	if (key === "id") return GetUserId();
	return GetUserData(key, CurrentUserPipe);
}

export function OptionalCurrentUser(): ParameterDecorator {
	return GetOptionalUserData(undefined, OptionalCurrentUserPipe);
}
