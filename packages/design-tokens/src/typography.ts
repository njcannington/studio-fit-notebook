export const fontFamilies = {
  display: 'Caveat',
  displayAlt: 'Yellowtail',
  block: 'Oswald',
  pencil: 'Architects Daughter',
  pencilAlt: 'Patrick Hand',
  pencilMono: 'Special Elite',
} as const;

type TypeStyle = {
  fontFamily: keyof typeof fontFamilies;
  fontSize: number;
  lineHeight: number;
  fontWeight?: number;
  letterSpacing?: number;
  textTransform?: 'uppercase';
};

export const typography = {
  displayXl: { fontFamily: 'display', fontSize: 64, lineHeight: 1.0, fontWeight: 700 },
  displayLg: { fontFamily: 'display', fontSize: 40, lineHeight: 1.1, fontWeight: 700 },
  displayMd: { fontFamily: 'display', fontSize: 28, lineHeight: 1.2, fontWeight: 400 },

  blockLg: {
    fontFamily: 'block',
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: 0.05,
    textTransform: 'uppercase',
  },
  blockMd: {
    fontFamily: 'block',
    fontSize: 14,
    lineHeight: 1.3,
    fontWeight: 400,
    letterSpacing: 0.05,
    textTransform: 'uppercase',
  },
  blockSm: {
    fontFamily: 'block',
    fontSize: 11,
    lineHeight: 1.3,
    fontWeight: 300,
    letterSpacing: 0.05,
    textTransform: 'uppercase',
  },

  pencilXl: { fontFamily: 'pencil', fontSize: 32, lineHeight: 1.3 },
  pencilLg: { fontFamily: 'pencil', fontSize: 22, lineHeight: 1.4 },
  pencilMd: { fontFamily: 'pencil', fontSize: 18, lineHeight: 1.5 },
  pencilSm: { fontFamily: 'pencil', fontSize: 14, lineHeight: 1.5 },
} as const satisfies Record<string, TypeStyle>;

export type Typography = typeof typography;
export type FontFamilies = typeof fontFamilies;
