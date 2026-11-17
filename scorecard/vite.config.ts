import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { scorecardSavePlugin } from "./vite-plugin-scorecard-save";

export default defineConfig({
  plugins: [react(), scorecardSavePlugin()],
  server: { port: 5199, strictPort: false },
});
