import { VerifyEmailView as VerifyEmailContent } from "@/features/auth/ui/components/VerifyEmailView";

interface Props {
	token: string | undefined;
}

export function VerifyEmailView({ token }: Props) {
	return <VerifyEmailContent token={token} />;
}
