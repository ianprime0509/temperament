import { suite } from "uvu";
import * as assert from "uvu/assert";

import { addCents, assertClose, equalTemperament } from "./helpers.js";
import { Temperament } from "../index.js";

const test = suite("pitch methods");

test("getNoteNameFromPitch identifies the closest note to a pitch", () => {
  // For equal temperament, you can find the pre-calculated frequency of
  // each note online, for example at
  // https://en.wikipedia.org/wiki/Piano_key_frequencies
  const equal = new Temperament(equalTemperament);

  assert.equal(equal.getNoteNameFromPitch(440)[0], "A");
  assert.equal(equal.getNoteNameFromPitch(880)[0], "A");
  assert.equal(equal.getNoteNameFromPitch(261.626)[0], "C");
  assert.equal(equal.getNoteNameFromPitch(addCents(261.626, 1))[0], "C");
  assert.equal(equal.getNoteNameFromPitch(addCents(311.127, -4))[0], "E♭");
  assert.equal(equal.getNoteNameFromPitch(addCents(1479.98, 20))[0], "F♯");
  assert.equal(equal.getNoteNameFromPitch(addCents(2637.02, -15))[0], "E");
  assert.equal(equal.getNoteNameFromPitch(addCents(34.6478, 7))[0], "C♯");
  assert.equal(equal.getNoteNameFromPitch(addCents(29.1352, -8))[0], "B♭");
  assert.equal(equal.getNoteNameFromPitch(addCents(493.883, 25))[0], "B");
  assert.equal(equal.getNoteNameFromPitch(addCents(523.251, -25))[0], "C");
});

test("getNoteNameFromPitch identifies the offset (in cents) from the closest note to a pitch", () => {
  const equal = new Temperament(equalTemperament);

  assertClose(equal.getNoteNameFromPitch(440)[1], 0);
  assertClose(equal.getNoteNameFromPitch(880)[1], 0);
  assertClose(equal.getNoteNameFromPitch(261.626)[1], 0);
  assertClose(equal.getNoteNameFromPitch(addCents(261.626, 1))[1], 1);
  assertClose(equal.getNoteNameFromPitch(addCents(311.127, -4))[1], -4);
  assertClose(equal.getNoteNameFromPitch(addCents(1479.98, 20))[1], 20);
  assertClose(equal.getNoteNameFromPitch(addCents(2637.02, -15))[1], -15);
  assertClose(equal.getNoteNameFromPitch(addCents(34.6478, 7))[1], 7);
  assertClose(equal.getNoteNameFromPitch(addCents(29.1352, -8))[1], -8);
  assertClose(equal.getNoteNameFromPitch(addCents(493.883, 25))[1], 25);
  assertClose(equal.getNoteNameFromPitch(addCents(523.251, -25))[1], -25);
});

test("getNoteNameFromPitch throws an error if the pitch is not positive", () => {
  const equal = new Temperament(equalTemperament);
  assert.throws(() => equal.getNoteNameFromPitch(0), "Pitch must be positive");
  assert.throws(() => equal.getNoteNameFromPitch(-5), "Pitch must be positive");
});

test("getPitch returns the correct note pitch in equal temperament", () => {
  // For equal temperament, you can find the pre-calculated frequency of each
  // note online, for example at
  // https://en.wikipedia.org/wiki/Piano_key_frequencies
  const equal = new Temperament(equalTemperament);

  assertClose(equal.getPitch("A", 4), 440);
  assertClose(equal.getPitch("A", 5), 880);
  assertClose(equal.getPitch("C", 5), 523.251);
  assertClose(equal.getPitch("F♯", 4), 369.994);
  assertClose(equal.getPitch("B", 7), 3951.07);
  assertClose(equal.getPitch("B♭", 2), 116.541);
  assertClose(equal.getPitch("C♯", 0), 17.3239);
});

test.run();
