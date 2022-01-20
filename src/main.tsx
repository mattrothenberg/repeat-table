import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider, Frame } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";

ReactDOM.render(
  <React.StrictMode>
    <AppProvider i18n={enTranslations}>
      <Frame>
        <App />
      </Frame>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
