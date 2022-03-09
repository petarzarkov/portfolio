import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SugarProvider } from "./context";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <SugarProvider>
      <App />
    </SugarProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
