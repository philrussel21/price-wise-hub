/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'www.platypusshoes.com.au',
				port: '',
				pathname: '/media/catalog/product/**',
			},
		],
	},
};

// eslint-disable-next-line unicorn/prefer-module
module.exports = nextConfig;
