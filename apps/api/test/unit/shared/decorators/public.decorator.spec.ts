import "reflect-metadata";
import { IS_PUBLIC_KEY, Public } from "@/shared/decorators";

describe("Public decorator", () => {
	it("sets IS_PUBLIC_KEY to true on a class", () => {
		@Public()
		class TestClass {}

		expect(Reflect.getMetadata(IS_PUBLIC_KEY, TestClass)).toBe(true);
	});

	it("sets IS_PUBLIC_KEY to true on a method", () => {
		class TestClass {
			@Public()
			public handler() {}
		}

		expect(Reflect.getMetadata(IS_PUBLIC_KEY, TestClass.prototype.handler)).toBe(true);
	});
});
