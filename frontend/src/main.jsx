import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SettingsProvider } from "./context/SettingsContext";
import { AnnouncementProvider } from "./context/AnnouncementContext";
import { DocumentProvider } from "./context/DocumentContext";
import "./styles/global.css";

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
