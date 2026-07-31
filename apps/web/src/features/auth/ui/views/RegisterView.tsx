import { RegisterForm } from "@/features/auth/ui/components/RegisterForm";

interface Props {
	inviteToken?: string;
}

export function RegisterView({ inviteToken }: Props) {
	return <RegisterForm inviteToken={inviteToken} />;
}
