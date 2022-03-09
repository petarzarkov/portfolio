import React from "react";
import { ColorTheme } from "@contracts";
import { storeData, getData } from "@store";
import { ProviderBase, Context, ContextSettings } from "./Context";
import { Dark, Light } from "../theme";
import { getTheme } from "../utils/getTheme";

export class SugarProvider extends React.Component {
  isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  state: ProviderBase = {
    theme: this.isSystemDark ? "dark" : "light",
    colors: this.isSystemDark ? Dark : Light,
    isLoading: false,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    const settings = getData<ContextSettings>("latest_settings");
    if (settings) {
      this.setState({
        ...(settings.theme && {
          theme: settings.theme,
          colors: getTheme(settings.theme).colors,
        }),
      });
    }

    this.setState({ isLoading: false });
  }

  setTheme = (t: ColorTheme) => {
    this.setState({ theme: t, colors: getTheme(t).colors });
    void storeData("latest_settings", {
      theme: t,
    });
  };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          setTheme: this.setTheme,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}
