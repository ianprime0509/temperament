<a name="module_temperament"></a>

## temperament

* [temperament](#module_temperament)
    * [.Temperament](#module_temperament.Temperament)
        * [new exports.Temperament(data)](#new_module_temperament.Temperament_new)
        * _instance_
            * [.getNoteNameFromPitch(pitch)](#module_temperament.Temperament+getNoteNameFromPitch) ⇒ <code>Array</code>
            * [.getNoteNames()](#module_temperament.Temperament+getNoteNames) ⇒ <code>Array.&lt;string&gt;</code>
            * [.getOctaveBaseName()](#module_temperament.Temperament+getOctaveBaseName) ⇒ <code>string</code>
            * [.getOctaveRange(radius)](#module_temperament.Temperament+getOctaveRange) ⇒ <code>Array.&lt;number&gt;</code>
            * [.getOffset(note, octave)](#module_temperament.Temperament+getOffset) ⇒ <code>number</code>
            * [.getPitch(note, octave)](#module_temperament.Temperament+getPitch) ⇒ <code>number</code>
            * [.getReferenceName()](#module_temperament.Temperament+getReferenceName) ⇒ <code>string</code>
            * [.getReferenceOctave()](#module_temperament.Temperament+getReferenceOctave) ⇒ <code>number</code>
            * [.getReferencePitch()](#module_temperament.Temperament+getReferencePitch) ⇒ <code>number</code>
            * [.setReferencePitch(pitch)](#module_temperament.Temperament+setReferencePitch)
        * _static_
            * [.prettifyNoteName(name)](#module_temperament.Temperament.prettifyNoteName) ⇒ <code>string</code>
    * [.OCTAVE_SIZE](#module_temperament.OCTAVE_SIZE)

<a name="module_temperament.Temperament"></a>

### temperament.Temperament
Contains a complete description of a musical temperament.

Most interaction with a `Temperament` should be through its public methods,
documented below.  However, "metadata" properties (such as the name of the
temperament) are available for direct access, since changing them has no
effect on the internal structure of the temperament.  These metadata
properties correspond directly to properties in the input data, and are
documented below.  Please note that a metadata property may be `undefined`
if it was not defined in the input data.

**Kind**: static class of [<code>temperament</code>](#module_temperament)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the temperament. |
| description | <code>string</code> | A short description of the temperament. |
| source | <code>string</code> | The source of the temperament data (e.g. a URL). |


* [.Temperament](#module_temperament.Temperament)
    * [new exports.Temperament(data)](#new_module_temperament.Temperament_new)
    * _instance_
        * [.getNoteNameFromPitch(pitch)](#module_temperament.Temperament+getNoteNameFromPitch) ⇒ <code>Array</code>
        * [.getNoteNames()](#module_temperament.Temperament+getNoteNames) ⇒ <code>Array.&lt;string&gt;</code>
        * [.getOctaveBaseName()](#module_temperament.Temperament+getOctaveBaseName) ⇒ <code>string</code>
        * [.getOctaveRange(radius)](#module_temperament.Temperament+getOctaveRange) ⇒ <code>Array.&lt;number&gt;</code>
        * [.getOffset(note, octave)](#module_temperament.Temperament+getOffset) ⇒ <code>number</code>
        * [.getPitch(note, octave)](#module_temperament.Temperament+getPitch) ⇒ <code>number</code>
        * [.getReferenceName()](#module_temperament.Temperament+getReferenceName) ⇒ <code>string</code>
        * [.getReferenceOctave()](#module_temperament.Temperament+getReferenceOctave) ⇒ <code>number</code>
        * [.getReferencePitch()](#module_temperament.Temperament+getReferencePitch) ⇒ <code>number</code>
        * [.setReferencePitch(pitch)](#module_temperament.Temperament+setReferencePitch)
    * _static_
        * [.prettifyNoteName(name)](#module_temperament.Temperament.prettifyNoteName) ⇒ <code>string</code>

<a name="new_module_temperament.Temperament_new"></a>

#### new exports.Temperament(data)
Create a new temperament.

**Throws**:

- <code>TypeError</code> The input data must conform to the temperament schema.
- <code>Error</code> The given note data must be complete and unambiguous.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The temperament data, in the format described by the README. |

<a name="module_temperament.Temperament+getNoteNameFromPitch"></a>

#### temperament.getNoteNameFromPitch(pitch) ⇒ <code>Array</code>
Return the closest note to the given pitch (in Hz), along with the pitch
difference (in cents).

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  
**Returns**: <code>Array</code> - A tuple containing the note name as its first element and
the offset (in cents) from that note as its second element.  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>number</code> | The pitch of the note to identify (in Hz). |

<a name="module_temperament.Temperament+getNoteNames"></a>

#### temperament.getNoteNames() ⇒ <code>Array.&lt;string&gt;</code>
Return an array of the note names defined in the temperament.

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  
**Returns**: <code>Array.&lt;string&gt;</code> - The note names, sorted in increasing order of pitch
starting with the octave base.  
<a name="module_temperament.Temperament+getOctaveBaseName"></a>

#### temperament.getOctaveBaseName() ⇒ <code>string</code>
Return the name of the octave base note.

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  
**Returns**: <code>string</code> - The name of the octave base note.  
<a name="module_temperament.Temperament+getOctaveRange"></a>

#### temperament.getOctaveRange(radius) ⇒ <code>Array.&lt;number&gt;</code>
Return an array with octave numbers in order, forming a range with the
given radius around the reference octave.

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  
**Returns**: <code>Array.&lt;number&gt;</code> - A range of octave numbers.  

| Param | Type | Description |
| --- | --- | --- |
| radius | <code>number</code> | The number of octaves on either end of the reference octave to include. |

<a name="module_temperament.Temperament+getOffset"></a>

#### temperament.getOffset(note, octave) ⇒ <code>number</code>
Return the offset of the given note.

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  
**Returns**: <code>number</code> - The offset (in cents), relative to the reference pitch.  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | The name of the note. |
| octave | <code>number</code> | The octave number of the note. |

<a name="module_temperament.Temperament+getPitch"></a>

#### temperament.getPitch(note, octave) ⇒ <code>number</code>
Return the pitch of the given note.

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  
**Returns**: <code>number</code> - The pitch (in Hz).  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | The name of the note. |
| octave | <code>number</code> | The octave number of the note. |

<a name="module_temperament.Temperament+getReferenceName"></a>

#### temperament.getReferenceName() ⇒ <code>string</code>
Return the name of the reference note.

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  
<a name="module_temperament.Temperament+getReferenceOctave"></a>

#### temperament.getReferenceOctave() ⇒ <code>number</code>
Return the octave number of the reference note.

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  
<a name="module_temperament.Temperament+getReferencePitch"></a>

#### temperament.getReferencePitch() ⇒ <code>number</code>
Return the reference pitch.

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  
**Returns**: <code>number</code> - The reference pitch, in Hz.  
<a name="module_temperament.Temperament+setReferencePitch"></a>

#### temperament.setReferencePitch(pitch)
Set the reference pitch.

**Kind**: instance method of [<code>Temperament</code>](#module_temperament.Temperament)  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>number</code> | The reference pitch (in Hz). |

<a name="module_temperament.Temperament.prettifyNoteName"></a>

#### Temperament.prettifyNoteName(name) ⇒ <code>string</code>
Return the "pretty" version of the given note name.

"Pretty" means replacing elements enclosed in curly braces ({}) by
corresponding Unicode symbols, provided that the element is recognized.
For example, '{sharp}' will be replaced by '♯'.

Note that this function is supposed to be simple.  Curly braces do not
nest, and an unclosed or unrecognized element sequence will be kept
verbatim in the output, but without the curly braces.  Currently, there is
no way to escape a curly brace, but this may change later.

**Kind**: static method of [<code>Temperament</code>](#module_temperament.Temperament)  
**Returns**: <code>string</code> - The "pretty" note name, with special characters inserted.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The note name to prettify. |

<a name="module_temperament.OCTAVE_SIZE"></a>

### temperament.OCTAVE\_SIZE
The size of an octave in cents.

**Kind**: static constant of [<code>temperament</code>](#module_temperament)  
