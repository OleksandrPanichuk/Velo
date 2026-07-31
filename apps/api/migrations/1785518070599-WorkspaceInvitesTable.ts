import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkspaceInvitesTable1785518070599 implements MigrationInterface {
    name = 'WorkspaceInvitesTable1785518070599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."workspace_invites_role_enum" AS ENUM('admin', 'member', 'guest')`);
        await queryRunner.query(`CREATE TABLE "workspace_invites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "workspaceId" uuid NOT NULL, "email" character varying(100) NOT NULL, "role" "public"."workspace_invites_role_enum" NOT NULL DEFAULT 'member', "token" character varying(255) NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "acceptedAt" TIMESTAMP, "inviterId" uuid NOT NULL, CONSTRAINT "UQ_52c6f7f77e04ee30c5ff3f0012f" UNIQUE ("token"), CONSTRAINT "PK_43f7a0e0b0549fe2581e9cb57bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_15fbf04707ec6ecaad8667fbc2" ON "workspace_invites" ("workspaceId") `);
        await queryRunner.query(`ALTER TABLE "workspace_invites" ADD CONSTRAINT "FK_30741f6ecd5866aac499209b0ba" FOREIGN KEY ("inviterId") REFERENCES "workspace_members"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_workspace_invites_pending_email" ON "workspace_invites" ("workspaceId", LOWER("email")) WHERE "acceptedAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_workspace_invites_pending_email"`);
        await queryRunner.query(`ALTER TABLE "workspace_invites" DROP CONSTRAINT "FK_30741f6ecd5866aac499209b0ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15fbf04707ec6ecaad8667fbc2"`);
        await queryRunner.query(`DROP TABLE "workspace_invites"`);
        await queryRunner.query(`DROP TYPE "public"."workspace_invites_role_enum"`);
    }

}
