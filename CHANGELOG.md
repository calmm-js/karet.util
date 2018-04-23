# Changelog

## 0.18.3

Obsoleted `seq` and `seqPartial`.  The motivation here is to reduce the library
API surface.  `thru` can basically always replace `seq` and `seqPartial` is
fairly rarely needed.

## 0.18.1

Migrated the context implementation to use the React Context API and also marked
it obsolete.  Just use the React Context API.

## 0.18.0

Major reorganization of the library on the road towards v1.0.0.

Removed all lifted Ramda combinators from Karet Util.  Use the [Kefir
Ramda](https://github.com/calmm-js/kefir.ramda) library instead.

Removed

* the default export `K`,
* `U.lift`,
* `U.lift1`,
* `U.lift1Shallow`, and
* `U.staged`.

with the (experimental) idea that all lifting is done via `U.combines` and the
new `U.liftRec`.  The idea here is to make lifting easier especially for
newcomers and to avoid using default exports.

Removed `U.iftes` and renamed `U.cases` to `U.cond`:

```diff
-U.iftes(c1, t1,  ...,  e1)
+U.cond([c1, t1], ..., [e1]])
```

Also renamed `U.ifte` to `U.ifElse`:

```diff
-U.ifte(c, t, e)
+U.ifElse(c, t, e)
```

and `U.ift` to `U.when`:

```diff
-U.ift(c, t)
+U.when(c, t)
```

and added `U.unless`:

```diff
-U.ift(U.not(c), e)
+U.unless(c, e)
```

These renamings became possible due to the removal of lifted Ramda.  The
previous names were compromises to avoid name clashes with Ramda.

Removed broken `U.skipFirstErrors` (Kefir currently doesn't have such a method)
and `U.thruPartial` (the implementation was broken and it would require a much
more complex implementation).

Removed `U.bind`:

```diff
-<input {...U.bind({value}) />
+<input value={value} onChange={U.getProps({value})} />
```

and `U.bindProps`:

```diff
-<div {...U.bindProps({ref: 'onScroll', scrollTop}) />
+<div ref={U.setProps({scrollTop})}
+     onScroll={U.getProps({scrollTop})} />
```

and `U.classes`:

```diff
-<div {...U.classes(...)} />
+<div className={U.cns(...)} />
```

The reason behind these is to avoid "attribute templates" that make it harder to
see which attributes are being defined.

Removed `U.mapCached`, `U.mapIndexed`, and `U.indices`.  The (experimental) idea
is to try and do the same things using lenses with `U.mapElems` and
`U.mapElemsWithIds`, and also using e.g. lifted `R.map` and lifted
`L.collectAs`.

The Standard `Math`, `JSON`, and `String` functions are now lifted using
`U.liftRec`.  This means that the functions are no longer curried and behave
more like their unlifted versions.  For example, `U.stringify(json)` returns the
stringified result and `U.hypot` can be called with any number of arguments.
Also added `U.max` and `U.min` (previously they came from Ramda).

Removed the (rarely used) `U.WithContext` component.  Just use `U.withContext`.

## 0.11.3

This library now explicitly depends only on
the [stable subset](https://github.com/calmm-js/partial.lenses/#stable-subset)
of partial lenses.

## 0.11.2

Kefir was changed from a dependency to a peer dependency to avoid the
possibility of having multiple versions of Kefir in a project.

## 0.10.0

Most of the previously unsupported Ramda functions are now also provided.  The
lifting / staging of a number of Ramda functions has been adjusted.  In
particular, `U.is`, `U.where`, and `U.whereEq` now takes one and one arguments
and `U.ascend`, `U.descend`, `U.eqBy` and `U.eqProps` take one and two
arguments.  This was done to make their typical uses cases notationally more
convenient.

## 0.9.0

Updated dependencies with major versions.

## 0.7.0

* Changed semantics of `ift` and `ifte` again so that they return properties
  rather than streams.

* Now using `infestines` where possible.  Note that there is no intention at
  this point to drop the Ramda dependency from this library.

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
