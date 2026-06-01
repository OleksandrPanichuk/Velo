import { filterXSS, type IFilterXSSOptions } from "xss";

export class SanitizationUtil {
	private static readonly xssOptions: IFilterXSSOptions = {
		whiteList: {
			a: ["href", "title", "target"],
			p: [],
			br: [],
			strong: [],
			em: [],
			ul: [],
			ol: [],
			li: [],
		},
		stripIgnoreTag: true,
		stripIgnoreTagBody: ["script", "style"],
	};

	public static sanitizeInput(this: void, input: string): string {
		if (!input || typeof input !== "string") {
			return input;
		}

		return filterXSS(input, SanitizationUtil.xssOptions);
	}

	public static sanitizeArray<T = unknown>(this: void, arr: T[], visited = new WeakSet()): T[] {
		return arr.map((item) => {
			if (typeof item === "string") {
				return SanitizationUtil.sanitizeInput(item) as T;
			}
			if (item instanceof Date) {
				return item;
			}
			if (Array.isArray(item)) {
				return SanitizationUtil.sanitizeArray(item, visited) as T;
			}
			if (item && typeof item === "object") {
				return SanitizationUtil.sanitizeObject(item as Record<string, unknown>, visited) as T;
			}
			return item;
		});
	}

	public static sanitizeObject<T extends Record<string, unknown>>(
		this: void,
		obj: T,
		visited = new WeakSet(),
	): T {
		if (visited.has(obj)) {
			return obj;
		}
		visited.add(obj);

		const sanitized: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(obj)) {
			if (value instanceof Date) {
				sanitized[key] = value;
			} else if (typeof value === "string") {
				sanitized[key] = SanitizationUtil.sanitizeInput(value);
			} else if (Array.isArray(value)) {
				sanitized[key] = SanitizationUtil.sanitizeArray(value, visited);
			} else if (value && typeof value === "object") {
				sanitized[key] = SanitizationUtil.sanitizeObject(value as Record<string, unknown>, visited);
			} else {
				sanitized[key] = value;
			}
		}

		return sanitized as T;
	}
}
