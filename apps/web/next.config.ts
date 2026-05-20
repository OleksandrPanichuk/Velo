import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	transpilePackages: ["@repo/ui"],
	/* config options here */
	reactCompiler: true,
};

export default nextConfig;
