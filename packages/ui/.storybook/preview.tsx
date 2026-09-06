import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "./preview.css";

const preview: Preview = {
	parameters: {
		layout: "centered",
	},
	decorators: [
		withThemeByClassName({
			themes: { light: "", dark: "dark" },
			defaultTheme: "dark",
		}),
	],
};

export default preview;
