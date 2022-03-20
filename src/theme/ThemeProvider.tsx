import React from "react";
import { storeData, getData } from "@store";
import { ProviderBase, Context, ContextSettings, ColorTheme } from "./ThemeContext";
import { themes } from "@theme";
import { ChakraProvider } from "@chakra-ui/react";

export class ThemeProvider extends React.Component {
  isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  state: ProviderBase = {
    theme: "teal",
    colors: themes.teal,
    isLoading: false,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    const settings = getData<ContextSettings>("latest_settings");
    if (settings && themes[settings.theme]) {
      this.setState({
        ...(settings.theme && {
          theme: settings.theme,
          colors: themes[settings.theme],
        }),
      });
    }

    this.setState({ isLoading: false });
  }

  setTheme = (t: ColorTheme) => {
    this.setState({ theme: t, colors: themes[t] });
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
        <ChakraProvider theme={this.state.colors}>
          {this.props.children}
        </ChakraProvider>
      </Context.Provider>
    );
  }
}
