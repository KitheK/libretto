import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { PrefsProvider } from "./components/PrefsProvider";
import { applyDocumentPrefs, getReadingFace, getReadingMode } from "./lib/prefs";
import "./styles.css";

applyDocumentPrefs(getReadingMode(), getReadingFace());

const root = document.getElementById("root");
if (!root) {
  throw new Error("root element missing");
}

createRoot(root).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
);
