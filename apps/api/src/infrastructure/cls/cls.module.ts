import { Global, Module } from "@nestjs/common";
import { ClsModule } from "nestjs-cls";
import { randomUUID } from "node:crypto";
import type { Request } from "express";
import { AppClsService } from "./cls.service";

@Global()
@Module({
	imports: [
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
				generateId: true,
				idGenerator: (req: Request) =>
					(req.headers["x-request-id"] as string | undefined) ?? randomUUID(),
			},
		}),
	],
	providers: [AppClsService],
	exports: [AppClsService],
})
export class AppClsModule {}
