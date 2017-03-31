# <a id="karet-util"></a> Karet Util &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/karet.util.svg?style=social)](https://github.com/calmm-js/karet.util)

A collection of experimental utilities for working with
[Karet](https://github.com/calmm-js/karet).

[![npm version](https://badge.fury.io/js/karet.util.svg)](http://badge.fury.io/js/karet.util)
[![Build Status](https://travis-ci.org/calmm-js/karet.util.svg?branch=master)](https://travis-ci.org/calmm-js/karet.util)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/karet.util/master.svg)](https://codecov.io/github/calmm-js/karet.util?branch=master)
[![](https://david-dm.org/calmm-js/karet.util.svg)](https://david-dm.org/calmm-js/karet.util)
[![](https://david-dm.org/calmm-js/karet.util/dev-status.svg)](https://david-dm.org/calmm-js/karet.util?type=dev)

## Contents

* [Reference](#reference)

## Reference

This library provides a large number of named imports.  Typically one just
imports the library as:

```js
import * as U from "karet.util"
```

### Misc

#### <a id="U-seq"></a> [≡](#contents) [`U.seq(value, ...fns) ~> value`](#U-seq)

`U.seq` allows one to pipe a value through a sequence of functions.  In other
words, `U.seq(x, fn_1, ..., fn_N)` is roughly equivalent to `fn_N( ... fn_1(x)
... )`.  It serves a similar purpose as
the [`->>`](https://clojuredocs.org/clojure.core/-%3E%3E) macro of Clojure or
the `|>` operator
of
[F#](https://msdn.microsoft.com/en-us/visualfsharpdocs/conceptual/operators.%5b-h%5d-%5d%5b't1,'u%5d-function-%5bfsharp%5d) and
[Elm](http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#|>), for
example, or
the
[`>|`](http://comp.lang.functional.narkive.com/zZJZg20r/a-family-of-function-application-operators-for-standard-ml) operator
defined in a Usenet post by some rando.

For example:

```js
U.seq(1, x => x + 1, x => -x)
// -2
```

A common technique in JavaScript is to use method chaining: `x.fn_1().fn_2()`.
A problem with method chaining is that it requires having objects with methods.
Sometimes you may need to manipulate values that are not objects, like `null`
and `undefined`, and other times you may want to use functions that are not
directly provided as methods and it may not be desirable
to [monkey patch](https://en.wikipedia.org/wiki/Monkey_patch#Pitfalls) such
methods.

`U.seq` is designed to work with partially
applied [curried](https://en.wikipedia.org/wiki/Currying) functions that take
the <a href="https://en.wikipedia.org/wiki/Object_(grammar)">object</a> as their
last argument and can be seen as providing a flexible alternative to method
chaining.

#### <a id="U-seqPartial"></a> [≡](#contents) [`U.seqPartial(maybeValue, ...fns) ~> maybeValue`](#U-seqPartial)

`U.seqPartial` allows one to pipe a value through a sequence of function in such
a way that if the value becomes `undefined` the process is stopped and
`undefined` is returned without calling the remaining functions.

#### <a id="U-scope"></a> [≡](#contents) [`U.scope(() => value) ~> value`](#U-scope)

`U.scope` simply calls the given thunk.  IOW, `U.scope(fn)` is equivalent to
`(fn)()`.  You can use it to create a new scope at expression level.

For example:

```js
U.scope((x = 1, y = 2) => x + y)
// 3
```

#### <a id="U-toPartial"></a> [≡](#contents) [`U.toPartial((...values) => value) ~> (...maybeValues) => maybeValue`](#U-toPartial)

`U.toPartial` takes the given function and returns a curried version of the
function that immediately returns `undefined` if any of the arguments passed is
`undefined` and otherwise calls the given function with arguments.

For example:

```js
U.toPartial((x, y) => x + y)(1, undefined)
// undefined
```

```js
U.toPartial((x, y) => x + y)(1, 2)
// 3
```

#### <a id="U-show"></a> [≡](#contents) [`U.show(value) ~> value`](#U-show)

`U.show` logs the given value to console and returns the value.

#### <a id="U-refTo"></a> [≡](#contents) [`U.refTo(settable)(value or null) ~> undefined`](#U-refTo)

`U.refTo` is designed for getting a reference to the DOM element of a component:

```jsx
const Component = ({dom = U.variable()}) =>
  <div ref={U.refTo(dom)}>
    ...
  </div>
```

[React](https://facebook.github.io/react/docs/refs-and-the-dom.html) calls the
`ref` callback with the DOM element on mount and with `null` on unmount.
However, `U.refTo` does not write `null` to the variable.  The upside of
skipping `null` and using an initially empty variable rather than an atom is
that once the variable emits a value, you can be sure that it refers to a DOM
element.

#### <a id="U-getProps"></a> [≡](#contents) [`U.getProps({prop: settable, ...})`](#U-getProps)
#### <a id="U-setProps"></a> [≡](#contents) [`U.setProps({prop: observable, ...})`](#U-setProps)
#### <a id="U-bindProps"></a> [≡](#contents) [`U.bindProps({ref: eventName, prop: settable, ...})`](#U-bindProps)
#### <a id="U-bind"></a> [≡](#contents) [`U.bind({prop: settable, ...})`](#U-bind)

#### <a id="K"></a> [≡](#contents) [`K`](#K)
#### <a id="U-template"></a> [≡](#contents) [`U.template(template of observables)`](#U-template)
#### <a id="U-string"></a> [≡](#contents) [`U.string`](#U-string)
#### <a id="U-lift"></a> [≡](#contents) [`U.lift`](#U-lift)

#### <a id="U-ift"></a> [≡](#contents) [`U.ift(condition, consequent)`](#U-ift)
#### <a id="U-ifte"></a> [≡](#contents) [`U.ifte(condition, consequent, alternative)`](#U-ifte)

#### <a id="U-actions"></a> [≡](#contents) [`U.actions(...maybeFns)`](#U-actions)

#### <a id="U-mapCached"></a> [≡](#contents) [`U.mapCached(x => ..., array)`](#U-mapCached)
#### <a id="U-mapIndexed"></a> [≡](#contents) [`U.mapIndexed((x, i) => ..., array)`](#U-mapIndexed)
#### <a id="U-indices"></a> [≡](#contents) [`U.indices(array)`](#U-indices)

### Atom
#### <a id="U-atom"></a> [≡](#contents) [`U.atom(value)`](#U-atom)
#### <a id="U-variable"></a> [≡](#contents) [`U.variable()`](#U-variable)
#### <a id="U-molecule"></a> [≡](#contents) [`U.molecule(template)`](#U-molecule)
#### <a id="U-holding"></a> [≡](#contents) [`U.holding(() => ...)`](#U-holding)
#### <a id="U-view"></a> [≡](#contents) [`U.view(lens, value)`](#U-view)
#### <a id="U-set"></a> [≡](#contents) [`U.set(settable, value)`](#U-set)

### Karet
#### <a id="U-fromKefir"></a> [≡](#contents) [`U.fromKefir()`](#U-fromKefir)

### Context
#### <a id="U-Context"></a> [≡](#contents) [`U.Context`](#U-Context)
#### <a id="U-withContext"></a> [≡](#contents) [`U.withContext`](#U-withContext)
#### <a id="U-WithContext"></a> [≡](#contents) [`U.WithContext`](#U-WithContext)

### Kefir

Kefir operations in curried form.

#### <a id="U-debounce"></a> [≡](#contents) [`U.debounce(milliseconds, observable) ~> observable`](#U-debounce)
#### <a id="U-changes"></a> [≡](#contents) [`U.changes(observable) ~> observable`](#U-changes)
#### <a id="U-serially"></a> [≡](#contents) [`U.serially([...observables]) ~> observable`](#U-serially)
#### <a id="U-parallel"></a> [≡](#contents) [`U.parallel([...observables]) ~> observable`](#U-parallel)
#### <a id="U-delay"></a> [≡](#contents) [`U.delay(milliseconds, observable) ~> observable`](#U-delay)
#### <a id="U-endWith"></a> [≡](#contents) [`U.endWith(value, observable) ~> observable`](#U-endWith)
#### <a id="U-flatMapSerial"></a> [≡](#contents) [`U.flatMapSerial(value => observable, observable) ~> observable`](#U-flatMapSerial)
#### <a id="U-flatMapErrors"></a> [≡](#contents) [`U.flatMapErrors(error => observable, observable) ~> observable`](#U-flatMapErrors)
#### <a id="U-flatMapLatest"></a> [≡](#contents) [`U.flatMapLatest(value => observable, observable) ~> observable`](#U-flatMapLatest)
#### <a id="U-foldPast"></a> [≡](#contents) [`U.foldPast`](#U-foldPast)
#### <a id="U-interval"></a> [≡](#contents) [`U.interval`](#U-interval)
#### <a id="U-later"></a> [≡](#contents) [`U.later`](#U-later)
#### <a id="U-lazy"></a> [≡](#contents) [`U.lazy(() => observable) ~> property`](#U-lazy)
#### <a id="U-never"></a> [≡](#contents) [`U.never ~> observable`](#U-never)
#### <a id="U-on"></a> [≡](#contents) [`U.on`](#U-on)
#### <a id="U-sampledBy"></a> [≡](#contents) [`U.sampledBy`](#U-sampledBy)
#### <a id="U-skipFirst"></a> [≡](#contents) [`U.skipFirst(count, observable) ~> observable`](#U-skipFirst)
#### <a id="U-skipDuplicates"></a> [≡](#contents) [`U.skipDuplicates(observable) ~> observable`](#U-skipDuplicates)
#### <a id="U-skipUnless"></a> [≡](#contents) [`U.skipUnless(elem => boolean, observable) ~> observable`](#U-skipUnless)
#### <a id="U-skipWhen"></a> [≡](#contents) [`U.skipWhen(elem => boolean, observable) ~> observable`](#U-skipWhen)
#### <a id="U-startWith"></a> [≡](#contents) [`U.startWith(constant, observable) ~> observable`](#U-startWith)
#### <a id="U-sink"></a> [≡](#contents) [`U.sink(observable) ~> observable`](#U-sink)
#### <a id="U-takeFirst"></a> [≡](#contents) [`U.takeFirst(count, observable) ~> observable`](#U-takeFirst)
#### <a id="U-takeUntilBy"></a> [≡](#contents) [`U.takeUntilBy`](#U-takeUntilBy)
#### <a id="U-toProperty"></a> [≡](#contents) [`U.toProperty(observable) ~> observable`](#U-toProperty)
#### <a id="U-throttle"></a> [≡](#contents) [`U.throttle(milliseconds, observable) ~> observable`](#U-throttle)

### Ramda

Ramda functions lifted to take Kefir observables.

### Math
