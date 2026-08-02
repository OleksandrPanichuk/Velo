import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PoliciesGuard } from "./guards/policies.guard";
import { WorkspaceContextGuard } from "./guards/workspace-context.guard";
import { PermissionsRepository } from "./permissions.repository";
import { PermissionService } from "./permissions.service";

/**
 * Global authorization module. Exposes {@link PermissionService} for imperative
 * checks and the guards (registered as APP_GUARD in AppModule) for declarative
 * `@RequirePermission` enforcement.
 */
@Global()
@Module({
	imports: [TypeOrmModule.forFeature([WorkspaceMemberModel])],
	providers: [PermissionService, PermissionsRepository, PoliciesGuard, WorkspaceContextGuard],
	exports: [PermissionService, PoliciesGuard, WorkspaceContextGuard],
})
export class PermissionsModule {}
