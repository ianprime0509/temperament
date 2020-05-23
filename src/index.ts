/*
 * Copyright 2018-2020 Ian Johnson
 *
 * This is free software, distributed under the MIT license.  A copy of the
 * license can be found in the LICENSE file in the project root, or at
 * https://opensource.org/licenses/MIT.
 */

import Ajv from "ajv";

import { Temperament as TemperamentData } from "./schema";

import schema from "./schema.json";

const ajv = new Ajv();
const validate = ajv.compile(schema);

/** The size of an octave in cents. */
export const OCTAVE_SIZE = 1200;

/**
 * Attempts to define the offset of the given note in the given offset map.
 *
 * @param offsets - the offset map in which to define the note
 * @param note - the name of the note to define
 * @param offset - the offset (in cents) of the note from the
 * reference pitch
 * @throws {@link Error} if the given offset conflicts with an existing one
 */
function defineOffset(
  offsets: Map<string, number>,
  note: string,
  offset: number
): void {
  if (offsets.has(note) && offsets.get(note) !== offset) {
    throw new Error(`Conflicting definition for '${note}' found`);
  }
  offsets.set(note, offset);
}

/**
 * Computes the offsets map using the given note definitions.
 *
 * This is a convenience method to make the {@link Temperament} constructor
 * shorter and more readable.
 *
 * @param temperament - the temperament data
 */
function computeOffsets(temperament: TemperamentData): Map<string, number> {
  const notes = temperament.notes;
  const offsets = new Map([[temperament.referenceName, 0]]);
  // A queue of note names and corresponding offsets that still need to be
  // processed (considered for use in a derivation)
  const todo: [string, number][] = [[temperament.referenceName, 0]];

  while (todo.length !== 0) {
    const [currentName, currentOffset] = todo[0];

    // The first possibility is that the current 'todo' note is on the
    // left-hand side of a definition, so that the note on the right-hand
    // side can be deduced.
    //
    // Symbolically, this matches a property like
    //
    // currentName: [name, offset]
    //
    // in the notes object.
    if (Object.prototype.hasOwnProperty.call(notes, currentName)) {
      const [name, offset] = notes[currentName];
      // We can now use the note on the right-hand side for deduction,
      // provided it hasn't already been used (which would result in an
      // infinite loop)
      const computedOffset = currentOffset - offset;
      if (name !== currentName && !offsets.has(name)) {
        todo.push([name, computedOffset]);
      }
      defineOffset(offsets, name, computedOffset);
    }

    // The second possibility is that the current 'todo' note is on the
    // right-hand side of a definition, so that the note on the left-hand
    // side can be deduced.
    //
    // Symbolically:
    //
    // name: [currentName, offset]
    Object.keys(notes)
      .filter((name) => notes[name][0] === currentName)
      .forEach((name) => {
        const offset = notes[name][1];

        const computedOffset = currentOffset + offset;
        if (name !== currentName && !offsets.has(name)) {
          todo.push([name, computedOffset]);
        }
        defineOffset(offsets, name, computedOffset);
      });

    todo.shift();
  }

  // Make sure we have offset data for all notes.
  Object.keys(notes).forEach((name) => {
    if (!offsets.has(name)) {
      throw new Error(`Not able to determine the pitch of '${name}'`);
    }
  });

  // Adjust the offsets around the octave base. To start, we need to adjust the
  // octave base note itself; it should be at or below the offset of the
  // reference note, and within one octave of it.
  const originalOctaveBaseOffset = offsets.get(temperament.octaveBaseName);
  if (originalOctaveBaseOffset === undefined) {
    throw new Error("Octave base not defined as a note");
  }
  const octaveBaseOffset =
    originalOctaveBaseOffset > 0
      ? (originalOctaveBaseOffset % OCTAVE_SIZE) - OCTAVE_SIZE
      : originalOctaveBaseOffset % OCTAVE_SIZE;
  offsets.set(temperament.octaveBaseName, octaveBaseOffset);
  // Now, we ensure that the rest of the offsets are within one octave of the
  // base and are positioned above it
  offsets.forEach((offset, name) => {
    let relative = offset - octaveBaseOffset;
    relative %= OCTAVE_SIZE;
    if (relative < 0) {
      relative += OCTAVE_SIZE;
    }
    offsets.set(name, octaveBaseOffset + relative);
  });

  return offsets;
}

/**
 * Contains a complete description of a musical temperament.
 *
 * Most interaction with a `Temperament` should be through its public methods,
 * documented below.  However, "metadata" properties (such as the name of the
 * temperament) are available for direct access, since changing them has no
 * effect on the internal structure of the temperament.  These metadata
 * properties correspond directly to properties in the input data, and are
 * documented below.  Please note that a metadata property may be `undefined`
 * if it was not defined in the input data.
 */
export class Temperament {
  /** The name of the temperament. */
  readonly name: string;
  /** A short description of the temperament. */
  readonly description?: string;
  /** The source of the temperament data (e.g. a URL). */
  readonly source?: string;

  private readonly _octaveBaseName: string;
  private readonly _referenceName: string;
  private readonly _referenceOctave: number;
  private _referencePitch: number;
  private readonly _noteNames: string[];
  private readonly _offsets: Map<string, number>;

  /**
   * Creates a new temperament.
   *
   * @param data - the temperament data, in the format described by the README
   */
  constructor(data: TemperamentData) {
    if (!validate(data)) {
      throw new TypeError(
        `Incorrect temperament format: ${ajv.errorsText(validate.errors)}`
      );
    }

    // "Metadata" fields
    this.name = data.name;
    this.description = data.description;
    this.source = data.source;

    this._octaveBaseName = data.octaveBaseName;
    this._referenceName = data.referenceName;
    this._referenceOctave = data.referenceOctave;
    this._referencePitch = data.referencePitch;
    this._offsets = computeOffsets(data);
    // The _noteNames member should always be sorted in increasing order of
    // offset from the octave base
    this._noteNames = [...this._offsets.entries()]
      .sort((a, b) => a[1] - b[1])
      .map((entry) => entry[0]);
  }

  /**
   * Returns an array of the note names defined in the temperament.
   *
   * @returns the note names, sorted in increasing order of pitch starting with
   * the octave base
   */
  get noteNames(): string[] {
    // We need to make a copy of the array so that the internal one doesn't get
    // changed by the caller
    return [...this._noteNames];
  }

  /**
   * Returns the name of the octave base note.
   *
   * @returns the name of the octave base note
   */
  get octaveBaseName(): string {
    return this._octaveBaseName;
  }

  /**
   * Returns the name of the reference note.
   *
   * @returns the name of the reference note
   */
  get referenceName(): string {
    return this._referenceName;
  }

  /**
   * Returns the octave number of the reference note.
   *
   * @returns the octave number of the reference note
   */
  get referenceOctave(): number {
    return this._referenceOctave;
  }

  /**
   * Returns the reference pitch.
   *
   * @returns the reference pitch, in Hz
   */
  get referencePitch(): number {
    return this._referencePitch;
  }

  /**
   * Sets the reference pitch.
   *
   * @param pitch - the reference pitch (in Hz)
   * @throws {@link Error} if `pitch` is not positive
   */
  set referencePitch(pitch: number) {
    if (pitch <= 0) throw new Error("Pitch must be positive");

    this._referencePitch = pitch;
  }

  /**
   * Returns the closest note to the given pitch (in Hz), along with the pitch
   * difference (in cents).
   *
   * @param pitch - the pitch of the note to identify (in Hz)
   * @returns a tuple containing the note name as its first element and the
   * offset (in cents) from that note as its second element
   * @throws {@link Error} if `pitch` is not positive
   */
  getNoteNameFromPitch(pitch: number): [string, number] {
    if (pitch <= 0) throw new Error("Pitch must be positive");

    // We need to get the offset in cents from the reference pitch so we can
    // compare it. The offset needs to be normalized so that it's within an
    // octave of the octave base note.
    const baseOffset = this.getOffset(
      this._octaveBaseName,
      this._referenceOctave
    );
    let offset = Math.log2(pitch / this._referencePitch) * OCTAVE_SIZE;
    offset = ((offset - baseOffset) % OCTAVE_SIZE) + baseOffset;
    if (offset < baseOffset) {
      offset += OCTAVE_SIZE;
    }

    // Now we need to figure out the closest note using a (slightly modified)
    // binary search
    let start = 0;
    let end = this._noteNames.length;
    while (end - start > 1) {
      const mid = Math.trunc((end + start) / 2);
      const midOffset = this.getOffset(
        this._noteNames[mid],
        this._referenceOctave
      );
      if (offset > midOffset) {
        start = mid;
      } else if (offset < midOffset) {
        end = mid;
      } else {
        return [this._noteNames[mid], 0];
      }
    }

    const startNote = this._noteNames[start];
    const startDifference =
      offset - this.getOffset(startNote, this._referenceOctave);
    let endNote, endDifference;
    if (end === this._noteNames.length) {
      // It's possible that end === this._noteNames.length, indicating that we
      // need to check an octave above the base note
      endNote = this._noteNames[0];
      endDifference =
        offset - this.getOffset(endNote, this._referenceOctave) - OCTAVE_SIZE;
    } else {
      endNote = this._noteNames[end];
      endDifference = offset - this.getOffset(endNote, this._referenceOctave);
    }
    if (Math.abs(startDifference) < Math.abs(endDifference)) {
      return [startNote, startDifference];
    } else {
      return [endNote, endDifference];
    }
  }

  /**
   * Return an array with octave numbers in order, forming a range with the
   * given radius around the reference octave.
   *
   * @param radius - the number of octaves on either end of the reference octave
   * to include. Must be non-negative.
   * @returns a range of octave numbers
   * @throws {@link Error} if `radius` is negative
   */
  getOctaveRange(radius: number): number[] {
    if (radius < 0) throw new Error("Radius must not be negative");

    const start = this._referenceOctave - radius;
    const end = this._referenceOctave + radius;
    const octaves = [];

    for (let i = start; i <= end; i++) {
      octaves.push(i);
    }

    return octaves;
  }

  /**
   * Returns the offset of the given note.
   *
   * @param note - the name of the note
   * @param octave - the octave number of the note
   * @returns the offset (in cents), relative to the reference pitch
   * @throws {@link Error} if `note` is not defined
   */
  getOffset(note: string, octave: number): number {
    const offset = this._offsets.get(note);
    if (offset === undefined) {
      throw new Error(`Note '${note}' is not defined`);
    }
    return offset + (octave - this._referenceOctave) * OCTAVE_SIZE;
  }

  /**
   * Returns the pitch of the given note.
   *
   * @param note - the name of the note
   * @param octave - the octave number of the note
   * @returns the pitch (in Hz)
   * @throws {@link Error} if `note` is not defined
   */
  getPitch(note: string, octave: number): number {
    return (
      this._referencePitch * 2 ** (this.getOffset(note, octave) / OCTAVE_SIZE)
    );
  }
}
