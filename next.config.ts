// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
// 	images: {
// 		domains: ["image.tmdb.org"], // allow TMDB images
// 	},
// 	// webpack: (config) => {
// 	// 	config.resolve.alias = {
// 	// 		...config.resolve.alias,
// 	// 		"@services": `${__dirname}/src/services`,
// 	// 		"@utils": `${__dirname}/src/utils`,
// 	// 		"@components": `${__dirname}/src/components`,
// 	// 	};
// 	// 	return config;
// 	// },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : "";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			// Supabase Storage
			...(supabaseHostname
				? [
						{
							protocol: "https" as const,
							hostname: supabaseHostname,
							pathname: "/storage/v1/object/public/**",
						},
					]
				: []),

			// Google profile pictures
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "/**",
			},

			// TMDB posters/backdrops, if you use TMDB
			{
				protocol: "https",
				hostname: "image.tmdb.org",
				pathname: "/t/p/**",
			},
		],
	},
};

export default nextConfig;