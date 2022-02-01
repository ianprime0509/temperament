/**
 * @typedef {import("../schema").Temperament} TemperamentData
 */
import { readFile } from "node:fs/promises";

import { Assertion } from "uvu/assert";

import { OCTAVE_SIZE } from "../index.js";

export const equalTemperament = await readTemperament("equal");
export const quarterCommaMeantone = await readTemperament(
  "quarterCommaMeantone"
);
export const pythagoreanD = await readTemperament("pythagoreanD");

/**
 * @param {string} name
 * @returns {Promise<TemperamentData>}
 */
async function readTemperament(name) {
  return JSON.parse(
    await readFile(new URL(`../temperaments/${name}.json`, import.meta.url), {
      encoding: "utf-8",
    })
  );
}

/**
 * Adds the given number of cents to the given pitch.
 *
 * @param {number} pitch
 * @param {number} cents
 * @returns {number} the resulting pitch, in Hz
 */
export function addCents(pitch, cents) {
  return pitch * 2 ** (cents / OCTAVE_SIZE);
}

/**
 * Asserts that one number is close to another, within a certain tolerance.
 *
 * @param {number} actual
 * @param {number} expects
 */
export function assertClose(actual, expects) {
  if (Math.abs(actual - expects) > 0.005) {
    throw new Assertion({
      operator: "close",
      message: `Expected ${actual} to be close to ${expects}`,
      generated: true,
      actual,
      expects,
    });
  }
}
