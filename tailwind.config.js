/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
        orbitron: ['Orbitron', 'monospace'],
      },
      colors: {
        neon: {
          cyan: '#22d3ee',
          violet: '#8b5cf6',
          gold: '#fbbf24',
        },
      },
      backgroundImage: {
        'grid-dark': `
          linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
