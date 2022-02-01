import { writeFile } from "node:fs/promises";

import { compile } from "json-schema-to-typescript";

import { schema } from "./index.js";

await writeFile("schema.json", JSON.stringify(schema, null, 2), {
  encoding: "utf-8",
});

await writeFile("schema.d.ts", await compile(schema, "Temperament"), {
  encoding: "utf-8",
});
