/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
import { theme as chakraTheme } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    ...chakraTheme.fonts,
    body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
    heading: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`
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

