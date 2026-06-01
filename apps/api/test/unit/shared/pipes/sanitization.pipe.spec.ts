import { type ArgumentMetadata } from "@nestjs/common";
import { expect, vi } from "vitest";
import { SanitizationUtil } from "@/utils";
import { SanitizationPipe } from "@/shared/pipes/sanitization.pipe";

vi.mock("@/utils", () => ({
	SanitizationUtil: {
		sanitizeInput: vi.fn((v: string) => v),
		sanitizeArray: vi.fn(<T>(v: T[]) => v),
		sanitizeObject: vi.fn(<T>(v: T) => v),
	},
}));

const metadata: ArgumentMetadata = { type: "body" };

describe("SanitizationPipe", () => {
	let pipe: SanitizationPipe;

	beforeEach(() => {
		pipe = new SanitizationPipe();
		vi.clearAllMocks();
	});

	describe("null / undefined", () => {
		it("returns null without calling any sanitizer", () => {
			expect(pipe.transform(null, metadata)).toBeNull();
			expect(SanitizationUtil.sanitizeInput).not.toHaveBeenCalled();
		});

		it("returns undefined without calling any sanitizer", () => {
			expect(pipe.transform(undefined, metadata)).toBeUndefined();
			expect(SanitizationUtil.sanitizeInput).not.toHaveBeenCalled();
		});
	});

	describe("string", () => {
		it("delegates to sanitizeInput and returns its result", () => {
			vi.mocked(SanitizationUtil.sanitizeInput).mockReturnValue("sanitized");

			const result = pipe.transform("<script>xss</script>", metadata);

			expect(SanitizationUtil.sanitizeInput).toHaveBeenCalledWith("<script>xss</script>");
			expect(result).toBe("sanitized");
		});

		it("does not call sanitizeArray or sanitizeObject for strings", () => {
			pipe.transform("hello", metadata);

			expect(SanitizationUtil.sanitizeArray).not.toHaveBeenCalled();
			expect(SanitizationUtil.sanitizeObject).not.toHaveBeenCalled();
		});
	});

	describe("array", () => {
		it("delegates to sanitizeArray and returns its result", () => {
			const input = ["a", "<b>b</b>"];
			const sanitized = ["a", "b"];
			vi.mocked(SanitizationUtil.sanitizeArray).mockReturnValue(sanitized);

			const result = pipe.transform(input, metadata);

			expect(SanitizationUtil.sanitizeArray).toHaveBeenCalledWith(input);
			expect(result).toBe(sanitized);
		});

		it("does not call sanitizeInput or sanitizeObject for arrays", () => {
			pipe.transform(["x"], metadata);

			expect(SanitizationUtil.sanitizeInput).not.toHaveBeenCalled();
			expect(SanitizationUtil.sanitizeObject).not.toHaveBeenCalled();
		});
	});

	describe("object", () => {
		it("delegates to sanitizeObject and returns its result", () => {
			const input = { name: "<img src=x onerror=alert(1)>" };
			const sanitized = { name: "" };
			vi.mocked(SanitizationUtil.sanitizeObject).mockReturnValue(sanitized);

			const result = pipe.transform(input, metadata);

			expect(SanitizationUtil.sanitizeObject).toHaveBeenCalledWith(input);
			expect(result).toBe(sanitized);
		});

		it("does not call sanitizeInput or sanitizeArray for plain objects", () => {
			pipe.transform({ key: "value" }, metadata);

			expect(SanitizationUtil.sanitizeInput).not.toHaveBeenCalled();
			expect(SanitizationUtil.sanitizeArray).not.toHaveBeenCalled();
		});
	});

	describe("other primitives (passthrough)", () => {
		it.each([
			["number", 42],
			["boolean true", true],
			["boolean false", false],
			["bigint", BigInt(9)],
		])("returns %s as-is without calling any sanitizer", (_, value) => {
			const result = pipe.transform(value, metadata);

			expect(result).toBe(value);
			expect(SanitizationUtil.sanitizeInput).not.toHaveBeenCalled();
			expect(SanitizationUtil.sanitizeArray).not.toHaveBeenCalled();
			expect(SanitizationUtil.sanitizeObject).not.toHaveBeenCalled();
		});
	});
});
