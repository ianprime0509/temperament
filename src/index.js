/*
 * Copyright 2018 Ian Johnson
 *
 * This is free software, distributed under the MIT license.  A copy of the
 * license can be found in the LICENSE file in the project root, or at
 * https://opensource.org/licenses/MIT.
 */
/**
 * @file Internal temperament definition and logic.
 */
import Ajv from 'ajv';

import schema from './schema.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

/** The size of an octave in cents. */
export const OCTAVE_SIZE = 1200;

/**
 * Contains a complete description of a musical temperament.
 *
 * Users should not modify any of a Temperament's members directly, as this may
 * cause it to behave unpredictably.
 */
export class Temperament {
  /** Construct a new Temperament from the given description. */
  constructor(data) {
    if (!validate(data)) {
      throw new TypeError(
        `incorrect temperament format: ${ajv.errorsText(validate.errors)}`
      );
    }
    this.name = data.name;

    this._octaveBaseName = data.octaveBaseName;
    this._referencePitch = data.referencePitch;
    this._referenceName = data.referenceName;
    this._referenceOctave = data.referenceOctave;
    this._computeOffsets(data.notes);
    // The _noteNames member should always be sorted in increasing order of
    // offset from the octave base.
    this._noteNames = Array.from(this._offsets.keys());
    this._noteNames.sort((a, b) => this._offsets.get(a) - this._offsets.get(b));
  }

  /**
   * Return the closest note to the given pitch (in Hz), along with the pitch
   * difference (in cents).
   *
   * The returned value will be an array with the note name as its first
   * element and the pitch difference as the second.
   */
  getNoteNameFromPitch(pitch) {
    // We need to get the offset in cents from the reference pitch so we can
    // compare it.  The offset needs to be normalized so that it's within an
    // octave of the octave base note.
    const baseOffset = this._offsets.get(this._octaveBaseName);
    let offset = Math.log2(pitch / this._referencePitch) * OCTAVE_SIZE;
    offset = (offset - baseOffset) % OCTAVE_SIZE + baseOffset;
    if (offset < baseOffset) {
      offset += OCTAVE_SIZE;
    }

    // Now we need to figure out the closest note using a (slightly modified)
    // binary search.
    let start = 0;
    let end = this._noteNames.length;
    while (end - start > 1) {
      let mid = Math.trunc((end + start) / 2);
      let midOffset = this._offsets.get(this._noteNames[mid]);
      if (offset > midOffset) {
        start = mid;
      } else if (offset < midOffset) {
        end = mid;
      } else {
        return [this._noteNames[mid], 0];
      }
    }

    let startNote = this._noteNames[start];
    let startDifference = offset - this._offsets.get(startNote);
    let endNote, endDifference;
    if (end === this._noteNames.length) {
      // It's possible that end === this._noteNames.length, indicating that we
      // need to check an octave above the base note.
      endNote = this._noteNames[0];
      endDifference = offset - this._offsets.get(endNote) - OCTAVE_SIZE;
    } else {
      endNote = this._noteNames[end];
      endDifference = offset - this._offsets.get(endNote);
    }
    if (Math.abs(startDifference) < Math.abs(endDifference)) {
      return [startNote, startDifference];
    } else {
      return [endNote, endDifference];
    }
  }

  /**
   * Return an array of the note names defined in the temperament.
   *
   * The returned array will be sorted in increasing order of pitch, starting
   * with the octave base.
   */
  getNoteNames() {
    // We need to make a copy of the array so that the internal one doesn't get
    // changed by the caller.
    return [...this._noteNames];
  }

  /**
   * Return an array with octave numbers in order, forming a range with the
   * given radius around the reference octave.
   */
  getOctaveRange(radius) {
    const start = this._referenceOctave - radius;
    const end = this._referenceOctave + radius;
    let octaves = [];

    for (let i = start; i <= end; i++) {
      octaves.push(i);
    }

    return octaves;
  }

  /** Return the offset of the given note (relative to the reference pitch). */
  getOffset(note, octave) {
    const offset = this._offsets.get(note);
    return offset !== undefined
      ? offset + (octave - this._referenceOctave) * OCTAVE_SIZE
      : undefined;
  }

  /** Return the pitch (in Hz) of the given note. */
  getPitch(note, octave) {
    return (
      this._referencePitch * 2 ** (this.getOffset(note, octave) / OCTAVE_SIZE)
    );
  }

  /**
   * Compute the offsets list using the given note definitions.
   *
   * This is a convenience method to make the constructor shorter and more
   * readable.
   */
  _computeOffsets(notes) {
    this._offsets = new Map([[this._referenceName, 0]]);
    // A queue of note names that still need to be processed.
    let todo = [this._referenceName];

    while (todo.length !== 0) {
      let currentName = todo[0];
      let currentOffset = this._offsets.get(currentName);

      // The first possibility is that the current 'todo' note is on the
      // left-hand side of a definition, so that the note on the right-hand
      // side can be deduced.
      //
      // Symbolically, this matches a property like
      //
      // currentName: [name, offset]
      //
      // in the notes object.
      if (notes.hasOwnProperty(currentName)) {
        let [name, offset] = notes[currentName];
        // We can now use the note on the right-hand side for deduction,
        // provided it hasn't already been used (which would result in an
        // infinite loop).
        if (name !== currentName && !this._offsets.has(name)) {
          todo.push(name);
        }
        this._defineOffset(name, currentOffset - offset);
      }

      // The second possibility is that the current 'todo' note is on the
      // right-hand side of a definition, so that the note on the left-hand
      // side can be deduced.
      //
      // Symbolically:
      //
      // name: [currentName, offset]
      Object.keys(notes)
        .filter(name => notes[name][0] === currentName)
        .forEach(name => {
          let offset = notes[name][1];

          if (name !== currentName && !this._offsets.has(name)) {
            todo.push(name);
          }
          this._defineOffset(name, currentOffset + offset);
        });

      todo.shift();
    }

    // Make sure we have offset data for all notes.
    Object.keys(notes).forEach(name => {
      if (!this._offsets.has(name)) {
        throw new Error(`not able to determine the pitch of '${name}'`);
      }
    });

    // Adjust the offsets around the octave base.  To start, we need to
    // adjust the octave base note itself; it should be at or below the offset
    // of the reference note, and within one octave of it.
    if (!this._offsets.has(this._octaveBaseName)) {
      throw new Error('octave base not defined as a note');
    }
    let octaveBaseOffset =
      this._offsets.get(this._octaveBaseName) % OCTAVE_SIZE;
    if (octaveBaseOffset > 0) {
      octaveBaseOffset -= OCTAVE_SIZE;
    }
    this._offsets.set(this._octaveBaseName, octaveBaseOffset);
    // Now, we ensure that the rest of the offsets are within one octave of the
    // base, and are positioned above it.
    this._offsets.forEach((offset, name) => {
      let relative = offset - octaveBaseOffset;
      relative %= OCTAVE_SIZE;
      if (relative < 0) {
        relative += OCTAVE_SIZE;
      }
      this._offsets.set(name, octaveBaseOffset + relative);
    });
  }

  /**
   * Attempt to define the offset of the given note.
   *
   * @throws Will throw an error if the given offset conflicts with an existing
   * one.
   */
  _defineOffset(note, offset) {
    if (this._offsets.has(note) && this._offsets.get(note) !== offset) {
      throw new Error(`conflicting definition for '${note}' found`);
    }
    this._offsets.set(note, offset);
  }
}

/**
 * Return the "pretty" version of the given note name.
 *
 * "Pretty" means replacing elements enclosed in curly braces ({}) by
 * corresponding Unicode symbols, provided that the element is recognized.  For
 * example, '{sharp}' will be replaced by '♯'.
 *
 * Note that this function is supposed to be simple.  Curly braces do not nest,
 * and an unclosed or unrecognized element sequence will be kept verbatim in
 * the output, but without the curly braces.  Currently, there is no way to
 * escape a curly brace, but this may change later.
 */
export function prettifyNoteName(name) {
  const replacements = new Map([['sharp', '♯'], ['flat', '♭']]);

  let pretty = '';
  let element = '';
  let inElement = false;

  for (let c of name) {
    if (inElement) {
      if (c === '}') {
        pretty += replacements.has(element)
          ? replacements.get(element)
          : element;
        inElement = false;
        element = '';
      } else {
        element += c;
      }
    } else {
      if (c === '{') {
        inElement = true;
      } else {
        pretty += c;
      }
    }
  }

  pretty += element;

  return pretty;
}
