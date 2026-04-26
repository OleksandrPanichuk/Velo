import { nestJsConfig } from "@repo/eslint-config/nestjs";

export default [
	...nestJsConfig,
	{ ignores: ["migrations/**"] },
	{
		files: ["**/*.model.ts", "**/*.entity.ts"],
		rules: {
			"@typescript-eslint/explicit-member-accessibility": "off",
		},
	},
];
