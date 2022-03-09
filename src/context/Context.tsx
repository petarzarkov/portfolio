import React from "react";
import { Colors, ColorTheme, Expand } from "@contracts";

export type ContextSettings = {
  theme: ColorTheme;
};

export type ProviderBase = Expand<
{
  colors: Colors;
  isLoading: boolean;
} & ContextSettings
>;

export type ContextState = Expand<
ProviderBase & {
  setTheme: (theme: ColorTheme) => void;
}
>;

export const Context = React.createContext<ContextState | undefined>(
  undefined,
);
