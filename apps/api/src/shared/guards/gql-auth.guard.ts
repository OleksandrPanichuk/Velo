import { JwtAccessGuard } from "@/modules/auth/auth.guards";
import { IS_PUBLIC_KEY } from "@/shared/decorators";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Observable } from "rxjs";

@Injectable()
export class GqlAuthGuard extends JwtAccessGuard {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	public override canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		return super.canActivate(context);
	}
}
