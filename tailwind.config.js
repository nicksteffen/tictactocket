// import animate from "tailwindcss-animate"

// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: ["class"],
//   content: [
//     './pages/**/*.{ts,tsx,vue}',
//     './components/**/*.{ts,tsx,vue}',
//     './app/**/*.{ts,tsx,vue}',
//     './src/**/*.{ts,tsx,vue}',
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "var(--border)",
//         input: "var(--input)",
//         ring: "var(--ring)",
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//         primary: {
//           DEFAULT: "var(--primary)",
//           foreground: "var(--primary-foreground)",
//         },
//         secondary: {
//           DEFAULT: "var(--secondary)",
//           foreground: "var(--secondary-foreground)",
//         },
//         destructive: {
//           DEFAULT: "var(--destructive)",
//           foreground: "var(--destructive-foreground)",
//         },
//         muted: {
//           DEFAULT: "var(--muted)",
//           foreground: "var(--muted-foreground)",
//         },
//         accent: {
//           DEFAULT: "var(--accent)",
//           foreground: "var(--accent-foreground)",
//         },
//         popover: {
//           DEFAULT: "var(--popover)",
//           foreground: "var(--popover-foreground)",
//         },
//         card: {
//           DEFAULT: "var(--card)",
//           foreground: "var(--card-foreground)",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: 0 },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: 0 },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [animate],
// }



import animate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // --- BASE COLORS (Updated for Alpha Channel) ---
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)", // FIX for outline-ring/50
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        
        // --- PRIMARY ---
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        // --- SECONDARY ---
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        // --- DESTRUCTIVE ---
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        // --- MUTED ---
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        // --- ACCENT ---
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        // --- POPOVER ---
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        // --- CARD ---
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        // NOTE: You should also add your 'chart-x' and 'sidebar-x' colors here 
        // if you ever use opacity with them (e.g., bg-sidebar/50).
        // If not, they are fine being left out, but it is best practice to include them.
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
}