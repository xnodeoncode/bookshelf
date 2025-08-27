import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: "mybookshelf.localhost",
    allowedHosts: ["mybookshelf.localhost", "127.0.0.1"],
    port: 5173,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  },
});
