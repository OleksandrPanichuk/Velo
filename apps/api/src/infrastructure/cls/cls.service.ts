import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import type { AppClsStore } from "./cls.typedefs";
import { ClsKeys } from "./cls.constants";

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
}
