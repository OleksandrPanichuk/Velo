import { registerEnumType } from "@nestjs/graphql";

export enum NotificationType {
	MEMBER_JOINED = "member.joined",
}

registerEnumType(NotificationType, { name: "NotificationType" });
