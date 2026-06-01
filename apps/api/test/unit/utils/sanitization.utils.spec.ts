import { SanitizationUtil } from "@/utils/sanitization.utils";
import { expect } from "vitest";

describe("SanitizationUtil", () => {
	describe("sanitizeInput", () => {
		it("returns an empty string as-is", () => {
			expect(SanitizationUtil.sanitizeInput("")).toBe("");
		});

		it("returns a clean string unchanged", () => {
			const input = "Hello, World!";
			expect(SanitizationUtil.sanitizeInput(input)).toBe(input);
		});

		it("strips script tags and their body", () => {
			const input = "<script>alert('Xss')</script>";
			const output = "";

			expect(SanitizationUtil.sanitizeInput(input)).toBe(output);
		});

		it("strips style tags and their body", () => {
			const input = "<style>body { background-color: red; }</style>";
			const output = "";

			expect(SanitizationUtil.sanitizeInput(input)).toBe(output);
		});

		it("strips non-whitelisted tags but keeps their text content", () => {
			const input = "<div>Hello, <span>World!</span></div>";
			const output = "Hello, World!";

			expect(SanitizationUtil.sanitizeInput(input)).toBe(output);
		});

		it("strips event handler attributes from non-whitelisted tags", () => {
			const input = "<img src=x onerror=alert(1)>";
			const output = "";

			expect(SanitizationUtil.sanitizeInput(input)).toBe(output);
		});

		it("keeps <p> tags", () => {
			expect(SanitizationUtil.sanitizeInput("<p>paragraph</p>")).toBe("<p>paragraph</p>");
		});

		it("keeps <br> tags", () => {
			expect(SanitizationUtil.sanitizeInput("<br>")).toBe("<br>");
		});

		it("keeps <strong> tags", () => {
			expect(SanitizationUtil.sanitizeInput("<strong>bold</strong>")).toBe("<strong>bold</strong>");
		});

		it("keeps <em> tags", () => {
			expect(SanitizationUtil.sanitizeInput("<em>italic</em>")).toBe("<em>italic</em>");
		});

		it("keeps <ul>, <ol>, <li> tags", () => {
			const input = "<ul><li>one</li></ul>";
			expect(SanitizationUtil.sanitizeInput(input)).toBe("<ul><li>one</li></ul>");
		});

		it("keeps allowed <a> attributes: href, title, target", () => {
			const input = '<a href="https://example.com" title="t" target="_blank">link</a>';
			expect(SanitizationUtil.sanitizeInput(input)).toBe(
				'<a href="https://example.com" title="t" target="_blank">link</a>',
			);
		});

		it("strips disallowed attributes from <a>", () => {
			const input = '<a href="https://example.com" onclick="evil()">link</a>';
			expect(SanitizationUtil.sanitizeInput(input)).toBe('<a href="https://example.com">link</a>');
		});
	});

	describe("sanitizeArray", () => {
		it("sanitizes string items", () => {
			const input = [
				"<script>alert('Xss')</script>",
				"<style>body { background-color: red; }</style>",
				"clean",
			];
			const output = ["", "", "clean"];

			expect(SanitizationUtil.sanitizeArray(input)).toEqual(output);
		});

		it("passes through non-string primitives unchanged", () => {
			const input = [1, true, null];
			const output = [1, true, null];

			expect(SanitizationUtil.sanitizeArray(input)).toEqual(output);
		});

		it("passes through Date instances unchanged", () => {
			const date = new Date("2024-01-01");
			const result = SanitizationUtil.sanitizeArray([date]);
			expect(result[0]).toBe(date);
		});

		it("recursively sanitizes nested arrays", () => {
			const result = SanitizationUtil.sanitizeArray([["<script>xss</script>", "ok"]]);
			expect(result).toEqual([["", "ok"]]);
		});

		it("recursively sanitizes objects inside arrays", () => {
			const result = SanitizationUtil.sanitizeArray([{ name: "<script>xss</script>" }]);
			expect(result).toEqual([{ name: "" }]);
		});

		it("handles a mixed array", () => {
			const date = new Date("2024-01-01");
			const result = SanitizationUtil.sanitizeArray([
				"<b>bold</b>",
				42,
				date,
				{ x: "<img src=x onerror=1>" },
			]);
			expect(result).toEqual(["bold", 42, date, { x: "" }]);
		});
	});

	describe("sanitizeObject", () => {
		it("sanitizes string values", () => {
			const result = SanitizationUtil.sanitizeObject({ name: '<script>alert("xss")</script>' });

			expect(result).toEqual({ name: "" });
		});

		it("passes through non-string primitive values unchanged", () => {
			const result = SanitizationUtil.sanitizeObject({ count: 5, active: true, nothing: null });

			expect(result).toEqual({ count: 5, active: true, nothing: null });
		});

		it("passes through Date values unchanged", () => {
			const date = new Date("2024-01-01");
			const result = SanitizationUtil.sanitizeObject({ createdAt: date });

			expect(result.createdAt).toBe(date);
		});

		it("recursively sanitizes nested objects", () => {
			const result = SanitizationUtil.sanitizeObject({
				user: { bio: "<script>xss</script>" },
			});

			expect(result).toEqual({ user: { bio: "" } });
		});

		it("recursively sanitizes array values", () => {
			const result = SanitizationUtil.sanitizeObject({
				tags: ["<script>xss</script>", "clean"],
			});

			expect(result).toEqual({ tags: ["", "clean"] });
		});

		it("does not mutate circular references — returns object as-is on revisit", () => {
			const inner: Record<string, unknown> = { name: "inner" };
			const obj: Record<string, unknown> = { child: inner };
			inner["parent"] = obj;

			expect(() => SanitizationUtil.sanitizeObject(obj)).not.toThrow();
		});

		it("handles deeply nested mixed structure", () => {
			const date = new Date("2024-01-01");
			const result = SanitizationUtil.sanitizeObject({
				title: "<em>ok</em>",
				meta: { count: 3, date },
				tags: ["<b>tag</b>"],
			});

			expect(result).toEqual({
				title: "<em>ok</em>",
				meta: { count: 3, date },
				tags: ["tag"],
			});
		});
	});
});
