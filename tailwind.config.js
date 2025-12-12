/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    pink: '#F52C8F',
                    dark: '#0B0C15',
                    card: '#151621',
                }
            },
            fontFamily: {
                logo: ['"Courier Prime"', 'monospace'],
                sans: ['"Inter"', 'sans-serif'],
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
                'ripple': 'ripple-effect 2.5s linear infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'ripple-effect': {
                    '0%': { width: '0px', height: '0px', opacity: '0.8', borderWidth: '4px' },
                    '100%': { width: '300px', height: '300px', opacity: '0', borderWidth: '0px' },
                }
            }
        }
    },
    plugins: [],
}
