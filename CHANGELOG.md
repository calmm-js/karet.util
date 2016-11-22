# Changelog

## 0.6.0

The semantics of `ift` and `ifte` have been changed.  Previously they were a
kind of `lift`ed conditionals:

```js
const invoke = thunk => typeof thunk === "function" ? thunk() : thunk

export const ifte = lift((b, t, e) => invoke(b ? t : e))
export const ift = lift((b, fn) => b ? invoke(fn) : null)
```

The `invoke` mechanism was introduced to allow one to have VDOM in the `t` and
`e` clauses, because, without it, `lift` would eliminate observables from the
VDOM template.  However, this makes the signatures of `ifte` and `ift` a bit
complex and I managed to get tripped by the lifting behavior more than once
(forgetting to wrap VDOM with `() => ...`).  The return value `null` of `ift` is
also a bit surprising.

The new versions use `flatMapLatest` instead of `lift`:

```js
export const ifte = R.curry((b, t, e) => flatMapLatest(b => b ? t : e, b))
export const ift = R.curry((b, t) => flatMapLatest(b => b ? t : undefined, b))
```

This means that none of the parameters `b`, `t` and `e` is implicitly lifted as
a template and it is safe to have VDOM as a `t` or `e`.  There is also no
`invoke` and the result of `ift(false, _)` is now `undefined`, which is arguably
less surprising.  One special consideration with the use of `flatMapLatest` is
that the `t` and `e` clauses get subscribed and unsubscribed to based on the
value of `b`.  This can be either useful or surprising, because subscribing to
an observable may or may not cause side-effects.

Note that `ift` and `ifte` now work in a kind of lazy manner similar to what
core language conditionals do.  This is also different from what combinators
like `and` and `or` do that are just lifted versions of Ramda's functions.

The new semantics of `ift` and `ifte` seem to better match the use cases where
I've used them, resulting in small simplifications of application code.

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
