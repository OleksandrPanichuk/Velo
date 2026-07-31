import { WorkspaceInviteRole } from "@/enums";
import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsEnum, IsUUID, MaxLength } from "class-validator";
import { EmailAddressResolver, UUIDResolver } from "graphql-scalars";
import { WORKSPACE_INVITE_EMAIL_MAX_LENGTH } from "../workspace-invites.constants";

@InputType({ description: "Input for inviting someone to a workspace" })
export class InviteMemberInput {
	@Field(() => UUIDResolver, { description: "The workspace to invite the person into" })
	@IsUUID()
	readonly workspaceId!: string;

	@Field(() => EmailAddressResolver, { description: "The email address to send the invite to" })
	@MaxLength(WORKSPACE_INVITE_EMAIL_MAX_LENGTH)
	@IsEmail()
	readonly email!: string;

	@Field(() => WorkspaceInviteRole, { description: "The role the invitee will get once accepted" })
	@IsEnum(WorkspaceInviteRole)
	readonly role!: WorkspaceInviteRole;
}
