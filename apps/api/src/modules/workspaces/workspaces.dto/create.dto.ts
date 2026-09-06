import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { MemberJobRole, WorkspaceSize } from "@/enums";
import {
	WORKSPACE_NAME_MAX_LENGTH,
	WORKSPACE_NAME_MIN_LENGTH,
	WORKSPACE_NAME_REGEX,
	WORKSPACE_SLUG_MAX_LENGTH,
	WORKSPACE_SLUG_MIN_LENGTH,
	WORKSPACE_SLUG_REGEX,
} from "../workspaces.constants";

@InputType({ description: "Input for creating a workspace" })
export class CreateWorkspaceInput {
	@Field({ description: "The name of the workspace" })
	@Matches(WORKSPACE_NAME_REGEX)
	@MinLength(WORKSPACE_NAME_MIN_LENGTH)
	@MaxLength(WORKSPACE_NAME_MAX_LENGTH)
	@IsString()
	readonly name!: string;

	@Field({ description: "The slug of the workspace" })
	@Matches(WORKSPACE_SLUG_REGEX)
	@MinLength(WORKSPACE_SLUG_MIN_LENGTH)
	@MaxLength(WORKSPACE_SLUG_MAX_LENGTH)
	@IsString()
	readonly slug!: string;

	@Field(() => WorkspaceSize, { nullable: true, description: "The size of the workspace team" })
	@IsEnum(WorkspaceSize)
	@IsOptional()
	readonly size?: WorkspaceSize | null;

	@Field(() => MemberJobRole, {
		nullable: true,
		description: "The professional role of the creator",
	})
	@IsEnum(MemberJobRole)
	@IsOptional()
	readonly jobRole?: MemberJobRole | null;
}
