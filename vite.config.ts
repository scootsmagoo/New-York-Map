import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" keeps asset paths relative so the build works on GitHub Pages
// (scootsmagoo.github.io/New-York-Map/) and when opened from disk.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
