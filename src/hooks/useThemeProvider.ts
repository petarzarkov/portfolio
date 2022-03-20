import React from "react";
import { Context } from "@theme";

export function useThemeProvider() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error("useThemeProvider must be used within a ThemeProvider");
  }

  return context;
}
