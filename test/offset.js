import { suite } from "uvu";
import * as assert from "uvu/assert";

import {
  assertClose,
  equalTemperament,
  quarterCommaMeantone,
} from "./helpers.js";
import { Temperament } from "../index.js";

const test = suite("offset methods");

test("getOffset returns the correct offsets in equal temperament", () => {
  const equal = new Temperament(equalTemperament);

  assertClose(equal.getOffset("A", 4), 0);
  assertClose(equal.getOffset("A", 6), 2400);
  assertClose(equal.getOffset("C", 4), -900);
  assertClose(equal.getOffset("C", 5), 300);
  assertClose(equal.getOffset("E♭", 4), -600);
  assertClose(equal.getOffset("E♭", 3), -1800);
  assertClose(equal.getOffset("G♯", 5), 1100);
  assertClose(equal.getOffset("B", 3), -1000);
});

test("getOffset returns the correct offsets in quarter-comma meantone", () => {
  const qcm = new Temperament(quarterCommaMeantone);

  assertClose(qcm.getOffset("A", 4), 0);
  assertClose(qcm.getOffset("D", 4), -696.6);
  assertClose(qcm.getOffset("C", 4), -889.8);
  assertClose(qcm.getOffset("C", 5), 310.2);
});

test("getOffset returns offsets above the octave base", () => {
  const temperament = new Temperament({
    name: "Sample temperament",
    referenceName: "A",
    referencePitch: 440,
    referenceOctave: 4,
    octaveBaseName: "C",
    notes: {
      G: ["A", -1400],
      A: ["A", 0],
      C: ["A", 300],
      D: ["C", -2200],
    },
  });

  assertClose(temperament.getOffset("G", 4), -200);
  assertClose(temperament.getOffset("A", 4), 0);
  assertClose(temperament.getOffset("C", 4), -900);
  assertClose(temperament.getOffset("D", 4), -700);
});

test("getOffset throws an error for non-existent notes", () => {
  const equal = new Temperament(equalTemperament);

  assert.throws(() => equal.getOffset("Q♯", 4), "Note 'Q♯' is not defined");
  assert.throws(() => equal.getOffset("AZ", 5), "Note 'AZ' is not defined");
});

test.run();
