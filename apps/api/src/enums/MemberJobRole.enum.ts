import { registerEnumType } from "@nestjs/graphql";

export enum MemberJobRole {
	DEVELOPER = "developer",
	DESIGNER = "designer",
	PM = "pm",
	OTHER = "other",
}

registerEnumType(MemberJobRole, {
	name: "MemberJobRole",
	description: "The professional role of a workspace member",
});
