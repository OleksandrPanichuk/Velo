import { Resolver } from "@nestjs/graphql";
import { WorkspacesService } from "./workspaces.service";

@Resolver()
export class WorkspacesResolver {
	constructor(private readonly workspacesService: WorkspacesService) {}
}
