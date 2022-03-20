/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
import { theme as chakraTheme } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

export const teal = extendTheme({
  fonts: {
    ...chakraTheme.fonts,
    body: `'Courier New', monospace;`,
    heading: `'Courier New', monospace;`
  },
  colors: {
    ...chakraTheme.colors,
    primary: {
      "50": "#ECF8F8",
      "100": "#CAEDEC",
      "200": "#A8E1E0",
      "300": "#85D5D4",
      "400": "#63CAC7",
      "500": "#41BEBB",
      "600": "#349896",
      "700": "#277270",
      "800": "#1A4C4B",
      "900": "#0D2625"
    },
  },
});

export const gray = extendTheme({
  fonts: {
    ...chakraTheme.fonts,
    body: `'Courier New', monospace;`,
    heading: `'Courier New', monospace;`
  },
  colors: {
    ...chakraTheme.colors,
    primary: chakraTheme.colors.gray,
  },
});

export const orange = extendTheme({
  fonts: {
    ...chakraTheme.fonts,
    body: `'Courier New', monospace;`,
    heading: `'Courier New', monospace;`
  },
  colors: {
    ...chakraTheme.colors,
    primary: chakraTheme.colors.orange,
  },
});

export const themes = {
  orange,
  teal,
  gray
};