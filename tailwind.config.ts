import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#13213c", brand: { 50: "#eef4ff", 100: "#dce9ff", 500: "#4269dd", 600: "#3458c5", 700: "#2946a0" } }, boxShadow: { card: "0 10px 35px rgba(25, 48, 94, .08)" } } }, plugins: [] } satisfies Config;
