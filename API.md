## Classes

<dl>
<dt><a href="#Temperament">Temperament</a></dt>
<dd><p>Contains a complete description of a musical temperament.</p>
<p>Most interaction with a <code>Temperament</code> should be through its public methods,
documented below.  However, &quot;metadata&quot; properties (such as the name of the
temperament) are available for direct access, since changing them has no
effect on the internal structure of the temperament.  These metadata
properties correspond directly to properties in the input data, and are
documented below.  Please note that a metadata property may be <code>undefined</code>
if it was not defined in the input data.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#OCTAVE_SIZE">OCTAVE_SIZE</a></dt>
<dd><p>The size of an octave in cents.</p>
</dd>
</dl>

<a name="Temperament"></a>

## Temperament
Contains a complete description of a musical temperament.

Most interaction with a `Temperament` should be through its public methods,
documented below.  However, "metadata" properties (such as the name of the
temperament) are available for direct access, since changing them has no
effect on the internal structure of the temperament.  These metadata
properties correspond directly to properties in the input data, and are
documented below.  Please note that a metadata property may be `undefined`
if it was not defined in the input data.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the temperament. |
| description | <code>string</code> | A short description of the temperament. |
| source | <code>string</code> | The source of the temperament data (e.g. a URL). |


* [Temperament](#Temperament)
    * [new exports.Temperament(data)](#new_Temperament_new)
    * _instance_
        * [.getNoteNameFromPitch(pitch)](#Temperament+getNoteNameFromPitch) ⇒ <code>Array</code>
        * [.getNoteNames()](#Temperament+getNoteNames) ⇒ <code>Array.&lt;string&gt;</code>
        * [.getOctaveBaseName()](#Temperament+getOctaveBaseName) ⇒ <code>string</code>
        * [.getOctaveRange(radius)](#Temperament+getOctaveRange) ⇒ <code>Array.&lt;number&gt;</code>
        * [.getOffset(note, octave)](#Temperament+getOffset) ⇒ <code>number</code>
        * [.getPitch(note, octave)](#Temperament+getPitch) ⇒ <code>number</code>
        * [.getReferenceName()](#Temperament+getReferenceName) ⇒ <code>string</code>
        * [.getReferenceOctave()](#Temperament+getReferenceOctave) ⇒ <code>number</code>
        * [.getReferencePitch()](#Temperament+getReferencePitch) ⇒ <code>number</code>
        * [.setReferencePitch(pitch)](#Temperament+setReferencePitch)
    * _static_
        * [.prettifyNoteName(name)](#Temperament.prettifyNoteName) ⇒ <code>string</code>

<a name="new_Temperament_new"></a>

### new exports.Temperament(data)
Create a new temperament.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The temperament data, in the format described by the README. |

<a name="Temperament+getNoteNameFromPitch"></a>

### temperament.getNoteNameFromPitch(pitch) ⇒ <code>Array</code>
Return the closest note to the given pitch (in Hz), along with the pitch
difference (in cents).

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
**Returns**: <code>Array</code> - A tuple containing the note name as its first element and
the offset (in cents) from that note as its second element.  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>number</code> | The pitch of the note to identify (in Hz). |

<a name="Temperament+getNoteNames"></a>

### temperament.getNoteNames() ⇒ <code>Array.&lt;string&gt;</code>
Return an array of the note names defined in the temperament.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
**Returns**: <code>Array.&lt;string&gt;</code> - The note names, sorted in increasing order of pitch
starting with the octave base.  
<a name="Temperament+getOctaveBaseName"></a>

### temperament.getOctaveBaseName() ⇒ <code>string</code>
Return the name of the octave base note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
**Returns**: <code>string</code> - The name of the octave base note.  
<a name="Temperament+getOctaveRange"></a>

### temperament.getOctaveRange(radius) ⇒ <code>Array.&lt;number&gt;</code>
Return an array with octave numbers in order, forming a range with the
given radius around the reference octave.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
**Returns**: <code>Array.&lt;number&gt;</code> - A range of octave numbers.  

| Param | Type | Description |
| --- | --- | --- |
| radius | <code>number</code> | The number of octaves on either end of the reference octave to include. |

<a name="Temperament+getOffset"></a>

### temperament.getOffset(note, octave) ⇒ <code>number</code>
Return the offset of the given note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
**Returns**: <code>number</code> - The offset (in cents), relative to the reference pitch.  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | The name of the note. |
| octave | <code>number</code> | The octave number of the note. |

<a name="Temperament+getPitch"></a>

### temperament.getPitch(note, octave) ⇒ <code>number</code>
Return the pitch of the given note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
**Returns**: <code>number</code> - The pitch (in Hz).  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | The name of the note. |
| octave | <code>number</code> | The octave number of the note. |

<a name="Temperament+getReferenceName"></a>

### temperament.getReferenceName() ⇒ <code>string</code>
Return the name of the reference note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getReferenceOctave"></a>

### temperament.getReferenceOctave() ⇒ <code>number</code>
Return the octave number of the reference note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getReferencePitch"></a>

### temperament.getReferencePitch() ⇒ <code>number</code>
Return the reference pitch.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
**Returns**: <code>number</code> - The reference pitch, in Hz.  
<a name="Temperament+setReferencePitch"></a>

### temperament.setReferencePitch(pitch)
Set the reference pitch.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>number</code> | The reference pitch (in Hz). |

<a name="Temperament.prettifyNoteName"></a>

### Temperament.prettifyNoteName(name) ⇒ <code>string</code>
Return the "pretty" version of the given note name.

"Pretty" means replacing elements enclosed in curly braces ({}) by
corresponding Unicode symbols, provided that the element is recognized.
For example, '{sharp}' will be replaced by '♯'.

Note that this function is supposed to be simple.  Curly braces do not
nest, and an unclosed or unrecognized element sequence will be kept
verbatim in the output, but without the curly braces.  Currently, there is
no way to escape a curly brace, but this may change later.

**Kind**: static method of [<code>Temperament</code>](#Temperament)  
**Returns**: <code>string</code> - The "pretty" note name, with special characters inserted.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The note name to prettify. |

<a name="OCTAVE_SIZE"></a>

## OCTAVE_SIZE
The size of an octave in cents.

**Kind**: global constant  
