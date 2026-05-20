import { ResetPasswordForm } from "@/features/auth/ui/components/ResetPasswordForm";

interface Props {
	token: string | undefined;
}

export function ResetPasswordView({ token }: Props) {
	return <ResetPasswordForm token={token} />;
}
