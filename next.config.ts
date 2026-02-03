import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ["image.tmdb.org"], // allow TMDB images
	},
	// webpack: (config) => {
	// 	config.resolve.alias = {
	// 		...config.resolve.alias,
	// 		"@services": `${__dirname}/src/services`,
	// 		"@utils": `${__dirname}/src/utils`,
	// 		"@components": `${__dirname}/src/components`,
	// 	};
	// 	return config;
	// },
};

export default nextConfig;
