import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				burgundy: "#8B0000",
				gold: "#B8860B",
				cream: "#F5F5DC",
				charcoal: "#36454F",
				forest: "#228B22",
				navy: "#1e3a8a",
			},
			fontFamily: {
				primary: ["Playfair Display", "serif"],
				secondary: ["Open Sans", "sans-serif"],
				script: ["Dancing Script", "cursive"],
			},
			animation: {
				"fade-in-up": "fadeInUp 0.6s ease-out",
				"fade-in-down": "fadeInDown 0.6s ease-out",
				"fade-in-left": "fadeInLeft 0.6s ease-out",
				"fade-in-right": "fadeInRight 0.6s ease-out",
				"bounce-slow": "bounce 2s infinite",
				"pulse-slow": "pulse 3s infinite",
			},
			keyframes: {
				fadeInUp: {
					"0%": { opacity: "0", transform: "translateY(30px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				fadeInDown: {
					"0%": { opacity: "0", transform: "translateY(-30px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				fadeInLeft: {
					"0%": { opacity: "0", transform: "translateX(-30px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},
				fadeInRight: {
					"0%": { opacity: "0", transform: "translateX(30px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},
			},
			spacing: {
				"18": "4.5rem",
				"88": "22rem",
				"128": "32rem",
			},
			maxWidth: {
				"8xl": "88rem",
				"9xl": "96rem",
			},
			minHeight: {
				"64": "16rem",
				"80": "20rem",
			},
		},
	},
	plugins: [],
};

export default config;
