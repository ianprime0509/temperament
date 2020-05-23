/*
 * Copyright 2018-2020 Ian Johnson
 *
 * This is free software, distributed under the MIT license.  A copy of the
 * license can be found in the LICENSE file in the project root, or at
 * https://opensource.org/licenses/MIT.
 */
/* eslint-env jest */

import { OCTAVE_SIZE, Temperament } from '.';

import { Temperament as TemperamentData } from './schema';

import equalTemperamentJson from '../temperaments/equal.json';
import quarterCommaMeantoneJson from '../temperaments/quarterCommaMeantone.json';
import pythagoreanDJson from '../temperaments/pythagoreanD.json';

const equalTemperament = (equalTemperamentJson as unknown) as TemperamentData;
const quarterCommaMeantone = (quarterCommaMeantoneJson as unknown) as TemperamentData;
const pythagoreanD = (pythagoreanDJson as unknown) as TemperamentData;

/**
 * Adds the given number of cents to the given pitch.
 *
 * @returns the resulting pitch, in Hz
 */
function addCents(pitch: number, cents: number): number {
  return pitch * 2 ** (cents / OCTAVE_SIZE);
}

describe('Temperament', () => {
  describe('constructor', () => {
    test('does not throw an error on valid inputs', () => {
      expect(() => new Temperament(equalTemperament)).not.toThrow();
      expect(() => new Temperament(quarterCommaMeantone)).not.toThrow();
      expect(() => new Temperament(pythagoreanD)).not.toThrow();
    });

    test('throws an error when the input format is invalid', () => {
      expect(
        () =>
          new Temperament(({
            name: 'No notes',
          } as unknown) as TemperamentData)
      ).toThrow('Incorrect temperament format');

      expect(
        () =>
          new Temperament(({
            name: 'Invalid notes',
            referenceName: 'A',
            referencePitch: 440,
            referenceOctave: 4,
            octaveBaseName: 'C',
            notes: {
              A: 'A',
              C: 'C',
            },
          } as unknown) as TemperamentData)
      ).toThrow('Incorrect temperament format');

      expect(
        () =>
          new Temperament({
            name: 'Empty notes object',
            referenceName: 'A',
            referencePitch: 440,
            referenceOctave: 4,
            octaveBaseName: 'C',
            notes: {},
          })
      ).toThrow('Incorrect temperament format');
    });

    test('throws an error when given conflicting note definitions', () => {
      expect(
        () =>
          new Temperament({
            name: 'Conflicting definitions',
            referenceName: 'A',
            referencePitch: 440,
            referenceOctave: 4,
            octaveBaseName: 'C',
            notes: {
              A: ['C', 400],
              C: ['A', 500],
            },
          })
      ).toThrow('Conflicting definition');
    });

    test('throws an error when not enough note information is given', () => {
      expect(
        () =>
          new Temperament({
            name: 'Not enough information',
            referenceName: 'A',
            referencePitch: 440,
            referenceOctave: 4,
            octaveBaseName: 'C',
            notes: {
              A: ['A', 0],
              F: ['F', 0],
              C: ['A', 500],
            },
          })
      ).toThrow('Not able to determine the pitch');
    });
  });

  describe('getNoteNameFromPitch()', () => {
    test('identifies the closest note to a pitch', () => {
      // For equal temperament, you can find the pre-calculated frequency of
      // each note online, for example at
      // https://en.wikipedia.org/wiki/Piano_key_frequencies
      const equal = new Temperament(equalTemperament);

      expect(equal.getNoteNameFromPitch(440)[0]).toBe('A');
      expect(equal.getNoteNameFromPitch(880)[0]).toBe('A');
      expect(equal.getNoteNameFromPitch(261.626)[0]).toBe('C');
      expect(equal.getNoteNameFromPitch(addCents(261.626, 1))[0]).toBe('C');
      expect(equal.getNoteNameFromPitch(addCents(311.127, -4))[0]).toBe('E♭');
      expect(equal.getNoteNameFromPitch(addCents(1479.98, 20))[0]).toBe('F♯');
      expect(equal.getNoteNameFromPitch(addCents(2637.02, -15))[0]).toBe('E');
      expect(equal.getNoteNameFromPitch(addCents(34.6478, 7))[0]).toBe('C♯');
      expect(equal.getNoteNameFromPitch(addCents(29.1352, -8))[0]).toBe('B♭');
      expect(equal.getNoteNameFromPitch(addCents(493.883, 25))[0]).toBe('B');
      expect(equal.getNoteNameFromPitch(addCents(523.251, -25))[0]).toBe('C');
    });

    test('identifies the offset (in cents) from the closest note to a pitch', () => {
      const equal = new Temperament(equalTemperament);

      expect(equal.getNoteNameFromPitch(440)[1]).toBeCloseTo(0);
      expect(equal.getNoteNameFromPitch(880)[1]).toBeCloseTo(0);
      expect(equal.getNoteNameFromPitch(261.626)[1]).toBeCloseTo(0);
      expect(equal.getNoteNameFromPitch(addCents(261.626, 1))[1]).toBeCloseTo(
        1
      );
      expect(equal.getNoteNameFromPitch(addCents(311.127, -4))[1]).toBeCloseTo(
        -4
      );
      expect(equal.getNoteNameFromPitch(addCents(1479.98, 20))[1]).toBeCloseTo(
        20
      );
      expect(equal.getNoteNameFromPitch(addCents(2637.02, -15))[1]).toBeCloseTo(
        -15
      );
      expect(equal.getNoteNameFromPitch(addCents(34.6478, 7))[1]).toBeCloseTo(
        7
      );
      expect(equal.getNoteNameFromPitch(addCents(29.1352, -8))[1]).toBeCloseTo(
        -8
      );
      expect(equal.getNoteNameFromPitch(addCents(493.883, 25))[1]).toBeCloseTo(
        25
      );
      expect(equal.getNoteNameFromPitch(addCents(523.251, -25))[1]).toBeCloseTo(
        -25
      );
    });
  });

  describe('get noteNames()', () => {
    test('returns an ordered array of equal temperament note names', () => {
      const equal = new Temperament(equalTemperament);
      expect(equal.noteNames).toEqual([
        'C',
        'C♯',
        'D',
        'E♭',
        'E',
        'F',
        'F♯',
        'G',
        'G♯',
        'A',
        'B♭',
        'B',
      ]);
    });

    test('returns an ordered array of quarter-comma meantone note names', () => {
      const qcm = new Temperament(quarterCommaMeantone);
      expect(qcm.noteNames).toEqual([
        'C',
        'C♯',
        'D',
        'E♭',
        'E',
        'F',
        'F♯',
        'G',
        'G♯',
        'A',
        'B♭',
        'B',
      ]);
    });
  });

  describe('get referenceName()', () => {
    test('returns the name of the reference note', () => {
      const equal = new Temperament(equalTemperament);

      expect(equal.referenceName).toBe('A');
    });
  });

  describe('get referenceOctave()', () => {
    test('returns the octave number of the reference note', () => {
      const equal = new Temperament(equalTemperament);

      expect(equal.referenceOctave).toBe(4);
    });
  });

  describe('get referencePitch()', () => {
    test('returns the pitch of the reference note', () => {
      const equal = new Temperament(equalTemperament);

      expect(equal.referencePitch).toBe(440);
    });
  });

  describe('set referencePitch()', () => {
    test('sets the pitch of the reference note', () => {
      const equal = new Temperament(equalTemperament);

      equal.referencePitch = 441;
      expect(equal.referencePitch).toBe(441);
    });
  });

  describe('getOctaveRange()', () => {
    test('returns a range of octaves around the reference octave', () => {
      const equal = new Temperament(equalTemperament);
      expect(equal.getOctaveRange(2)).toEqual([2, 3, 4, 5, 6]);
      expect(equal.getOctaveRange(0)).toEqual([4]);
    });
  });

  describe('getOffset()', () => {
    test('returns the correct offsets in equal temperament', () => {
      const equal = new Temperament(equalTemperament);

      expect(equal.getOffset('A', 4)).toBe(0);
      expect(equal.getOffset('A', 6)).toBe(2400);
      expect(equal.getOffset('C', 4)).toBe(-900);
      expect(equal.getOffset('C', 5)).toBe(300);
      expect(equal.getOffset('E♭', 4)).toBe(-600);
      expect(equal.getOffset('E♭', 3)).toBe(-1800);
      expect(equal.getOffset('G♯', 5)).toBe(1100);
      expect(equal.getOffset('B', 3)).toBe(-1000);
    });

    test('returns the correct offsets in quarter-comma meantone', () => {
      const qcm = new Temperament(quarterCommaMeantone);

      expect(qcm.getOffset('A', 4)).toBe(0);
      expect(qcm.getOffset('D', 4)).toBeCloseTo(-696.6);
      expect(qcm.getOffset('C', 4)).toBeCloseTo(-889.8);
      expect(qcm.getOffset('C', 5)).toBeCloseTo(310.2);
    });

    test('throws an error for non-existent notes', () => {
      const equal = new Temperament(equalTemperament);

      expect(() => equal.getOffset('Q♯', 4)).toThrow(
        "Note 'Q♯' is not defined"
      );
      expect(() => equal.getOffset('AZ', 5)).toThrow(
        "Note 'AZ' is not defined"
      );
    });
  });

  describe('getPitch()', () => {
    test('returns the correct note pitch in equal temperament', () => {
      // For equal temperament, you can find the pre-calculated frequency of
      // each note online, for example at
      // https://en.wikipedia.org/wiki/Piano_key_frequencies
      const equal = new Temperament(equalTemperament);

      expect(equal.getPitch('A', 4)).toBeCloseTo(440);
      expect(equal.getPitch('A', 5)).toBeCloseTo(880);
      expect(equal.getPitch('C', 5)).toBeCloseTo(523.251);
      expect(equal.getPitch('F♯', 4)).toBeCloseTo(369.994);
      expect(equal.getPitch('B', 7)).toBeCloseTo(3951.07);
      expect(equal.getPitch('B♭', 2)).toBeCloseTo(116.541);
      expect(equal.getPitch('C♯', 0)).toBeCloseTo(17.3239);
    });
  });
});
