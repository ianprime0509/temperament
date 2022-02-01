import { suite } from "uvu";
import * as assert from "uvu/assert";

import { equalTemperament } from "./helpers.js";
import { Temperament } from "../index.js";

const test = suite("JSON conversion");

test("toJSON returns a temperament data object", () => {
  const equal = new Temperament(equalTemperament);

  assert.equal(equal.toJSON(), {
    name: "Equal temperament",
    description: "Standard twelve-tone equal temperament.",
    source:
      "https://en.wikipedia.org/wiki/Equal_temperament#Twelve-tone_equal_temperament",
    referenceName: "A",
    referencePitch: 440,
    referenceOctave: 4,
    octaveBaseName: "C",
    notes: {
      C: ["A", -900],
      "C♯": ["A", -800],
      D: ["A", -700],
      "E♭": ["A", -600],
      E: ["A", -500],
      F: ["A", -400],
      "F♯": ["A", -300],
      G: ["A", -200],
      "G♯": ["A", -100],
      A: ["A", 0],
      "B♭": ["A", 100],
      B: ["A", 200],
    },
  });
});

test.run();
