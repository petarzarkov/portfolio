import { theme as chakraTheme } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const genTheme = (primaryColor: Record<string | number, string>) => extendTheme({
  fonts: {
    ...chakraTheme.fonts,
    body: "'Courier New', monospace;",
    heading: "'Courier New', monospace;"
  },
  colors: {
    ...chakraTheme.colors,
    primary: primaryColor,
  },
  shadows: {
    ...chakraTheme.shadows,
    outline: "0 0 0 3px rgba(255, 255, 255, 0.16)"
  }
});

export type ColorTheme = Exclude<keyof typeof chakraTheme.colors, "transparent" | "black" | "white" | "blackAlpha" | "whiteAlpha" | "current">;
export const themes = Object.entries(chakraTheme.colors).reduce((prev, curr) => {
  if (curr?.[1] && curr?.[1]?.[50] && !curr?.[0].includes("Alpha")) {
    prev[curr[0] as ColorTheme] = genTheme(curr[1] as Record<number, string>);
  }

  return prev;
}, {} as Record<ColorTheme, Record<number, string>>);
