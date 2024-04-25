// Put this in a file like 'theme-overrides.d.ts' and make sure it's included in your tsconfig.json

import '@mui/material/styles';
import { TypographyProps } from '@mui/material/Typography';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    block: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    block?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    block: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsSizeOverrides {
    big: true;
  }
}