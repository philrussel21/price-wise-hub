/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/prefer-module */
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'brand-primary': '#d1d5db',
				'brand-secondary': '#1f2937',
			},
		},
	},
	plugins: [],
};
