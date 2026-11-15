import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/atkinson-hyperlegible";
import "@fontsource/noto-nastaliq-urdu";
import App from "./App";
import { SettingsProvider } from "./context/SettingsContext";
import { AnnouncementProvider } from "./context/AnnouncementContext";
import { DocumentProvider } from "./context/DocumentContext";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/pages.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AnnouncementProvider>
          <DocumentProvider>
            <App />
          </DocumentProvider>
        </AnnouncementProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
