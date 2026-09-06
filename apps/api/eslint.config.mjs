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
			"@darraghor/nestjs-typed/injectable-should-be-provided": "off",
		},
	},
	{
		files: ["**/*.model.ts", "**/*.entity.ts", "**/*.dto.ts", "**/*.types.ts"],
		rules: {
			"@typescript-eslint/explicit-member-accessibility": "off",
		},
	},
	{
		files: ["test/**/*.ts"],
		rules: {
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/unbound-method": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/explicit-member-accessibility": "off",
			"no-console": "off",
			"@typescript-eslint/require-await": "off",
		},
	},
	{
		files: ["src/infrastructure/dataloader/**/*.ts"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
		},
	},
	{
		files: ["**/*.interceptor.ts"],
		rules: {
			"@typescript-eslint/promise-function-async": "off",
		},
	},
];
