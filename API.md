## Classes

<dl>
<dt><a href="#Temperament">Temperament</a></dt>
<dd><p>Contains a complete description of a musical temperament.</p>
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

**Kind**: global class  

* [Temperament](#Temperament)
    * [new exports.Temperament()](#new_Temperament_new)
    * _instance_
        * [.getNoteNameFromPitch()](#Temperament+getNoteNameFromPitch)
        * [.getNoteNames()](#Temperament+getNoteNames)
        * [.getOctaveBaseName()](#Temperament+getOctaveBaseName)
        * [.getOctaveRange()](#Temperament+getOctaveRange)
        * [.getOffset()](#Temperament+getOffset)
        * [.getPitch()](#Temperament+getPitch)
        * [.getReferenceName()](#Temperament+getReferenceName)
        * [.getReferenceOctave()](#Temperament+getReferenceOctave)
        * [.getReferencePitch()](#Temperament+getReferencePitch)
        * [.setReferencePitch()](#Temperament+setReferencePitch)
        * [._computeOffsets()](#Temperament+_computeOffsets)
        * [._defineOffset()](#Temperament+_defineOffset)
    * _static_
        * [.prettifyNoteName()](#Temperament.prettifyNoteName)

<a name="new_Temperament_new"></a>

### new exports.Temperament()
Construct a new Temperament from the given description.

<a name="Temperament+getNoteNameFromPitch"></a>

### temperament.getNoteNameFromPitch()
Return the closest note to the given pitch (in Hz), along with the pitch
difference (in cents).

The returned value will be an array with the note name as its first
element and the pitch difference as the second.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getNoteNames"></a>

### temperament.getNoteNames()
Return an array of the note names defined in the temperament.

The returned array will be sorted in increasing order of pitch, starting
with the octave base.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getOctaveBaseName"></a>

### temperament.getOctaveBaseName()
Return the name of the octave base note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getOctaveRange"></a>

### temperament.getOctaveRange()
Return an array with octave numbers in order, forming a range with the
given radius around the reference octave.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getOffset"></a>

### temperament.getOffset()
Return the offset of the given note (relative to the reference pitch).

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getPitch"></a>

### temperament.getPitch()
Return the pitch (in Hz) of the given note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getReferenceName"></a>

### temperament.getReferenceName()
Return the name of the reference note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getReferenceOctave"></a>

### temperament.getReferenceOctave()
Return the octave number of the reference note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+getReferencePitch"></a>

### temperament.getReferencePitch()
Return the reference pitch (in Hz).

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+setReferencePitch"></a>

### temperament.setReferencePitch()
Set the reference pitch (in Hz).

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+_computeOffsets"></a>

### temperament._computeOffsets()
Compute the offsets list using the given note definitions.

This is a convenience method to make the constructor shorter and more
readable.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
<a name="Temperament+_defineOffset"></a>

### temperament._defineOffset()
Attempt to define the offset of the given note.

**Kind**: instance method of [<code>Temperament</code>](#Temperament)  
**Throws**:

- Will throw an error if the given offset conflicts with an existing
one.

<a name="Temperament.prettifyNoteName"></a>

### Temperament.prettifyNoteName()
Return the "pretty" version of the given note name.

"Pretty" means replacing elements enclosed in curly braces ({}) by
corresponding Unicode symbols, provided that the element is recognized.
For example, '{sharp}' will be replaced by '♯'.

Note that this function is supposed to be simple.  Curly braces do not
nest, and an unclosed or unrecognized element sequence will be kept
verbatim in the output, but without the curly braces.  Currently, there is
no way to escape a curly brace, but this may change later.

**Kind**: static method of [<code>Temperament</code>](#Temperament)  
<a name="OCTAVE_SIZE"></a>

## OCTAVE_SIZE
The size of an octave in cents.

**Kind**: global constant  
