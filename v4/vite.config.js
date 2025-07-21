import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  serverOptions: {
    Headers: {
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  },
});
