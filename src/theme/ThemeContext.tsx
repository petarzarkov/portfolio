import React from "react";
import { Expand } from "@contracts";

export type ColorTheme = "teal" | "orange" | "gray";
export type ContextSettings = {
  theme: ColorTheme;
};

export type ProviderBase = Expand<
{
  colors: Record<string, string>;
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
