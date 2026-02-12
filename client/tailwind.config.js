/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6', // Optimized blue
                secondary: '#10b981', // Optimized green
                accent: '#f59e0b', // Optimized amber
                dark: '#1f2937',
                light: '#f3f4f6',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
