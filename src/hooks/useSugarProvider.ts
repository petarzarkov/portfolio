import React from "react";
import { Context } from "../context";

export function useSugarProvider() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error("useSugarProvider must be used within a SugarProvider");
  }

  return context;
}
