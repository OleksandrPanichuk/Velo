import "reflect-metadata";
import { config as loadEnv } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";
import { FileModel } from "@/models/File.model";
import { NotificationModel } from "@/models/Notification.model";
import { OAuthAccountModel } from "@/models/OAuthAccount.model";
import { TeamMemberModel } from "@/models/TeamMember.model";
import { TeamModel } from "@/models/Team.model";
import { UserModel } from "@/models/User.model";
import { WorkspaceInviteModel } from "@/models/WorkspaceInvite.model";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { WorkspaceModel } from "@/models/Workspace.model";

loadEnv({ path: join(__dirname, "../../.env.test"), override: true });

export const TEST_ENTITIES = [
	FileModel,
	NotificationModel,
	OAuthAccountModel,
	TeamMemberModel,
	TeamModel,
	UserModel,
	WorkspaceInviteModel,
	WorkspaceMemberModel,
	WorkspaceModel,
];

export function createTestDataSource(): DataSource {
	return new DataSource({
		type: "postgres",
		host: process.env.DB_HOST ?? "localhost",
		port: Number(process.env.DB_PORT ?? 5433),
		username: process.env.DB_USERNAME ?? "postgres",
		password: process.env.DB_PASSWORD ?? "postgres",
		database: process.env.DB_NAME ?? "velo_test",
		entities: TEST_ENTITIES,
		synchronize: false,
		migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
		logging: false,
	});
}
