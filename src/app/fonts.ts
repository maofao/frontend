import { Manrope, Oswald } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

export const fonts = {
  variable: `${manrope.variable} ${oswald.variable}`.trim(),
};
