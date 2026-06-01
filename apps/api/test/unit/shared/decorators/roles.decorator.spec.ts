import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { Role } from "@/constants";
import { Roles, ROLES_KEY } from "@/shared/decorators/roles.decorator";

describe("Roles decorator", () => {
	it("sets ROLES_KEY metadata with a single role on a class", () => {
		@Roles(Role.ADMIN)
		class TestClass {}

		expect(Reflect.getMetadata(ROLES_KEY, TestClass)).toEqual([Role.ADMIN]);
	});

	it("sets ROLES_KEY metadata with multiple roles on a class", () => {
		@Roles(Role.USER, Role.ADMIN)
		class TestClass {}

		expect(Reflect.getMetadata(ROLES_KEY, TestClass)).toEqual([Role.USER, Role.ADMIN]);
	});

	it("sets ROLES_KEY metadata on a method", () => {
		class TestClass {
			@Roles(Role.ADMIN)
			public handler() {}
		}

		expect(Reflect.getMetadata(ROLES_KEY, TestClass.prototype.handler)).toEqual([Role.ADMIN]);
	});

	it("sets an empty array when called with no roles", () => {
		@Roles()
		class TestClass {}

		expect(Reflect.getMetadata(ROLES_KEY, TestClass)).toEqual([]);
	});
});
