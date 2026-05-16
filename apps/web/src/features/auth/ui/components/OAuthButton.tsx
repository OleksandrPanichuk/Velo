import { PropsWithChildren, ReactNode } from "react";

import Link from "next/link";

import { Button, ButtonProps, ButtonSizes, ButtonVariants } from "@repo/ui";

import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { API_ROUTES, OAuthProvider } from "@/constants";
import { generateApiUrl } from "@/lib/utils";

interface Props extends PropsWithChildren, ButtonProps {
	provider: OAuthProvider;
}

const providerIconsMap: Record<OAuthProvider, ReactNode> = {
	[OAuthProvider.Google]: <GoogleIcon />,
	[OAuthProvider.Github]: <GitHubIcon />,
};

export function OAuthButton({ provider, children, ...props }: Props) {
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
			<Link href={url}>{children}</Link>
		</Button>
	);
}
