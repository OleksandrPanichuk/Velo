import type { Role } from "@/constants";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export const Roles = (...roles: Role[]): ClassDecorator & MethodDecorator =>
	SetMetadata(ROLES_KEY, roles);
