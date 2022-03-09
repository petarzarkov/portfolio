import React from "react";
import { Header, IconLink, Button } from "@components";
import { useSugarProvider } from "@hooks";

function App() {
  const { colors, setTheme, theme } = useSugarProvider();
  return (
    <div style={{ backgroundColor: colors.background, height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      <Header title={"Boilerplate for Vite, React, Typescript"} />
      <div style={{ alignSelf: "center" }}>
        <IconLink title={"ViteJS"} iconSrc={"https://vitejs.dev/logo.svg"} link={"https://vitejs.dev/"} />
        <IconLink title={"React"} iconSrc={"https://reactnative.dev/img/pwa/manifest-icon-512.png"} link={"https://reactjs.org/"} />
        <IconLink title={"JavaScript"}
          iconSrc={"https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png"} link={"https://www.javascript.com/"} />
        <IconLink title={"Typescript"} iconSrc={"https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae"} link={"https://www.typescriptlang.org/"} />
        <Button text={`Theme is: ${theme}`} onPress={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }} />
      </div>
    </div>
  );
}

export default App;
