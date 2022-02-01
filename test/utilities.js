import { suite } from "uvu";
import * as assert from "uvu/assert";

import { equalTemperament } from "./helpers.js";
import { Temperament } from "../index.js";

const test = suite("utility methods");

test("getOctaveRange returns a range of octaves around the reference octave", () => {
  const equal = new Temperament(equalTemperament);
  assert.equal(equal.getOctaveRange(0), [4]);
});

test("getOctaveRange throws an error if the radius is negative", () => {
  const equal = new Temperament(equalTemperament);
  assert.throws(() => equal.getOctaveRange(-1), "Radius must not be negative");
});

test.run();
