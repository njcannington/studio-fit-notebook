import {
  Architects_Daughter,
  Caveat,
  Oswald,
  Special_Elite,
} from "next/font/google";

export const fontDisplay = Caveat({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const fontBlock = Oswald({
  variable: "--font-block",
  subsets: ["latin"],
  display: "swap",
});

export const fontPencil = Architects_Daughter({
  variable: "--font-pencil",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const fontPencilMono = Special_Elite({
  variable: "--font-pencil-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const fontVariableClassNames = [
  fontDisplay.variable,
  fontBlock.variable,
  fontPencil.variable,
  fontPencilMono.variable,
].join(" ");
