import { Colors } from "@contracts";

const Base = {
  success: "#00C851",
  error: "#ff4444",
  accent: "#ff5722",
  card: "rgb(255, 255, 255)",
  border: "rgb(216, 216, 216)",
  notification: "rgb(255, 59, 48)",
};

export const Dark: Colors = {
  ...Base,
  primary: "#424242",
  primaryLight: "#8d8d8d",
  text: "#eeeeee",
  background: "#616161",
};

export const Light: Colors = {
  ...Base,
  accent: "#066100",
  primary: "#eeeeee",
  primaryLight: "#ffffff",
  text: "rgb(0 0 0)",
  background: "white",
};
