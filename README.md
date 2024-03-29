# temperament

[![npm](https://img.shields.io/npm/v/temperament.svg)](https://www.npmjs.com/package/temperament)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ianprime0509/temperament/ci.yml?branch=main)

This is a library for working with
[musical temperaments](https://en.wikipedia.org/wiki/Musical_temperament) in
JavaScript. It was originally extracted from (and is used in)
[Temperatune](https://github.com/ianprime0509/temperatune), one of my other
projects. I figured it could be useful on its own to other developers, so I made
it into its own module.

## Installation

You can install the library using NPM or similar tools (such as Yarn) which use
the NPM package registry:

```shell
$ npm install temperament
```

You can also use a CDN, such as [esm.sh](https://esm.sh), directly from a
browser or Deno:

```js
import { Temperament } from "https://esm.sh/temperament@4";
```

This package is
[ESM-only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
which means it cannot be used with `require`.

## Usage

The `Temperament` class encapsulates information about a temperament, providing
several methods for working with processed temperament data. The constructor
accepts a single argument, an object in the format described in the
[temperament format section](#temperament-format):

```js
import { Temperament } from "temperament";

let equalTemperament = new Temperament(equalTemperamentData);
equalTemperament.referencePitch = 441;
console.log(equalTemperament.getPitch("A", 4)); // Prints `441`.
```

In the above example, `equalTemperamentData` could be the object corresponding
to the sample given in the [basic usage section](#basic-usage).

## Temperament format

The format of a temperament is specified by the
[JSON schema](http://json-schema.org/) exported as `schema` in `index.js`. The
schema is also published as a JSON file with each release, and can be found with
the latest release on
[GitHub](https://github.com/ianprime0509/temperament/releases). Each item in the
schema is annotated with a `description` key that explains its purpose.

Some samples are included under `temperaments`.

### Basic usage

Here is an example of a temperament file describing equal temperament:

```json
{
  "name": "Equal temperament",
  "referenceName": "A",
  "referencePitch": 440,
  "referenceOctave": 4,
  "octaveBaseName": "C",
  "notes": {
    "C": ["C", 0],
    "C♯": ["C", 100],
    "D": ["C♯", 100],
    "E♭": ["D", 100],
    "E": ["E♭", 100],
    "F": ["E", 100],
    "F♯": ["F", 100],
    "G": ["F♯", 100],
    "G♯": ["G", 100],
    "A": ["G♯", 100],
    "B♭": ["A", 100],
    "B": ["B♭", 100]
  }
}
```

All the keys used in the above example are required. The first key (and the one
whose purpose is most obvious) is the `name`: each temperament must have a name
which identifies it for use in other applications.

The next three keys describe the reference note. The reference note is commonly
the one used as a tuning pitch in an ensemble: in Western music, it is typically
A-4. The `referenceName` key gives the name of the reference note, which must
correspond to a key in the `notes` object, and the `referenceOctave` key
specifies the octave number of the reference note. Finally, the `referencePitch`
is the default value (in Hz) of the reference note's pitch. The reference pitch
may be configurable in user-facing applications, but you should provide a
reasonable default that corresponds to common usage. For example, the reference
pitch is specified above as 440 since most modern players tune to a reference of
440 Hz.

The `octaveBaseName` is the name of the note that should be at the bottom of
each octave, and is used for octave numbering. The value of `octaveBaseName`
must correspond to a key in the `notes` object. In the example above, the
`octaveBaseName` is C, so the highest C below the reference pitch will be
labelled as C-4 and the lowest C above the reference pitch will be labelled as
C-5.

Finally, the bulk of the temperament is described in the `notes` object. The
keys in this object are note names, and the corresponding values define the each
note in terms of an offset (in
[cents](<https://en.wikipedia.org/wiki/Cent_(music)>)) from some other note. For
example, the entry `"F": ["E", 100]` above means that the note labelled F is 100
cents above the note labelled E. To avoid giving redundant information, the
entry `"C": ["C", 0]` ensures that note labelled C is defined, but does not
provide any information about its pitch since that information can be derived
from the other notes. In general, your temperament definition should have
exactly one note that is not defined relative to another note.

Conceptually, you can imagine the note information being used to deduce the
pitch of each note by starting at the reference pitch (which is already known)
and working outwards. For example, if we have the pitch of the reference note A,
then we can immediately deduce the pitches of B♭ (100 cents above) and G♯ (100
cents below). We can then continue this process to deduce the pitches of B and
G, and so on.

A note on octaves: an octave is defined to be 1200 cents, or a pitch ratio of
2:1. The notes that you specify in the `notes` object are assumed to fill a
_single octave_, meaning that the definition `"C♯": ["C", 1300]` is equivalent
to the one given in the example above for C♯, since 1300 - 1200 is 100.

### Metadata

In addition to the required `name` key, there are several other keys which can
be used to add metadata to a temperament. Currently, the supported keys are as
follows:

- `description`: a longer description of a temperament. It is recommended to
  restrict this to a single sentence, with a period at the end.
- `source`: a description of the source from which the temperament data was
  obtained. For example, this could be a URL pointing to the Wikipedia page of
  your temperament or another page that describes it.

## License

This is free software, released under the
[Zero Clause BSD License](https://spdx.org/licenses/0BSD.html), as found in the
`LICENSE` file of this repository. This license places no restrictions on your
use, modification, or redistribution of the library: providing attribution is
appreciated, but not required.
