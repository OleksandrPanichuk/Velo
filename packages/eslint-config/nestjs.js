import nestjsTyped from "@darraghor/eslint-plugin-nestjs-typed";
import eslintConfigPrettier from "eslint-config-prettier";
import nPlugin from "eslint-plugin-n";
import globals from "globals";
import tseslint from "typescript-eslint";
import { config as baseConfig } from "./base.js";

export const nestJsConfig = [
	...baseConfig,

	// Upgrade to type-checked rules (superset of recommended, requires parserOptions below)
	...tseslint.configs.recommendedTypeChecked,

	// Node globals + enable type-aware parsing
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
			parserOptions: {
				projectService: true,
			},
		},
	},

	// NestJS-specific rules — flat config preset registers the plugin + all recommended rules
	...nestjsTyped.configs.flatRecommended,

	// Tune nestjs-typed severity: errors stay errors, cosmetic/Swagger rules → warn
	{
		rules: {
			"@darraghor/nestjs-typed/api-methods-should-be-guarded": "warn",
			"@darraghor/nestjs-typed/sort-module-metadata-arrays": "warn",
			"@darraghor/nestjs-typed/api-method-should-specify-api-response": "warn",
			"@darraghor/nestjs-typed/api-method-should-specify-api-operation": "warn",
			"@darraghor/nestjs-typed/api-operation-summary-description-capitalized": "warn",
			"@darraghor/nestjs-typed/controllers-should-supply-api-tags": "warn",
			"@darraghor/nestjs-typed/use-injectable-provided-token": "warn",
			"@darraghor/nestjs-typed/use-dependency-injection": "warn",
			"@darraghor/nestjs-typed/use-correct-endpoint-naming-convention": "warn",
			"@darraghor/nestjs-typed/all-properties-are-whitelisted": "warn",
			"@darraghor/nestjs-typed/all-properties-have-explicit-defined": "warn",
			"@darraghor/nestjs-typed/api-property-should-have-api-extra-models": "warn",
		},
	},

	// Node.js rules
	{
		plugins: { n: nPlugin },
		rules: {
			"n/no-process-exit": "warn",
			"n/no-deprecated-api": "error",
			"n/prefer-global/process": ["warn", "always"],
		},
	},

	// TypeScript type-aware rules
	{
		rules: {
			// --- Async / Promise safety ---
			"@typescript-eslint/no-floating-promises": ["error", { ignoreVoid: true }],
			"@typescript-eslint/require-await": "warn",
			"@typescript-eslint/return-await": ["error", "in-try-catch"],
			"@typescript-eslint/promise-function-async": [
				"error",
				{ allowAny: true, allowedPromiseNames: ["Observable"] },
			],
			"@typescript-eslint/await-thenable": "error",

			// --- Type safety ---
			"@typescript-eslint/no-non-null-assertion": "warn",
			"@typescript-eslint/no-unsafe-assignment": "warn",
			"@typescript-eslint/no-unsafe-member-access": "warn",
			"@typescript-eslint/no-unsafe-return": "warn",
			"@typescript-eslint/no-unsafe-argument": "warn",
			"@typescript-eslint/no-unsafe-call": "warn",

			// --- Module hygiene ---
			// import type {} prevents circular dependency issues at runtime in NestJS
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{ prefer: "type-imports", fixStyle: "inline-type-imports" },
			],
			"@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],

			// --- Nullability ---
			"@typescript-eslint/prefer-nullish-coalescing": [
				"warn",
				{ ignorePrimitives: { string: true, boolean: true } },
			],
			"@typescript-eslint/prefer-optional-chain": "warn",

			// --- Class / decorator patterns ---
			"@typescript-eslint/explicit-module-boundary-types": "warn",
			"@typescript-eslint/prefer-readonly": "warn",
			"@typescript-eslint/explicit-member-accessibility": [
				"warn",
				{
					accessibility: "explicit",
					overrides: {
						constructors: "no-public",
						parameterProperties: "explicit",
					},
				},
			],

			// NestJS modules are empty-body classes and use declaration merging
			"@typescript-eslint/no-extraneous-class": "off",
			"@typescript-eslint/no-unsafe-declaration-merging": "off",
		},
	},

	// Naming conventions
	{
		rules: {
			"@typescript-eslint/naming-convention": [
				"warn",
				{ selector: "class", format: ["PascalCase"] },
				// No I-prefix on interfaces (modern TS convention)
				{
					selector: "interface",
					format: ["PascalCase"],
					custom: { regex: "^I[A-Z]", match: false },
				},
				{ selector: "enum", format: ["PascalCase"] },
				{ selector: "enumMember", format: ["UPPER_CASE"] },
				{ selector: "typeParameter", format: ["PascalCase"], prefix: ["T"] },
				{
					selector: "variable",
					modifiers: ["const"],
					format: ["camelCase", "UPPER_CASE", "PascalCase"],
				},
				{
					selector: "memberLike",
					modifiers: ["private"],
					format: ["camelCase"],
					leadingUnderscore: "allow",
				},
				{
					selector: ["variable", "parameter"],
					format: ["camelCase"],
					leadingUnderscore: "allow",
				},
			],
		},
	},

	// Core ESLint rules
	{
		rules: {
			// Use Logger service in NestJS — bare console.log is a code smell
			"no-console": ["warn", { allow: ["warn", "error"] }],
			// Use Promise.all() instead of awaiting in loops
			"no-await-in-loop": "error",
			"no-promise-executor-return": "error",
			eqeqeq: ["error", "always", { null: "ignore" }],
			"prefer-const": "error",
			"no-var": "error",
			"no-self-compare": "error",
			"no-throw-literal": "error",
			"no-unmodified-loop-condition": "error",
			"no-empty": ["error", { allowEmptyCatch: false }],
			"prefer-template": "warn",
		},
	},

	// Always last: disable any rule that conflicts with prettier formatting
	eslintConfigPrettier,

	{ ignores: ["dist/**"] },
];
