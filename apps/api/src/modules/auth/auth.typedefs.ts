import type { OAuthProvider } from "@/constants";
import type { Request } from "express";
export interface JwtPayload {
	sub: string;
	exp: number;
	iat: number;
}

export interface OAuthUserData {
	provider: OAuthProvider;
	providerId: string;
	email: string;
	fullName: string;
	avatarUrl?: string;
	accessToken: string;
	oauthRefreshToken?: string;
}

export type OAuthRequest = Request & {
	user: OAuthUserData;
}


export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}