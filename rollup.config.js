import babel from "rollup-plugin-babel";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "lib/index.js",
      format: "cjs",
    },
    {
      file: "lib/index.mjs",
      format: "es",
    },
  ],
  plugins: [
    json(),
    babel({
      exclude: "node_modules/**",
      extensions: [".ts", ".js"],
    }),
  ],
  external: ["ajv"],
};
