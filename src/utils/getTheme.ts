import { Colors, ColorTheme } from "@contracts";
import { Dark, Light } from "../theme";

export const getTheme = (
  theme: ColorTheme,
): { isDarkMode: boolean; colors: Colors } => {
  const currentTheme = theme || "dark";
  const isDarkMode = currentTheme === "dark";

  return {
    isDarkMode,
    colors: isDarkMode ? Dark : Light,
  };
};
