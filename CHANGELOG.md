# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic
Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2020-03-10
### Added
- D-based Pythagorean temperament example

### Changed
- Updated dependencies to latest versions

## [1.0.0] - 2018-03-02
### Added
- API documentation in `API.md` (generated from JSDoc comments).

## [1.0.0-alpha.1] - 2018-02-27
### Added
- `source` property in temperament data.

### Changed
- Clarify which members of `Temperament` should be considered private using a
  leading underscore
- Provide accessors for relevant private members (e.g. `getReferenceName`).
- Make the `prettifyNoteName` function a static member of `Temperament`.
- Include temperament description as a member of `Temperament`.

## [1.0.0-alpha.0] - 2018-02-26
This is the initial release, extracted from the
[Temperatune](https://github.com/ianprime0509/temperatune) project.

### Added
- Support temperaments defined in JSON using a schema for validation.
- Implement note to pitch conversion using a temperament.
- Implement searching for the nearest note to a pitch in a temperament.
