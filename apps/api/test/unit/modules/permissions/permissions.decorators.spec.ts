import { Permission } from "@/modules/permissions/permissions.constants";
import {
	REQUIRE_PERMISSION_KEY,
	RequirePermission,
} from "@/modules/permissions/permissions.decorators";
import "reflect-metadata";

describe("RequirePermission decorator", () => {
	it("attaches the required permissions to a method", () => {
		class TestResolver {
			@RequirePermission(Permission.MemberRemove)
			public handler() {}
		}

		expect(Reflect.getMetadata(REQUIRE_PERMISSION_KEY, TestResolver.prototype.handler)).toEqual([
			Permission.MemberRemove,
		]);
	});

	it("supports multiple permissions", () => {
		class TestResolver {
			@RequirePermission(Permission.MemberInvite, Permission.MemberRead)
			public handler() {}
		}

		expect(Reflect.getMetadata(REQUIRE_PERMISSION_KEY, TestResolver.prototype.handler)).toEqual([
			Permission.MemberInvite,
			Permission.MemberRead,
		]);
	});
});
