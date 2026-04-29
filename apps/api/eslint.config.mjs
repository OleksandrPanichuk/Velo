import { nestJsConfig } from "@repo/eslint-config/nestjs";

export default [
	...nestJsConfig,
	{ ignores: ["migrations/**"] },
	{
		rules: {
			"@darraghor/nestjs-typed/controllers-should-supply-api-tags": "off",
			"@darraghor/nestjs-typed/api-method-should-specify-api-response": "off",
			"@darraghor/nestjs-typed/api-method-should-specify-api-operation": "off",
			"@darraghor/nestjs-typed/api-operation-summary-description-capitalized": "off",
			"@darraghor/nestjs-typed/api-property-should-have-api-extra-models": "off",
		},
	},
	{
		files: ["**/*.model.ts", "**/*.entity.ts", "**/*.dto.ts", "**/*.types.ts"],
		rules: {
			"@typescript-eslint/explicit-member-accessibility": "off",
		},
	},
];
