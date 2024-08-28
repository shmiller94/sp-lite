const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1280px',
      },
    },
    extend: {
      backgroundImage: {
        'female-hands': "url('/onboarding/bg-female-hands.png')",
        'female-spotlight': "url('/onboarding/bg-female-spotlight.png')",
        'male': "url('/onboarding/bg-male.png')",
        'male-large': "url('/onboarding/bg-male-large.png')",
        'spine': "url('/onboarding/bg-spine.png')",
        'spine-2': "url('/onboarding/bg-spine-2.png')",
        'female-looking-up': "url('/onboarding/bg-female-looking-up.png')",
        'membership-card': "url('/shared/membership-card.png')",
        'female-spine': "url('/onboarding/bg-female-spine.png')",
        'female-stretching': "url('/onboarding/bg-female-stretching.png')",
        "watch": "url('/onboarding/bg-watch.png')",
        "hand-pillow": "url('/onboarding/bg-hand-pillow.png')",
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        vermillion: {
          50: "#FFF6EA",
          100: "#FFEDD5",
          300: "#FED7AA",
          500: "#FDBA74",
          700: "#F7861E",
          900: "#FC5F2B"
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ["nbinternationalproreg", ...defaultTheme.fontFamily.sans],
        mono: ["nbinternationalpromono", ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1280px',
      },
      letterSpacing: {
        "display-heading": "-3.84px"
      },
      fontSize: {
        "9xl": ["128px", "144px"],
        "6xl": ["64px", "72px"],
        "3xl": ["32px", "40px"]
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
};
