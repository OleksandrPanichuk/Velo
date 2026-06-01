import type { WorkspaceContext } from "@/modules/permissions/permissions.types";
import { Injectable } from "@nestjs/common";
import type { ServerResponse } from "node:http";
import { ClsService } from "nestjs-cls";
import { ClsKeys } from "./cls.constants";
import type { AppClsStore } from "./cls.typedefs";

@Injectable()
export class AppClsService {
	constructor(private readonly cls: ClsService<AppClsStore>) {}

	public get requestId(): string {
		return this.cls.getId();
	}

	public get userId(): string | undefined {
		return this.cls.get(ClsKeys.USER_ID);
	}

	public setUserId(userId: string): void {
		this.cls.set(ClsKeys.USER_ID, userId);
	}

	public get response(): ServerResponse | undefined {
		return this.cls.get(ClsKeys.RESPONSE);
	}

	public setResponse(res: ServerResponse): void {
		this.cls.set(ClsKeys.RESPONSE, res);
	}

	public get workspaceContext(): WorkspaceContext | undefined {
		return this.cls.get(ClsKeys.WORKSPACE_CONTEXT);
	}

	public setWorkspaceContext(context: WorkspaceContext): void {
		this.cls.set(ClsKeys.WORKSPACE_CONTEXT, context);
	}
}
