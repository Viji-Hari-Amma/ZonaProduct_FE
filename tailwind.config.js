/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['"Josefin Sans"', "sans-serif"],
        delius: ["Delius", "cursive"],
      },
      screens: {
        xs: "600px",
        "max-w-375": { max: "375px" },
        "max-w-420": { max: "420px" },
        "max-w-540": { max: "540px" },
        "max-w-713": { max: "713px" },
        "max-w-768": { max: "768px" },
        "max-w-1000": { max: "1000px" },
      },
      colors: {
        "custom-orange": {
          50: "#FFF7ED",
          100: "#FFEDE9",
          500: "#F97316",
          600: "#DC2626",
          700: "#7C2D12",
          800: "#9A3412",
          "primary-orange": "#F97316",
          "primary-red": "#DC2626",
          "body-bg": "#FFF7ED",
          "section-bg": "#FFEDE9",
          "card-border": "#FED7AA",
          "input-border": "#FDBA74",
          "focused-input": "#F97316",
          divider: "#FECACA",
          "navbar-hover": "#FFE5E0",
          heading: "#7C2D12",
          paragraph: "#1E293B",
          "secondary-text": "#9A3412",
          "muted-text": "#9CA3AF",
          success: "#16A34A",
          warning: "#F59E0B",
          error: "#DC2626",
          info: "#2563EB",
        },
        "custom-amber": {
          200: "#FED7AA",
          300: "#FDBA74",
        },
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(90deg, #F97316, #DC2626)",
        "card-hover": "linear-gradient(135deg, #FFFFFF, #FFF5F0)",
      },
      boxShadow: {
        card: "0 6px 16px rgba(220, 38, 38, 0.15)",
        "card-hover": "0 10px 22px rgba(249, 115, 22, 0.25)",
        button: "0 4px 12px rgba(220, 38, 38, 0.35)",
        "button-hover": "0 6px 16px rgba(220, 38, 38, 0.45)",
      },
      keyframes: {
        fanOutLeft: {
          "0%": { transform: "translateX(0) scale(0.5)", opacity: "0" },
          "100%": { transform: "translateX(-80px) scale(1)", opacity: "1" },
        },
        fanOutRight: {
          "0%": { transform: "translateX(0) scale(0.5)", opacity: "0" },
          "100%": { transform: "translateX(80px) scale(1)", opacity: "1" },
        },
        fanOutCenter: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "bounce-slow": "bounce 2.5s infinite",
        fanLeft: "fanOutLeft 0.6s ease-out forwards",
        fanRight: "fanOutRight 0.6s ease-out forwards",
        fanCenter: "fanOutCenter 0.6s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
