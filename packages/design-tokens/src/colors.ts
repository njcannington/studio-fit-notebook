export const colors = {
  paper: {
    cream: '#EFE6D2',
    creamDeep: '#E5DBC2',
    rule: '#A8B5C4',
    margin: '#C44E3D',
  },
  ink: {
    pencil: '#3A332C',
    pencilLight: '#6B6258',
    pencilFaded: '#9A9087',
    tally: '#3A332C',
  },
  iron: {
    deep: '#1A1410',
    base: '#2D2823',
    light: '#4A433C',
    stencil: '#EFE6D2',
  },
  rust: {
    base: '#A8341E',
    deep: '#7C2412',
  },
} as const;

export const status = {
  draft: colors.ink.pencilFaded,
  published: colors.ink.pencil,
  completed: colors.ink.pencilLight,
  attention: colors.rust.base,
  synced: colors.ink.pencilLight,
  pendingSync: colors.paper.margin,
} as const;

export type Colors = typeof colors;
export type Status = typeof status;
