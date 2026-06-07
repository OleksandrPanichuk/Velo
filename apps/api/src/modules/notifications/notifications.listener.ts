import { NotificationType } from "@/enums";
import { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { MemberJoinedEvent } from "@/modules/workspace-members/events";
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationsService } from "./notifications.service";

@Injectable()
export class NotificationsListener {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  @OnEvent(MemberJoinedEvent.EVENT)
  public async handleMemberJoined(event: MemberJoinedEvent): Promise<void> {
    const admins = await this.workspaceMembersService.findAdminsByWorkspaceId(event.workspaceId);

    const notifications = admins
      .filter((admin) => admin.userId !== event.memberId)
      .map((admin) =>
        this.notificationsService.create({
          recipientId: admin.userId,
          workspaceId: event.workspaceId,
          actorId: event.memberId,
          type: NotificationType.MEMBER_JOINED,
          title: "A new member joined your workspace",
        }),
      );

    await Promise.all(notifications);
  }
}
