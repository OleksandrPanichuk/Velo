import { registerEnumType } from "@nestjs/graphql";

export enum WorkspaceMemberRole {
    OWNER = "owner",
    ADMIN = "admin",
    MEMBER = "member",
    GUEST = "guest"
}

registerEnumType(WorkspaceMemberRole, {
    name: "WorkspaceMemberRole",
});