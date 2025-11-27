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
                // Paleta Principal - Delicias Jurásicas
                beige: {
                    50: '#fdfbf7',
                    100: '#fbf7ed',
                    200: '#f8f0db',
                    300: '#f5e6a8', // Base Beige - Cálido y acogedor
                    400: '#f0d97d',
                    500: '#e9ca52',
                    600: '#d4b03a',
                    700: '#b08f2f',
                    800: '#8c7025',
                    900: '#6e5a1e',
                },
                verde: {
                    50: '#f5fdf4',
                    100: '#e8fce5',
                    200: '#d4f8cd',
                    300: '#aceb8d', // Verde fresco - Modernidad y diversión
                    400: '#84de69',
                    500: '#5fcf46',
                    600: '#47b831',
                    700: '#3a9528',
                    800: '#2f7621',
                    900: '#26601c',
                },
                amarillo: {
                    50: '#fefdf0',
                    100: '#fdfbe0',
                    200: '#fbf7c0',
                    300: '#f9f39f',
                    400: '#f0eb73',
                    500: '#dbd749', // Amarillo intenso - CTAs y acentos
                    600: '#c4c332',
                    700: '#a3a028',
                    800: '#827f20',
                    900: '#68651a',
                },
                // Colores Jurásicos (adicionales para variedad)
                naranja: {
                    50: '#fff8f1',
                    100: '#ffefdb',
                    200: '#ffdcb5',
                    300: '#ffc085',
                    400: '#ff9d4d',
                    500: '#f97316', // Naranja - Energía (para elementos destacados)
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                chocolate: {
                    50: '#f7f4f1',
                    100: '#ede6de',
                    200: '#dbc9bd',
                    300: '#c9ac9b',
                    400: '#b08270',
                    500: '#8b5e3c', // Chocolate - Calidez (productos de chocolate)
                    600: '#6f4a2f',
                    700: '#583b26',
                    800: '#422d1d',
                    900: '#2d1f14',
                },
                // Neutros del sistema
                primary: {
                    50: '#f5fdf4',
                    100: '#e8fce5',
                    200: '#d4f8cd',
                    300: '#aceb8d',
                    400: '#84de69',
                    500: '#5fcf46', // Verde como primario
                    600: '#47b831',
                    700: '#3a9528',
                    800: '#2f7621',
                    900: '#26601c',
                },
                secondary: {
                    50: '#fdfbf7',
                    100: '#fbf7ed',
                    200: '#f8f0db',
                    300: '#f5e6a8',
                    400: '#f0d97d',
                    500: '#e9ca52', // Beige como secundario
                    600: '#d4b03a',
                    700: '#b08f2f',
                    800: '#8c7025',
                    900: '#6e5a1e',
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
