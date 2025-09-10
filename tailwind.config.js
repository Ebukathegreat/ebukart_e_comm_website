/** @type {import('tailwindcss').Config} */
export const darkMode = "class";
export const content = [
  "./app/**/*.{js,ts,jsx,tsx}", // App Router files
  "./pages/**/*.{js,ts,jsx,tsx}", // Pages dir if any
  "./components/**/*.{js,ts,jsx,tsx}", // Components
];
export const theme = {
  extend: {
    // your theme extensions here (optional)
  },
};
export const plugins = [];
