export { colors, status } from './colors';
export type { Colors, Status } from './colors';

export { fontFamilies, typography } from './typography';
export type { FontFamilies, Typography } from './typography';

export { spacing, tapTargetMin } from './spacing';
export type { Spacing } from './spacing';

export { radii, shadows, surfaces } from './surfaces';
export type { Surfaces } from './surfaces';

import { colors, status } from './colors';
import { fontFamilies, typography } from './typography';
import { spacing, tapTargetMin } from './spacing';
import { radii, shadows, surfaces } from './surfaces';

export const tokens = {
  colors,
  status,
  fontFamilies,
  typography,
  spacing,
  tapTargetMin,
  radii,
  shadows,
  surfaces,
} as const;

export type Tokens = typeof tokens;
