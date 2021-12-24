import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Temperament",
      fileName: (format) => `temperament.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ["ajv"],
      output: {
        globals: {
          ajv: "ajv",
        },
      },
    },
  },
});
