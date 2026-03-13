import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060B17',
        panel: '#0D1426',
        accent: '#53D3FF',
        glow: '#9F7AEA',
        success: '#52E5B1'
      },
      boxShadow: {
        glass: '0 10px 40px rgba(14, 165, 233, 0.15)',
        neon: '0 0 50px rgba(103, 232, 249, 0.2)'
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' }
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        drift: 'drift 10s ease-in-out infinite',
        pulseSlow: 'pulseSlow 6s ease-in-out infinite',
        ticker: 'ticker 24s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
