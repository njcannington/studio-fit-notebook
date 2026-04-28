import { colors } from './colors';
import { spacing } from './spacing';

export const radii = {
  sm: 4,
  md: 8,
} as const;

export const shadows = {
  paperCard: {
    offsetX: 0,
    offsetY: 2,
    blur: 8,
    color: 'rgba(26, 20, 16, 0.12)',
    css: '0 2px 8px rgba(26, 20, 16, 0.12)',
  },
} as const;

export const surfaces = {
  paperCard: {
    background: colors.paper.cream,
    borderRadius: radii.md,
    padding: spacing[5],
    shadow: shadows.paperCard,
    ruleColor: colors.paper.rule,
    ruleSpacing: 24,
  },
  ironChrome: {
    background: colors.iron.base,
    text: colors.iron.stencil,
  },
  ironDeep: {
    background: colors.iron.deep,
    text: colors.iron.stencil,
  },
} as const;

export type Surfaces = typeof surfaces;
