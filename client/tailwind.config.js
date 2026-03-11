/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1e3a8a', // Deep Royal Blue
                secondary: '#22d3ee', // Bright Cyan Accent
                accent: '#7c3aed', // Deep Purple
                dark: '#0f172a',
                light: '#f8fafc',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
