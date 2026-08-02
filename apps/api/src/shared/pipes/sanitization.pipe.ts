import { SanitizationUtil } from "@/utils";
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class SanitizationPipe implements PipeTransform {
	public transform(value: unknown, _metadata: ArgumentMetadata): unknown {
		if (value === null || value === undefined) {
			return value;
		}

		if (typeof value === "string") {
			return SanitizationUtil.sanitizeInput(value);
		}

		if (Array.isArray(value)) {
			return SanitizationUtil.sanitizeArray<unknown>(value);
		}

		if (typeof value === "object") {
			return SanitizationUtil.sanitizeObject(value as Record<string, unknown>);
		}

		return value;
	}
}
