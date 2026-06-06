import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationsTable1780779296072 implements MigrationInterface {
    name = 'NotificationsTable1780779296072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('member.joined')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recipientId" uuid NOT NULL, "workspaceId" uuid NOT NULL, "actorId" uuid, "type" "public"."notifications_type_enum" NOT NULL, "title" character varying(255) NOT NULL, "body" text, "isRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."workspaces_size_enum" AS ENUM('small', 'medium', 'large', 'enterprise')`);
        await queryRunner.query(`ALTER TABLE "workspaces" ADD "size" "public"."workspaces_size_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."users_jobrole_enum" AS ENUM('developer', 'designer', 'pm', 'other')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "jobRole" "public"."users_jobrole_enum"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_db873ba9a123711a4bff527ccd5" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_0252715141cc24f79871554e249" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_44412a2d6f162ff4dc1697d0db7" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_44412a2d6f162ff4dc1697d0db7"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_0252715141cc24f79871554e249"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_db873ba9a123711a4bff527ccd5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "jobRole"`);
        await queryRunner.query(`DROP TYPE "public"."users_jobrole_enum"`);
        await queryRunner.query(`ALTER TABLE "workspaces" DROP COLUMN "size"`);
        await queryRunner.query(`DROP TYPE "public"."workspaces_size_enum"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }

}
