import { LoginForm } from "@/features/auth/ui/components/LoginForm";

interface Props {
	inviteToken?: string;
}

export function LoginView({ inviteToken }: Props) {
	return <LoginForm inviteToken={inviteToken} />;
}
