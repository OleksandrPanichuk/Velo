import { minutes, seconds } from "@repo/primitives";

export interface CacheEntry {
	key(): string;
	tags(): string[];
	ttl: number;
}

const T = {
	global: () => "g:global",
	tenant: (tid: string) => `t:${tid}`,
	user: (tid: string, uid: string) => `t:${tid}:user:${uid}`,
	project: (tid: string, pid: string) => `t:${tid}:project:${pid}`,
    projectList: (tid: string) => `t:${tid}:projects:list`,
} as const;

export const CacheEntries = {
	featureFlags: () => ({
		key: () => "g:feature-flags",
		tags: () => [T.global()],
		ttl: minutes(5),
	}),

	globalConfig: (configKey: string)=> ({
		key: () => `g:config:${configKey}`,
		tags: () => [T.global()],
		ttl: minutes(10),
	}),

	// Tenant
	tenantPlan: (tenantId: string) => ({
		key: () => `t:${tenantId}:plan`,
		tags: () => [T.tenant(tenantId)],
		ttl: minutes(2),
	}),
	tenantSettings: (tenantId: string) => ({
		key: () => `t:${tenantId}:settings`,
		tags: () => [T.tenant(tenantId)],
		ttl: minutes(5),
	}),

	// Users
	user: (tenantId: string, userId: string) => ({
		key: () => `t:${tenantId}:user:${userId}`,
		tags: () => [T.user(tenantId, userId)],
		ttl: minutes(5),
	}),
	userPermissions: (tenantId: string, userId: string) => ({
		key: () => `t:${tenantId}:user:${userId}:permissions`,
		tags: () => [T.user(tenantId, userId)],
		ttl: minutes(2),
	}),

	// Projects
	projectList: (tenantId: string, page = 1, filters = "none") => ({
		key: () => `t:${tenantId}:projects:list:p${page}:${filters}`,
		tags: () => [T.tenant(tenantId), T.projectList(tenantId)],
		ttl: seconds(30),
	}),

	project: (tenantId: string, projectId: string) => ({
		key: () => `t:${tenantId}:project:${projectId}`,
		tags: () => [T.tenant(tenantId), T.project(tenantId, projectId)],
		ttl: minutes(1),
	}),

	projectMembers: (tenantId: string, projectId: string) => ({
		key: () => `t:${tenantId}:project:${projectId}:members`,
		tags: () => [T.tenant(tenantId), T.project(tenantId, projectId)],
        ttl: minutes(1)
	}),
} as const;

export const InvalidationTags = {
    tenant: (tenantId:string) => [T.tenant(tenantId)],
    user: (tenantId:string, userId:string) => [T.user(tenantId, userId)],
    project: (tenantId: string, projectId: string) => [T.project(tenantId, projectId)],
    projectList: (tenantId:string) => [T.projectList(tenantId)],
    
} as const 