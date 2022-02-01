import { suite } from "uvu";
import * as assert from "uvu/assert";

import { equalTemperament, quarterCommaMeantone } from "./helpers.js";
import { Temperament } from "../index.js";

const test = suite("getters and setters");

test("noteNames returns an ordered array of note names with equal temperament", () => {
  const equal = new Temperament(equalTemperament);
  assert.equal(equal.noteNames, [
    "C",
    "C♯",
    "D",
    "E♭",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
    "A",
    "B♭",
    "B",
  ]);
});

test("noteNames returns an ordered array of note names with quarater-comma meantone", () => {
  const qcm = new Temperament(quarterCommaMeantone);
  assert.equal(qcm.noteNames, [
    "C",
    "C♯",
    "D",
    "E♭",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
    "A",
    "B♭",
    "B",
  ]);
});

test("octaveBaseName returns the name of the octave base note", () => {
  const equal = new Temperament(equalTemperament);

  assert.equal(equal.octaveBaseName, "C");
});

test("referenceName returns the name of the reference note", () => {
  const equal = new Temperament(equalTemperament);

  assert.equal(equal.referenceName, "A");
});

test("referenceOctave returns the octave number of the reference note", () => {
  const equal = new Temperament(equalTemperament);

  assert.equal(equal.referenceOctave, 4);
});

test("referencePitch returns the pitch of the reference note", () => {
  const equal = new Temperament(equalTemperament);

  assert.equal(equal.referencePitch, 440);
});

test("referencePitch sets the pitch of the reference note", () => {
  const equal = new Temperament(equalTemperament);

  equal.referencePitch = 441;
  assert.equal(equal.referencePitch, 441);
});

test("setting referencePitch throws an error if the pitch is not positive", () => {
  const equal = new Temperament(equalTemperament);

  assert.throws(() => (equal.referencePitch = 0), "Pitch must be positive");
  assert.equal(equal.referencePitch, 440);

  assert.throws(() => (equal.referencePitch = -2), "Pitch must be positive");
  assert.equal(equal.referencePitch, 440);
});

test.run();
