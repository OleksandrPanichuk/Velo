import { Button, ButtonVariants } from "@repo/ui";

import { ROUTES } from "@/constants";
import { getCurrentUserFn } from "@/features/users/server";

export default async function Home() {
	const cu = await getCurrentUserFn();
	return (
		<div>
			<div className="bg-green-500">hello world </div>
			{JSON.stringify(cu, null, 2)}
			<Button variant={ButtonVariants.Destructive} href={ROUTES.auth.login}>
				Login
			</Button>
		</div>
	);
}
