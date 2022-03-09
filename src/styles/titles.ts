import { CSSProperties } from "react";

export const headerOne = (
  { size = 35, color = "rgb(244 156 37)", textShadowColor = "rgb(70 143 166)", shadowColor = "rgb(163 77 191)", shadowSize = 5 }:
  { size?: number; color?: string; shadowColor?: string; textShadowColor?: string;shadowSize?: number } = {}): CSSProperties => ({
  position: "relative",
  textAlign: "center",
  padding: 5,
  fontSize: size,
  color,
  textShadow: `${[...Array(shadowSize).keys()].map(ss => `-${ss + 1}px -${ss + 1}px 0 ${textShadowColor}`).join()},
      -30px 20px 40px ${shadowColor}`
});