import {
  Architects_Daughter,
  Caveat,
  Oswald,
  Special_Elite,
} from "next/font/google";

export const fontDisplay = Caveat({
  variable: "--font-display-loaded",
  subsets: ["latin"],
  display: "swap",
});

export const fontBlock = Oswald({
  variable: "--font-block-loaded",
  subsets: ["latin"],
  display: "swap",
});

export const fontPencil = Architects_Daughter({
  variable: "--font-pencil-loaded",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const fontPencilMono = Special_Elite({
  variable: "--font-pencil-mono-loaded",
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
