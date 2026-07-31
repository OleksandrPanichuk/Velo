"use client";

import { PropsWithChildren, ReactNode } from "react";

import Link from "next/link";

import { Button, ButtonProps, ButtonSizes, ButtonVariants } from "@repo/ui";

import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { API_ROUTES, OAuthProvider } from "@/constants";
import { storePendingInviteToken } from "@/features/invite/utils";
import { generateApiUrl } from "@/lib/utils";

interface Props extends PropsWithChildren, ButtonProps {
	provider: OAuthProvider;
	inviteToken?: string;
}

const providerIconsMap: Record<OAuthProvider, ReactNode> = {
	[OAuthProvider.Google]: <GoogleIcon />,
	[OAuthProvider.Github]: <GitHubIcon />,
};

export function OAuthButton({ provider, children, inviteToken, ...props }: Props) {
	const url = generateApiUrl(API_ROUTES.auth.oauth(provider));

	return (
		<Button
			variant={ButtonVariants.Outline}
			size={ButtonSizes.Large}
			leftIcon={providerIconsMap[provider]}
			fullWidth
			asChild
			{...props}
		>
			<Link href={url} onClick={() => inviteToken && storePendingInviteToken(inviteToken)}>
				{children}
			</Link>
		</Button>
	);
}
