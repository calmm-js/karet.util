# Changelog

## 0.3.0

* Removed `pipe`.  This is because the way it worked was simply not very useful.
  It was like Ramda's `pipe`, but with all the given functions lifted before
  composition.  The problem here is that this often results in lifting functions
  multiple times, which leads to wasted performance.

* Renamed `when` as `ift`, which is short for `if-then`.  This rename was made
  so that a lifted version Ramda's `when` can now be provided.

* Added a large number of functions lifted from Ramda and from the built-in
  `Math` module.  This allows one to write logic in direct-style even when using
  properties.

* Added a number of functions from Kefir as curried and unlifted versions.
  **_These are highly experimental at this point._** The idea is that you can
  then use those conveniently in pipelines, i.e. within a `seq`, and that they
  also work when the piped data is not a Kefir property.  This way components
  can be written that can work with both time-varying (properties) and constant
  data.
