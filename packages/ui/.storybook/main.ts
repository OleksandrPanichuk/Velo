import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/vite"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import("vite")
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@": join(__dirname, "../src"),
        },
      },
    })
  },
}

export default config
