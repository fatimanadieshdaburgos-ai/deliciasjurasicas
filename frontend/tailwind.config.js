/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#fff8f1',
                    100: '#ffefdb',
                    200: '#ffdcb5',
                    300: '#ffc085',
                    400: '#ff9d4d',
                    500: '#f97316', // Orange-500 (Main Brand)
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
                secondary: {
                    50: '#f2fcf5',
                    100: '#e1f8e8',
                    200: '#c3eed4',
                    300: '#95deb6',
                    400: '#5ec493',
                    500: '#38a778',
                    600: '#288660',
                    700: '#236b4f', // Green-700 (Secondary Brand)
                    800: '#1f5541',
                    900: '#1a4637',
                    950: '#0e2820',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
