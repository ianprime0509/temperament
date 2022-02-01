/**
 * @typedef {import("../schema").Temperament} TemperamentData
 */
import { suite } from "uvu";
import * as assert from "uvu/assert";

import {
  equalTemperament,
  quarterCommaMeantone,
  pythagoreanD,
} from "./helpers.js";
import { Temperament } from "../index.js";

const test = suite("Temperament constructor");

test("does not throw an error on valid inputs", () => {
  assert.not.throws(() => new Temperament(equalTemperament));
  assert.not.throws(() => new Temperament(quarterCommaMeantone));
  assert.not.throws(() => new Temperament(pythagoreanD));
});

test("works correctly for a temperament with all notes defined relative to the reference pitch", () => {
  const temperament = new Temperament({
    name: "Notes defined relative to reference",
    referenceName: "A",
    referencePitch: 440,
    referenceOctave: 4,
    octaveBaseName: "C",
    notes: {
      C: ["A", 300],
      D: ["A", 500],
      E: ["A", 700],
    },
  });
  assert.equal(temperament.getOffset("C", 4), -900);
  assert.equal(temperament.getOffset("D", 4), -700);
  assert.equal(temperament.getOffset("E", 4), -500);
  assert.equal(temperament.getOffset("A", 4), 0);
});

test("works correctly for a temperament with multiple non-conflicting offsets for the same note", () => {
  const temperament = new Temperament({
    name: "Multiple non-conflicting offsets",
    referenceName: "A",
    referencePitch: 440,
    referenceOctave: 4,
    octaveBaseName: "C",
    notes: {
      A: ["C", -300],
      C: ["A", 1500],
      D: ["C", 200],
    },
  });
  assert.equal(temperament.getOffset("C", 4), -900);
  assert.equal(temperament.getOffset("D", 4), -700);
  assert.equal(temperament.getOffset("A", 4), 0);
});

test("throws an error when the input contains no notes", () => {
  assert.throws(
    () =>
      new Temperament({
        name: "No notes",
      }),
    "Incorrect temperament format"
  );
});

test("throws an error when the input notes are in an invalid format", () => {
  assert.throws(
    () =>
      new Temperament({
        name: "Invalid notes",
        referenceName: "A",
        referencePitch: 440,
        referenceOctave: 4,
        octaveBaseName: "C",
        notes: {
          A: "A",
          C: "C",
        },
      }),
    "Incorrect temperament format"
  );
});

test("throws an error when the notes object is empty", () => {
  assert.throws(
    () =>
      new Temperament({
        name: "Empty notes object",
        referenceName: "A",
        referencePitch: 440,
        referenceOctave: 4,
        octaveBaseName: "C",
        notes: {},
      }),
    "Incorrect temperament format"
  );
});

test("throws an error when the reference pitch is non-positive", () => {
  assert.throws(
    () =>
      new Temperament({
        name: "Non-positive reference pitch",
        referenceName: "A",
        referencePitch: 0,
        referenceOctave: 4,
        octaveBaseName: "C",
        notes: {
          A: ["A", 0],
        },
      }),
    "Incorrect temperament format"
  );
});

test("throws an error when given conflicting note definitions", () => {
  assert.throws(
    () =>
      new Temperament({
        name: "Conflicting definitions",
        referenceName: "A",
        referencePitch: 440,
        referenceOctave: 4,
        octaveBaseName: "C",
        notes: {
          A: ["C", 400],
          C: ["A", 500],
        },
      }),
    "Conflicting definition"
  );
});

test("throws an error when not enough note information is given", () => {
  assert.throws(
    () =>
      new Temperament({
        name: "Not enough information",
        referenceName: "A",
        referencePitch: 440,
        referenceOctave: 4,
        octaveBaseName: "C",
        notes: {
          A: ["A", 0],
          F: ["F", 0],
          C: ["A", 500],
        },
      }),
    "Not able to determine the pitch"
  );
});

test("throws an error when the octave base is not defined as a note", () => {
  assert.throws(
    () =>
      new Temperament({
        name: "Octave base not defined as a note",
        referenceName: "A",
        referencePitch: 440,
        referenceOctave: 4,
        octaveBaseName: "C",
        notes: {
          A: ["A", 0],
          B: ["A", 200],
        },
      }),
    "Octave base not defined as a note"
  );
});

test.run();
