/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'static.nike.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};

// eslint-disable-next-line unicorn/prefer-module
module.exports = nextConfig;
