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
			container: {
				center: true,
				padding: {
					DEFAULT: '1rem',
					lg: '2.5rem',
				},
				screens: {
					sm: '640px',
					md: '768px',
					lg: '1024px',
					xl: '1280px',
				},
			},
			colors: {
				'brand-primary': '#d1d5db',
				'brand-secondary': '#1f2937',
			},
		},
	},
	plugins: [],
};
