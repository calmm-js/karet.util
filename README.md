# <a id="karet-util"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#karet-util) [Karet Util](#karet-util) &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/karet.util.svg?style=social)](https://github.com/calmm-js/karet.util) [![npm](https://img.shields.io/npm/dm/karet.util.svg)](https://www.npmjs.com/package/karet.util)

A collection of utilities for working with
[Karet](https://github.com/calmm-js/karet).

[![npm version](https://badge.fury.io/js/karet.util.svg)](http://badge.fury.io/js/karet.util)
[![Build Status](https://travis-ci.org/calmm-js/karet.util.svg?branch=master)](https://travis-ci.org/calmm-js/karet.util)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/karet.util/master.svg)](https://codecov.io/github/calmm-js/karet.util?branch=master)
[![](https://david-dm.org/calmm-js/karet.util.svg)](https://david-dm.org/calmm-js/karet.util)
[![](https://david-dm.org/calmm-js/karet.util/dev-status.svg)](https://david-dm.org/calmm-js/karet.util?type=dev)

## <a id="contents"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#contents) [Contents](#contents)

* [Reference](#reference)
  * [About lifted functions](#about-lifted-functions)
  * [Debugging](#debugging)
    * [`U.show(...labels, any)`](#u-show)
  * [Atoms](#atoms)
    * [Creating atoms](#creating-atoms)
      * [`U.atom(value)`](#u-atom)
      * [`U.molecule([ ... ] | { ... })`](#u-molecule)
      * [`U.variable()`](#u-variable)
    * [Transactions](#transactions)
      * [`U.holding(() => { ... })`](#u-holding)
    * [Decomposing](#decomposing)
      * [`U.destructure(atom)`](#u-destructure)
      * [`U.mapElems((elemAtom, index) => any, arrayAtom)`](#u-mapelems)
      * [`U.mapElemsWithIds(lensAtom, (elemAtom, id) => any, arrayAtom)`](#u-mapelemswithids)
      * [`U.view(lens, atom)`](#u-view)
    * [Side-effects on atoms](#side-effects-on-atoms)
      * [`U.set(atom, value)`](#u-set)
    * [Actions on atoms](#actions-on-atoms)
      * [`U.doModify(atom, mapper)`](#u-domodify)
      * [`U.doRemove(atom)`](#u-doremove)
      * [`U.doSet(atom, value)`](#u-doset)
  * [Bus](#bus)
    * [Creating buses](#creating-buses)
      * [`U.bus()`](#u-bus)
      * [`U.serializer(initial[, [...actions]])`](#u-serializer)
    * [Actions on buses](#actions-on-buses)
      * [`U.doEnd(bus)`](#u-doend)
      * [`U.doError(bus, error)`](#u-doerror)
      * [`U.doPush(bus, value)`](#u-dopush)
  * [Convenience](#convenience)
    * [`U.scope((...) => ...)`](#u-scope)
    * [`U.tapPartial(action, any)`](#u-tappartial)
    * [`U.thru(any, ...fns)`](#u-thru)
    * [`U.through(...fns)`](#u-through)
    * [`U.toPartial(fn)`](#u-topartial)
  * [React helpers](#react-helpers)
    * [Binding](#binding)
      * [`U.getProps({...propName: atom|bus})`](#u-getprops)
      * [`U.setProps({...propName: observable})`](#u-setprops)
    * [Input components](#input-components)
      * [`<U.Input {...{value|checked}} />`](#u-input)
      * [`<U.Select {...{value}} />`](#u-select)
      * [`<U.TextArea {...{value}} />`](#u-textarea)
    * [Refs](#refs)
      * [`U.refTo(variable)`](#u-refto)
    * [Lifecycle](#lifecycle)
      * [`U.onUnmount(action)`](#u-onunmount)
    * [Events](#events)
      * [`U.actions(...actions)`](#u-actions)
      * [`U.preventDefault(event)`](#u-preventdefault)
      * [`U.stopPropagation(event)`](#u-stoppropagation)
    * [Class names](#class-names)
      * [`U.cns(...classNames)`](#u-cns)
    * [Interop](#interop)
      * [`U.pure(Component)`](#u-pure)
      * [`U.toKaret(ReactComponent)`](#u-tokaret)
      * [`U.toReact(KaretComponent)`](#u-toreact)
      * [`U.toReactExcept(propName => boolean, KaretComponent)`](#u-toreactexcept)
  * [Kefir](#kefir)
    * [Algebras](#algebras)
      * [`U.IdentityLatest`](#u-identitylatest)
      * [`U.Latest`](#u-latest)
    * [Conditionals](#conditionals)
      * [`U.and(...any)`](#u-and)
      * [`U.cond(...[condition, consequent][, [alternative]])`](#u-cond)
      * [`U.ifElse(condition, consequent, alternative)`](#u-ifelse)
      * [`U.not(any)`](#u-not)
      * [`U.or(...any)`](#u-or)
      * [`U.unless(condition, alternative)`](#u-unless)
      * [`U.when(condition, consequent)`](#u-when)
    * [Animation](#animation)
      * [`U.animationSpan(milliseconds)`](#u-animationspan)
    * [Lifting](#lifting)
      * [`U.combine([...any], fn)`](#u-combine)
      * [`U.lift((...) => ...)`](#u-lift)
      * [`U.liftRec((...) => ...)`](#u-liftrec)
    * [Curried combinators](#curried-combinators)
      * [`U.changes(observable)` ⌘](https://kefirjs.github.io/kefir/#changes)
      * [`U.debounce(ms, observable)` ⌘](https://kefirjs.github.io/kefir/#debounce)
      * [`U.delay(ms, observable)` ⌘](https://kefirjs.github.io/kefir/#delay)
      * [`U.flatMapErrors(value => observable, observable)` ⌘](https://kefirjs.github.io/kefir/#flat-map-errors)
      * [`U.flatMapLatest(value => observable, observable)` ⌘](https://kefirjs.github.io/kefir/#flat-map-latest)
      * [`U.flatMapParallel(value => observable, observable)` ⌘](https://kefirjs.github.io/kefir/#flat-map)
      * [`U.flatMapSerial(value => observable, observable)` ⌘](https://kefirjs.github.io/kefir/#flat-map-concat)
      * [`U.foldPast((state, value) => state, state, observable)` ⌘](https://kefirjs.github.io/kefir/#scan)
      * [`U.fromEvents(target, eventName, transform)` ⌘](https://kefirjs.github.io/kefir/#from-event)
      * [`U.ignoreErrors(observable)` ⌘](https://kefirjs.github.io/kefir/#ignore-errors)
      * [`U.ignoreValues(observable)` ⌘](https://kefirjs.github.io/kefir/#ignore-values)
      * [`U.interval(ms, value)` ⌘](https://kefirjs.github.io/kefir/#interval)
      * [`U.later(ms, value)` ⌘](https://kefirjs.github.io/kefir/#later)
      * [`U.mapValue(value => value, observable)` ⌘](https://kefirjs.github.io/kefir/#map)
      * [`U.never` ⌘](https://kefirjs.github.io/kefir/#never)
      * [`U.parallel([...observables])` ⌘](https://kefirjs.github.io/kefir/#merge)
      * [`U.sampledBy(eventStream, property)` ⌘](https://kefirjs.github.io/kefir/#obs-sampled-by)
      * [`U.serially([...observables])` ⌘](https://kefirjs.github.io/kefir/#concat)
      * [`U.skipDuplicates(equality, observable)` ⌘](https://kefirjs.github.io/kefir/#skip-duplicates)
      * [`U.skipFirst(number, observable)` ⌘](https://kefirjs.github.io/kefir/#skip)
      * [`U.skipFirstErrors(n, observable)` ⌘](https://kefirjs.github.io/kefir/#skip-errors)
      * [`U.skipUnless(predicate, observable)` ⌘](https://kefirjs.github.io/kefir/#filter)
      * [`U.takeFirst(number, observable)` ⌘](https://kefirjs.github.io/kefir/#take)
      * [`U.takeFirstErrors(number, observable)` ⌘](https://kefirjs.github.io/kefir/#take-errors)
      * [`U.takeUntilBy(eventStream, observable)` ⌘](https://kefirjs.github.io/kefir/#take-until-by)
      * [`U.throttle(ms, observable)` ⌘](https://kefirjs.github.io/kefir/#throttle)
      * [`U.toObservable(observable)` ⌘](https://kefirjs.github.io/kefir/#constant)
      * [`U.toProperty(observable)` ⌘](https://kefirjs.github.io/kefir/#to-property)
    * [Additional combinators](#additional-combinators)
      * [`U.consume(action, observable)`](#u-consume)
      * [`U.endWith(value, observable)`](#u-endwith)
      * [`U.fromPromise(() => promise | {ready, abort})`](#u-frompromise)
      * [`U.lazy(() => observable)`](#u-lazy)
      * [`U.sink(observable)`](#u-sink)
      * [`U.skipIdenticals(observable)`](#u-skipidenticals)
      * [`U.skipWhen(predicate, observable)`](#u-skipwhen)
      * [`U.startWith(value, observable)`](#u-startwith)
      * [`U.template([ ... ] | { ... })`](#u-template)
    * [Subscribing](#subscribing)
      * [`U.on({value, error, end}, observable)`](#u-on)
  * [Lifted standard functions](#lifted-standard-functions)
    * [JSON](#JSON)
      * [`U.parse(string[, reviver])` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
      * [`U.stringify(value[, replacer[, space]])` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
    * [URIs](#URIs)
      * [`U.decodeURI(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)
      * [`U.decodeURIComponent(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
      * [`U.encodeURI(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
      * [`U.encodeURIComponent(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
    * [Math](#Math)
      * [`U.abs(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs)
      * [`U.acos(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acos)
      * [`U.acosh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acosh)
      * [`U.asin(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin)
      * [`U.asinh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asinh)
      * [`U.atan(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan)
      * [`U.atanh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atanh)
      * [`U.atan2(y, x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2)
      * [`U.cbrt(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt)
      * [`U.ceil(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil)
      * [`U.clz32(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32)
      * [`U.cos(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos)
      * [`U.cosh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cosh)
      * [`U.exp(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/exp)
      * [`U.expm1(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/expm1)
      * [`U.floor(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)
      * [`U.fround(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround)
      * [`U.hypot(...xs)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot)
      * [`U.imul(x, y)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul)
      * [`U.log(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log)
      * [`U.log1p(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log1p)
      * [`U.log10(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10)
      * [`U.log2(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2)
      * [`U.max(...xs)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max)
      * [`U.min(...xs)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min)
      * [`U.pow(x, y)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)
      * [`U.round(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round)
      * [`U.sign(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign)
      * [`U.sin(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin)
      * [`U.sinh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sinh)
      * [`U.sqrt(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)
      * [`U.tan(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tan)
      * [`U.tanh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tanh)
      * [`U.trunc(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc)
    * [String](#String)
      * [<code>U.string\`template string with observables\`</code> ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw)

## <a id="reference"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#reference) Reference

This library provides a large number of named exports.  Typically one just
imports the library as:

```jsx
import * as U from 'karet.util'
```

### <a id="about-lifted-functions"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#about-lifted-functions) About lifted functions

Many of the functions in this library are [*lifted*](#u-liftrec) so that they
accept both ordinary values and observables as inputs.  When such functions are
given only ordinary values as inputs, they return immediately with the result
value.  OTOH, when such a function is given at least an observable as an input,
they return an observable of results.

### <a id="debugging"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#debugging) [Debugging](#debugging)

#### <a id="u-show"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-show) [`U.show(...labels, any)`](#u-show)

`U.show` is basically an identity function that `console.log`s the values
flowing through.  `U.show` works on plain values, observables, and atoms.  When
used with atoms, `U.show` also logs values written through.

For example:

```jsx
const Component = ({state}) => (
  <div>
    <SubComponent subState={U.show('subState', U.view('subState', state))}/>
  </div>
)
```

### <a id="atoms"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#atoms) [Atoms](#atoms)

#### <a id="creating-atoms"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#creating-atoms) [Creating atoms](#creating-atoms)

##### <a id="u-atom"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-atom) [`U.atom(value)`](#u-atom)

`U.atom` creates a new atom with the given initial value.

For example:

```jsx
const notEmpty = U.atom('initial')
notEmpty.get() // 'initial'
notEmpty.log() // [property] <value:current> initial
```

##### <a id="u-molecule"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-molecule) [`U.molecule([ ... ] | { ... })`](#u-molecule)

`U.molecule` composes an atom from a template of atoms.

For example:

```jsx
const xyA = U.atom({x: 1, y: 2})
const xL = U.view('x', xyA)
const yL = U.view('y', xyA)
const xyM = U.molecule({x: xL, y: yL})
```

When read, either as a property or via `get`, the atoms in the template are
replaced by their values:

```jsx
R.equals( xyM.get(), xyA.get() ) // true
```

When written to, the atoms in the template are written to with matching elements
from the written value:

```jsx
xyM.modify(L.set('x', 3))
xL.get() // 3
yL.get() // 2
```

The writes are performed holding event propagation.

It is considered an error, and the effect is unpredictable, if the written value
does not match the template, aside from the positions of abstract mutables, of
course, which means that write operations, `set`, `remove`, and `modify`, on
molecules and lensed atoms created from molecules are only partial.

Also, if the template contains multiple abstract mutables that correspond to the
same underlying state, then writing through the template will give unpredictable
results.

##### <a id="u-variable"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-variable) [`U.variable()`](#u-variable)

`U.variable` creates a new atom without an initial value.  See also
[`U.refTo`](#u-refto).

For example:

```jsx
const empty = U.variable()
empty.get() // undefined
empty.log()
empty.set('first') // [property] <value> first
```

#### <a id="transactions"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#transactions) [Transactions](#transactions)

##### <a id="u-holding"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-holding) [`U.holding(() => { ... })`](#u-holding)

`U.holding` is given a thunk to call while holding the propagation of events
from changes to atoms. The thunk can `get`, `set`, `remove` and `modify` any
number of atoms.  After the thunk returns, persisting changes to atoms are
propagated.  See also [`U.actions`](#u-actions) and [`U.getProps`](#u-getprops).

For example:

```jsx
const xy = U.atom({x: 1, y: 2})
const x = U.view('x', xy)
const y = U.view('y', xy)
x.log('x') // x <value:current> 1
y.log('y') // y <value:current> 2
U.holding(() => {
  xy.set({x: 2, y: 1})
  x.set(x.get() - 1)
}) // y <value> 1
```

#### <a id="decomposing"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#decomposing) [Decomposing](#decomposing)

##### <a id="u-destructure"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-destructure) [`U.destructure(atom)`](#u-destructure)

`U.destructure` wraps a given atom or observable with a
[proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
that performs property access via [`U.view`](#u-view).  On plain observable
properties only `get` access is supported.  On mutable atoms `get`, `set`, and
`deleteProperty` accesses are supported.

For example,

```jsx
const {name, number} = U.destructure(contact)
```

is equivalent to

```jsx
const name = U.view('name', contact)
const number = U.view('number', contact)
```

Note that *all* property accesses through the proxy returned by `U.destructure`
are performed via [`U.view`](#u-view).  This means that the return value of
`U.destructure` cannot be used as the atom or observable that it proxies.

Note that `U.destructure` is not recursive, which means that nested
destructuring cannot be used.  Only single level property access is proxied.

Note that `U.destructure` requires proper
[`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
support.  You need to [decide whether you can use
it](https://caniuse.com/#feat=proxy).

##### <a id="u-mapelems"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-mapElems) [`U.mapElems((elemAtom, index) => any, arrayAtom)`](#u-mapelems)

`U.mapElems` performs a cached incremental map over state containing an array of
values.  On changes, the mapping function is only called for elements that were
not in the state previously.  `U.mapElems` can be used for rendering a list of
*stateless components*, however, if elements in the array have unique ids, then
[`U.mapElemsWithIds`](#u-mapelemswithids) is generally preferable.

For example:

```jsx
const Contacts = ({contacts}) => (
  <div>
    {U.mapElems((contact, i) => <Contact {...{key: i, contact}} />, contacts)}
  </div>
)
```

See the live [Contacts](https://codesandbox.io/s/zk7bx827r) CodeSandbox for an
example.

##### <a id="u-mapelemswithids"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-mapElemsWithIds) [`U.mapElemsWithIds(idLens, (elemAtom, id) => any, arrayAtom)`](#u-mapelemswithids)

`U.mapElemsWithIds` performs a cached incremental map over state containing an
array of values with unique ids.  On changes, the mapping function is only
called for elements that were not in the state previously.  `U.mapElemsWithIds`
is particularly designed for rendering a list of potentially *stateful
components* efficiently.  See also [`U.mapElems`](#u-mapelems).

For example:

```jsx
const state = U.atom([
  {id: 1, value: 'Keep'},
  {id: 2, value: 'Calmm'},
  {id: 3, value: 'and'},
  {id: 4, value: 'React!'}
])

const Elems = ({elems}) => (
  <ul>
    {U.mapElemsWithIds(
      'id',
      (elem, id) => <li key={id}>{U.view('value', elem)}</li>,
      elems
    )}
  </ul>
)
```

`U.mapElemsWithIds` is asymptotically optimal in the sense that any change (new
elements added or old elements removed, positions of elements changed, ...) has
`Theta(n)` complexity.  That is the best that can be achieved with plain arrays.

##### <a id="u-view"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-view) [`U.view(lens, atom)`](#u-view)

`U.view` creates a read-write view with the given lens from the given original
atom.  The lens may also be an observable producing lenses.  Modifications to
the lensed atom are reflected in the original atom and vice verse.

For example:

```jsx
const root = U.atom({x: 1})
const x = U.view('x', root)
x.set(2)
root.get() // { x: 2 }
root.set({x: 3})
x.get() // 3
```

One of the key ideas that makes lensed atoms work is [the compositionality of
partial lenses](https://github.com/calmm-js/partial.lenses/#L-compose).  Those
equations make it possible not just to create lenses via composition (left hand
sides of equations), but also to create paths of lensed atoms (right hand sides
of equations).  More concretely, both the `c` in

```jsx
const b = U.view(a_to_b_PLens, a)
const c = U.view(b_to_c_PLens, b)
```

and in

```jsx
const c = U.view([a_to_b_PLens, b_to_c_PLens], a)
```

can be considered equivalent thanks to the compositionality equations of lenses.

Note that, for most intents and purposes, `U.view` is a [referentially
transparent](https://en.wikipedia.org/wiki/Referential_transparency) function:
it does not create new mutable state&mdash;it merely creates a reference to
existing mutable state.

`U.view` is the primary means of decomposing state for sub-components.  For
example:

```jsx
const Contact = ({contact}) => (
  <div>
    <TextInput value={U.view('name', contact)} />
    <TextInput value={U.view('phone', contact)} />
  </div>
)
```

See the live [Contacts](https://codesandbox.io/s/zk7bx827r) CodeSandbox for an
example.

#### <a id="side-effects-on-atoms"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#side-effects-on-atoms) [Side-effects on atoms](#side-effects-on-atoms)

##### <a id="u-set"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-set) [`U.set(atom, value)`](#u-set)

`U.set` sets the given value to the specified atom.  In case the value is
actually an observable, `U.set` returns a [sink](#u-sink) that sets any values
produced by the observable to the atom.

For example:

```jsx
const Component = ({parameters}) => {
  const state = U.atom(null)
  // ...
  return (
    <div>
      {U.set(state, httpRequestAsObservable(parameters))}
      {U.ifElse(
        R.isNil(state),
        <Spinner />,
        <Editor state={state} />
      )}
    </div>
  )
}
```

Note that the above kind of arrangement to fetch data and set it into an atom is
not needed when the data is only displayed in a read-only fashion in the UI.

#### <a id="actions-on-atoms"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#actions-on-atoms) [Actions on atoms](#actions-on-atoms)

##### <a id="u-domodify"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-doModify) [`U.doModify(atom, mapper)`](#u-domodify)

`U.doModify` creates an action that invokes the `modify` method on the given
atom with the given mapping function.

##### <a id="u-doremove"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-doRemove) [`U.doRemove(atom)`](#u-doremove)

`U.doRemove` creates an action that invokes the `remove` method on the given
atom.

##### <a id="u-doset"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-doSet) [`U.doSet(atom, value)`](#u-doset)

`U.doSet` creates an action that invokes the `set` method on the given atom with
the given value.

### <a id="bus"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#bus) [Bus](#bus)

#### <a id="creating-buses"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#creating-buses) [Creating buses](#creating-buses)

##### <a id="u-bus"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-bus) [`U.bus()`](#u-bus)

`U.bus()` creates a new observable `Bus` stream.  A `Bus` stream has the
following methods:

* `bus.push(value)` to explicitly emit value `value`,
* `bus.error(error)` to explicitly emit error `error`, and
* `bus.end()` to explicitly end the stream after which all the methods do
  nothing.

Note that buses and event streams, in general, are fairly rarely used with
Karet.  They can be useful for performing IO actions and in cases where actions
from UI controls need to be throttled or combined.

See the live [Counter using Event Streams](https://codesandbox.io/s/1840p9xo9l)
CodeSandbox for an example.

##### <a id="u-serializer"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-serializer) [`U.serializer(initial[, [...actions]])`](#u-serializer)

`U.serializer` creates a new observable *property* for *serially* executing
actions, which are zero argument functions that may return a value or an
observable that should eventually end.  The returned property starts with the
given `initial` value and then continues with the results of the optional array
of `actions`.  Like a [`Bus`](#u-bus), the returned property also has the
following extra methods:

* `bus.push(action)` to explicitly push a new action to be executed,
* `bus.error(error)` to explicitly emit error `error`, and
* `bus.end()` to explicitly stop the serializer after which all the methods do
  nothing.

The property must be subscribed to in order to process actions.

See the [Form using Context](https://codesandbox.io/s/2rq54pgrp) CodeSandbox for
a minimalist example that uses a serializer to execute a simulated asynchronous
operation.

#### <a id="actions-on-buses"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#actions-on-buses) [Actions on buses](#actions-on-buses)

##### <a id="u-doend"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-doEnd) [`U.doEnd(bus)`](#u-doend)

`U.doEnd` creates an action that invokes the `end` method on the given bus.

##### <a id="u-doerror"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-doError) [`U.doError(bus, error)`](#u-doerror)

`U.doError` creates an action that invokes the `error` method on the given bus
with the given value.

##### <a id="u-dopush"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-doPush) [`U.doPush(bus, value)`](#u-dopush)

`U.doPush` creates an action that invokes the `push` method on the given bus
with the given value.

### <a id="convenience"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#convenience) [Convenience](#convenience)

#### <a id="u-scope"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-scope) [`U.scope((...) => ...)`](#u-scope)

`U.scope` simply calls the given thunk.  IOW, `U.scope(fn)` is equivalent to
`(fn)()`.  You can use it to create a new scope at expression level.

For example:

```js
U.scope((x = 1, y = 2) => x + y)
// 3
```

#### <a id="u-tappartial"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-tapPartial) [`U.tapPartial(action, any)`](#u-tappartial)

`U.tapPartial` is a [lifted](#u-liftrec) partial
[tap](http://ramdajs.com/docs/#tap) function.  The given action is called for
values flowing through except when the value is `undefined`.

For example:

```jsx
U.thru(
  observable,
  ...
  U.tapPartial(value => console.log(value)),
  ...
)
```

#### <a id="u-thru"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-thru) [`U.thru(any, ...fns)`](#u-thru)

`U.thru` allows one to pipe a value through a sequence of functions.  In other
words, `U.thru(x, fn_1, ..., fn_N)` is roughly equivalent to `fn_N( ... fn_1(x)
... )`.  It serves a similar purpose as the
[`->>`](https://clojuredocs.org/clojure.core/-%3E%3E) macro of Clojure or the
`|>` operator of
[F#](https://blogs.msdn.microsoft.com/dsyme/2011/05/17/archeological-semiotics-the-birth-of-the-pipeline-symbol-1994/)
and [Elm](http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#|>),
for example, or the
[`>|`](http://comp.lang.functional.narkive.com/zZJZg20r/a-family-of-function-application-operators-for-standard-ml)
operator defined in a Usenet post by some rando.  See also
[`U.through`](#u-through).

For example:

```js
U.thru(1, x => x + 1, x => -x)
// -2
```

A common technique in JavaScript is to use method chaining: `x.fn_1().fn_2()`.
A problem with method chaining is that it requires having objects with methods.
Sometimes you may need to manipulate values that are not objects, like `null`
and `undefined`, and other times you may want to use functions that are not
directly provided as methods and it may not be desirable to [monkey
patch](https://en.wikipedia.org/wiki/Monkey_patch#Pitfalls) such methods.

`U.thru` is designed to work with partially applied
[curried](https://en.wikipedia.org/wiki/Currying) and [lifted](#lifting)
functions that take the <a
href="https://en.wikipedia.org/wiki/Object_(grammar)">object</a> as their last
argument and can be seen as providing a flexible alternative to method chaining.

#### <a id="u-through"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-through) [`U.through(...fns)`](#u-through)

`U.through` allows one to compose a function that passes its single argument
through all of the given functions from left to right.  In other words,
`U.through(fn_1, ..., fn_N)(x)` is roughly equivalent to `fn_N( ... fn_1(x)
... )`.  It serves a similar purpose as
[`R.pipe`](http://ramdajs.com/docs/#pipe), but has been crafted to work with
[lifted](#lifting) functions.  See also [`U.thru`](#u-thru).

For example:

```js
U.through(x => x + 1, x => -x)(1)
// -2
```

#### <a id="u-topartial"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-toPartial) [`U.toPartial(fn)`](#u-topartial)

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

### <a id="react-helpers"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#react-helpers) [React helpers](#react-helpers)

#### <a id="binding"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#binding) [Binding](#binding)

##### <a id="u-getprops"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-getProps) [`U.getProps({...propName: atom|bus})`](#u-getprops)

`U.getProps` returns an event callback that gets the values of the properties
named in the given template from the event target and pushes or sets them to the
[buses](#bus) or [atoms](#atoms) that are the values of the properties.  In case
the template contains multiple properties, the results are written while
[holding](#u-holding) change propagation.

For example:

```jsx
const TextInput = ({value}) => (
  <input type="text" value={value} onChange={U.getProps({value})} />
)
```

```jsx
const Checkbox = ({checked}) => (
  <input type="checkbox" checked={checked} onChange={U.getProps({checked})} />
)
```

##### <a id="u-setprops"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-setProps) [`U.setProps({...propName: observable})`](#u-setprops)

`U.setProps` returns a callback designed to be used with `ref` that subscribes
to observables in the given template and copies values from the observables to
the named properties in the DOM element.  This allows one to bind to DOM
properties such as scroll position that are not HTML attributes.  See also
[`U.actions`](#u-actions).

See the live [Scroll](https://codesandbox.io/s/w6lpz5m9n7) CodeSandbox for an
example.

#### <a id="input-components"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#input-components) [Input components](#input-components)

##### <a id="u-input"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-Input) [`<U.Input {...{value|checked}} />`](#u-input)

`U.Input` is a wrapper for an `input` element that binds either
[`onChange={U.getProps({value})}`](#u-getprops) or
[`onChange={U.getProps({checked})}`](#u-getprops) when either `value` or
`checked` is a defined property.

For example:

```jsx
const checked = U.atom(false)
// ...
<U.Input type="checkbox" checked={checked} />
```

##### <a id="u-select"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-Select) [`<U.Select {...{value}} />`](#u-select)

`U.Select` is a wrapper for a `select` element that binds
[`onChange={U.getProps({value})}`](#u-getprops) when `value` is a defined
property.

For example:

```jsx
const value = U.atom('')
// ...
<U.Select value={value} />
```

##### <a id="u-textarea"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-TextArea) [`<U.TextArea {...{value}} />`](#u-textarea)

`U.TextArea` is a wrapper for a `textarea` element that binds
[`onChange={U.getProps({value})}`](#u-getprops) when `value` is a defined
property.

For example:

```jsx
const value = U.atom('')
// ...
<U.TextArea value={value} />
```

#### <a id="refs"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#refs) [Refs](#refs)

##### <a id="u-refto"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-refTo) [`U.refTo(variable)`](#u-refto)

`U.refTo` is designed for getting a reference to the DOM element of a component.
See also [`U.variable`](#u-variable).  See also [`U.actions`](#u-actions).

For example:

```jsx
const Component = ({dom = U.variable()}) => (
  <div ref={U.refTo(dom)}>
    ...
  </div>
)
```

[React](https://facebook.github.io/react/docs/refs-and-the-dom.html) calls the
`ref` callback with the DOM element on mount and with `null` on unmount.
However, `U.refTo` does not write `null` to the variable.  The upside of
skipping `null` and using an initially empty [variable](#u-variable) rather than
an [atom](#u-atom) is that once the variable emits a value, you can be sure that
it refers to a DOM element.

Note that in case you also want to observe `null` values, you can use
[`U.set`](#u-set) instead of `U.refTo`:

```jsx
const Component = ({dom = U.variable()}) => (
  <div ref={U.set(dom)}>
    ...
  </div>
)
```

#### <a id="lifecycle"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#lifecycle) [Lifecycle](#lifecycle)

##### <a id="u-onunmount"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-onUnmount) [`U.onUnmount(action)`](#u-onunmount)

`U.onUnmount` allows you to perform an action when a component is unmounted.

For example:

```jsx
const Component = () => {
  console.log('Mounted!')
  return (
    <div>
      {U.onUnmount(() => console.log('Unmounted!'))}
    </div>
  )
}
```

#### <a id="events"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#events) [Events](#events)

##### <a id="u-actions"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-actions) [`U.actions(...actions)`](#u-actions)

`U.actions` is designed for creating an action from multiple actions.  It
returns an unary action function that calls the functions in the arguments with
the same argument.  In case there are multiple actions, they are performed while
[holding](#u-holding) change propagation.

For example:

```jsx
const InputValue = ({value, onChange}) => (
  <input value={value} onChange={U.actions(onChange, U.getProps({value}))} />
)
```

Note that in case `onChange` is not given to the above component as a property
it causes no problem as `U.actions` does not attempt to call `undefined`.

Note that `U.actions` can also be used with actions given to the React `ref`
property.

##### <a id="u-preventdefault"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-preventDefault) [`U.preventDefault(event)`](#u-preventdefault)

`U.preventDefault` invokes the `preventDefault` method on the given object.

##### <a id="u-stoppropagation"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-stopPropagation) [`U.stopPropagation(event)`](#u-stoppropagation)

`U.stopPropagation` invokes the `stopPropagation` method on the given object.

#### <a id="class-names"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#class-names) [Class names](#class-names)

##### <a id="u-cns"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-cns) [`U.cns(...classNames)`](#u-cns)

`U.cns` is designed for creating a list of class names for the `className`
property.  It joins the truthy values from the arguments with a space.  In case
the result would be an empty string, `undefined` is returned instead.

For example:

```jsx
const Component = ({className}) => (
  <div className={U.cns(className, 'a-class-name', false, 'another-one', undefined)} />
)
```

#### <a id="interop"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#interop) [Interop](#interop)

##### <a id="u-pure"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-pure) [`U.pure(Component)`](#u-pure)

`U.pure` wraps the given component inside a
[`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent).
`U.pure` can be used for preventing unnecessary rerenders when a Karet component
is used as a child of a React component that rerenders its children even when
their props do not change.  See also [`U.toReact`](#u-toreact).

##### <a id="u-tokaret"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-toKaret) [`U.toKaret(ReactComponent)`](#u-tokaret)

`U.toKaret` converts a React component that takes plain value properties to a
Karet component that can be given observable properties.  `U.toKaret` is useful
when using React components, such as [React
Select](http://jedwatson.github.io/react-select/), as children of Karet
components and with observable rather than plain value properties.  `U.toKaret`
is a synonym for [`fromClass`](https://github.com/calmm-js/karet#fromClass) from
the [Karet](https://github.com/calmm-js/karet) library.

##### <a id="u-toreact"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-toReact) [`U.toReact(KaretComponent)`](#u-toreact)

`U.toReact` converts a Karet component that expects observable properties and
should not be rerendered unnecessarily into a React component that takes plain
value properties.  `U.toReact` may be needed particularly when a Karet component
is controlled by a higher-order React component, such as [React
Router](https://reacttraining.com/react-router/), because Karet components
typically (are not and) must not be rerendered unnecessarily.  `U.toReact` is
equivalent to [`U.toReactExcept(() => false)`](#u-toreactexcept).  See also
[`U.pure`](#u-pure).

##### <a id="u-toreactexcept"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-toReactExcept) [`U.toReactExcept(propName => boolean, KaretComponent)`](#u-toreactexcept)

`U.toReactExcept` converts a Karet component that expects observable properties
and should not be rerendered unnecessarily into a React component that takes
plain value properties.  The given predicate is used to determine which
properties must not be converted to observable properties.  Like
[`U.toReact`](#u-toreact), `U.toReactExcept` may be needed particularly when a
Karet component is controlled by a higher-order React component, such as [React
Router](https://reacttraining.com/react-router/), because Karet components
typically (are not and) must not be rerendered unnecessarily.  See the [Calmm
function to React class](https://codesandbox.io/s/kkx6zrzr35) CodeSandbox for an
example.

### <a id="kefir"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#kefir) [Kefir](#kefir)

#### <a id="algebras"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#algebras) [Algebras](#algebras)

##### <a id="u-identitylatest"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-IdentityLatest) [`U.IdentityLatest`](#u-identitylatest)

`U.IdentityLatest` is a Static Land compatible algebra module over properties,
like [`U.Latest`](#u-latest), or plain values.

##### <a id="u-latest"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-Latest) [`U.Latest`](#u-latest)

`U.Latest` is a Static Land compatible algebra module over properties from which
only the latest value is propagated.  Currently it implements the
[monad](https://github.com/rpominov/static-land/blob/master/docs/spec.md#monad)
algebra.

For example:

```js
log(
  L.traverse(
    U.Latest,
    x => U.startWith(undefined, U.later(x*1000, x)),
    L.elems,
    [1, 2, 3]
  )
)
```

#### <a id="conditionals"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#conditionals) [Conditionals](#conditionals)

##### <a id="u-and"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-and) [`U.and(...any)`](#u-and)

`U.and` is a lazy variadic logical and over potentially observable properties.
`U.and(l, r)` does not subscribe to `r` unless `l` is truthy.

##### <a id="u-cond"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-cond) [`U.cond(...[condition, consequent][, [alternative]])`](#u-cond)

`U.cond` allows one to express a sequence of conditionals.  `U.cond` translates
to a nested expression of [`U.ifElse`](#u-ifelse)s.

```jsx
U.cond( [ condition, consequent ]
      , ...
    [ , [ alternative ] ] )
```

The last `[ alternative ]`, which, when present, needs to be a singleton array,
is optional.

##### <a id="u-ifelse"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-ifElse) [`U.ifElse(condition, consequent, alternative)`](#u-ifelse)

`U.ifElse` is basically an implementation of the conditional operator `condition
? consequent : alternative` for observable properties.

`U.ifElse(condition, consequent, alternative)` is roughly shorthand for

```jsx
U.toProperty(
  U.flatMapLatest(boolean => (boolean ? consequent : alternative), condition)
)
```

except that the `consequent` and `alternative` expressions are only evaluated
once.

##### <a id="u-not"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-not) [`U.not(any)`](#u-not)

`U.not` is a logical negation over a potentially observable property.

##### <a id="u-or"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-or) [`U.or(...any)`](#u-or)

`U.or` is a lazy variadic logical or over potentially observable properties.
`U.or(l, r)` does not subscribe to `r` unless `l` is falsy.

##### <a id="u-unless"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-unless) [`U.unless(condition, alternative)`](#u-unless)

`U.unless(condition, alternative)` is shorthand for [`U.ifElse(condition,
undefined, alternative)`](#u-ifelse).

##### <a id="u-when"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-when) [`U.when(condition, consequent)`](#u-when)

`U.when(condition, consequent)` is shorthand for [`U.ifElse(condition,
consequent, undefined)`](#u-ifelse).

#### <a id="animation"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#animation) [Animation](#animation)

##### <a id="u-animationspan"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-animationSpan) [`U.animationSpan(milliseconds)`](#u-animationspan)

`U.animationSpan` creates a property of increasing values from 0 to 1 for the
given duration in milliseconds on each animation frame as generated by
[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

See the live [Animation](https://codesandbox.io/s/9ooox5695y) CodeSandbox for an
example.

#### <a id="lifting"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#lifting) [Lifting](#lifting)

##### <a id="u-combine"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-combine) [`U.combine([...any], fn)`](#u-combine)

`U.combine` is a special purpose [Kefir](https://kefirjs.github.io/kefir/)
observable property combinator designed for combining properties for a sink that
accepts both observable properties and constant values such as the Reactive VDOM
of [Karet](https://github.com/calmm-js/karet).

Unlike typical property combinators, when `U.combine` is invoked with only
constants (no properties), then the result is computed immediately and returned
as a plain value.  This optimization eliminates redundant properties.

The basic semantics of `U.combine` can be described as

```jsx
U.combine(xs, fn) === Kefir.combine(xs, fn).skipDuplicates(R.identical)
```

where [`Kefir.combine`](https://kefirjs.github.io/kefir/#combine) and
[`skipDuplicates`](https://kefirjs.github.io/kefir/#skip-duplicates) come from
Kefir and [`R.identical`](http://ramdajs.com/docs/#identical) from
[Ramda](http://ramdajs.com/).  Duplicates are skipped, because that can reduce
unnecessary updates.  Ramda's `R.identical` provides a semantics of equality
that works well within the context of embedding properties to VDOM.

Unlike with [`Kefir.combine`](https://kefirjs.github.io/kefir/#combine), any of
the argument `xs` given to `U.combine` is allowed to be
* a constant,
* a property, or
* a data structure of nested arrays and plain objects containing properties.

In other words, `U.combine` also provides functionality similar to
[`Bacon.combineTemplate`](https://github.com/baconjs/bacon.js#bacon-combinetemplate).

Note: `U.combine` is carefully optimized for space&mdash;if you write equivalent
combinations using Kefir's own operators, they will likely take more memory.

##### <a id="u-lift"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-lift) [`U.lift((...) => ...)`](#u-lift)

`U.lift` allows one to lift a function operating on plain values to a function
that operates both on plain values and on observable properties.  When given
only plain values, the resulting function returns a plain value.  When given
observable properties, the resulting function returns an observable property of
results.  See also [`U.liftRec`](#u-liftrec)

For example:

```jsx
const includes = U.lift( (xs, x) => xs.includes(x) )

const obsOfBooleans = includes(obsOfArrays, obsOfValues)
```

`U.lift` works well for simple functions that do not return functions.  If you
need to lift higher-order functions that return new functions that should also
be lifted, try [`U.liftRec`](#u-liftrec).

##### <a id="u-liftrec"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-liftRec) [`U.liftRec((...) => ...)`](#u-liftrec)

`U.liftRec` allows one to lift a function operating on plain values to a
function that operates both on plain values and on observable properties.  When
given only plain values, the resulting function returns a plain value.  When
given observable properties, the resulting function returns an observable
property of results.  See also [`U.lift`](#u-lift).

For example:

```jsx
const either = U.liftRec(R.either)
const equals = U.lift(R.equals)

const obsOfBooleans = either(R.equals(obs1), R.equals(obs2))
```

`U.liftRec` is designed to be very simple to use.  For example, the [Kefir
Ramda](https://github.com/calmm-js/kefir.ramda/blob/master/src/kefir.ramda.js)
library simply wraps every [Ramda](http://ramdajs.com/) function with `liftRec`
and this results in a library that has essentially the same signature (currying
and variable argument functions work the same) as Ramda except that the
functions also work on [Kefir](https://kefirjs.github.io/kefir/) observables.

#### <a id="curried-combinators"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#curried-combinators) [Curried combinators](#curried-combinators)

[Kefir](https://kefirjs.github.io/kefir/) is a traditional JavaScript library
that provides a fluent API using method chaining.  Karet Util supports more
functional style JavaScript by providing curried functions for programming with
Kefir.  The functions provided by Karet Util also try to avoid constructing
observables unnecessarily.

The following are simply links to the relevant
[Kefir](https://kefirjs.github.io/kefir/) documentation:

* [`U.changes(observable)` ⌘](https://kefirjs.github.io/kefir/#changes)
* [`U.debounce(ms, observable)` ⌘](https://kefirjs.github.io/kefir/#debounce)
* [`U.delay(ms, observable)` ⌘](https://kefirjs.github.io/kefir/#delay)
* [`U.flatMapErrors(value => observable, observable)` ⌘](https://kefirjs.github.io/kefir/#flat-map-errors)
* [`U.flatMapLatest(value => observable, observable)` ⌘](https://kefirjs.github.io/kefir/#flat-map-latest)
* [`U.flatMapParallel(value => observable, observable)` ⌘](https://kefirjs.github.io/kefir/#flat-map)
* [`U.flatMapSerial(value => observable, observable)` ⌘](https://kefirjs.github.io/kefir/#flat-map-concat)
* [`U.foldPast((state, value) => state, state, observable)` ⌘](https://kefirjs.github.io/kefir/#scan)
* [`U.fromEvents(target, eventName, transform)` ⌘](https://kefirjs.github.io/kefir/#from-event)
* [`U.ignoreErrors(observable)` ⌘](https://kefirjs.github.io/kefir/#ignore-errors)
* [`U.ignoreValues(observable)` ⌘](https://kefirjs.github.io/kefir/#ignore-values)
* [`U.interval(ms, value)` ⌘](https://kefirjs.github.io/kefir/#interval)
* [`U.later(ms, value)` ⌘](https://kefirjs.github.io/kefir/#later)
* [`U.mapValue(value => value, observable)` ⌘](https://kefirjs.github.io/kefir/#map)
* [`U.never` ⌘](https://kefirjs.github.io/kefir/#never) &mdash; Note that this is
  not a function!
* [`U.parallel([...observables])` ⌘](https://kefirjs.github.io/kefir/#merge)
* [`U.sampledBy(eventStream, property)` ⌘](https://kefirjs.github.io/kefir/#obs-sampled-by)
* [`U.serially([...observables])` ⌘](https://kefirjs.github.io/kefir/#concat)
* [`U.skipDuplicates(equality, observable)` ⌘](https://kefirjs.github.io/kefir/#skip-duplicates)
* [`U.skipFirst(number, observable)` ⌘](https://kefirjs.github.io/kefir/#skip)
* [`U.skipFirstErrors(n, observable)` ⌘](https://kefirjs.github.io/kefir/#skip-errors)
* [`U.skipUnless(predicate, observable)` ⌘](https://kefirjs.github.io/kefir/#filter)
* [`U.takeFirst(number, observable)` ⌘](https://kefirjs.github.io/kefir/#take)
* [`U.takeFirstErrors(number, observable)` ⌘](https://kefirjs.github.io/kefir/#take-errors)
* [`U.takeUntilBy(eventStream, observable)` ⌘](https://kefirjs.github.io/kefir/#take-until-by)
* [`U.throttle(ms, observable)` ⌘](https://kefirjs.github.io/kefir/#throttle)
* [`U.toObservable(observable)` ⌘](https://kefirjs.github.io/kefir/#constant)
* [`U.toProperty(observable)` ⌘](https://kefirjs.github.io/kefir/#to-property)

#### <a id="additional-combinators"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#additional-combinators) [Additional combinators](#additional-combinators)

##### <a id="u-consume"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-consume) [`U.consume(action, observable)`](#u-consume)

`U.consume` creates a property that simply immediately produces `undefined` and
subscribes to the given observable whose values it passes to the given action
for as long as the returned property is subscribed to.  `U.consume` can be used
for executing side-effects during the time that a component is mounted.  See
also [`U.sink`](#u-sink).

For example:

```jsx
const DocumentTitle = ({title}) => (
  <React.Fragment>
    {U.consume(title => {
      if (typeof document !== 'undefined') document.title = title
    }, title)}
  </React.Fragment>
)
```

##### <a id="u-endwith"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-endWith) [`U.endWith(value, observable)`](#u-endwith)

`U.endWith` creates an observable that ends with the given value.  That is,
after the given observable ends, the given value is emitted.

##### <a id="u-lazy"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-lazy) [`U.lazy(() => observable)`](#u-lazy)

`U.lazy` allows to create an observable lazily.

For example, one use case for `U.lazy` is to create cyclic observables:

```jsx
const sequence = ['⠋', '⠙', '⠸', '⠴', '⠦', '⠇']
const loop = () =>
  U.serially([U.serially(sequence.map(U.later(100))), U.lazy(loop)])
```

See the live [Login](https://codesandbox.io/s/2wov8r44r0) CodeSandbox for an
example.

##### <a id="u-frompromise"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-fromPromise) [`U.fromPromise(() => promise | {ready, abort})`](#u-frompromise)

`U.fromPromise` converts a thunk that returns a promise or an object of the
shape `{ready, abort}` where `ready` is a promise and `abort` is an action that
aborts the promise into a Kefir property.  The thunk is invoked once when the
property is subscribed to for the first time.  If an `abort` action is defined
and all subscriptions of the property are closed before the promise resolves,
the property is ended and the `abort` action is called once.

For example:

```jsx
const fetchJSON =
  typeof AbortController === 'undefined'
    ? (url, params = {}) =>
        U.fromPromise(() => fetch(url, params).then(res => res.json()))
    : (url, params = {}) =>
        U.fromPromise(() => {
          const controller = new AbortController()
          return {
            ready: fetch(url, {...params, signal: controller.signal}).then(
              res => res.json()
            ),
            abort() {
              controller.abort()
            }
          }
        })
```

See the live [GitHub search](https://codesandbox.io/s/wk51qz3kjl) CodeSandbox
for an example.

Note that `U.fromPromise` is not the same as Kefir's
[`fromPromise`](https://kefirjs.github.io/kefir/#from-promise).

##### <a id="u-sink"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-sink) [`U.sink(observable)`](#u-sink)

`U.sink` creates a property that simply immediately produces `undefined` and
subscribes to the given observable for as long as the returned sink is
subscribed to.  See also [`U.consume`](#u-consume).

##### <a id="u-skipidenticals"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-skipIdenticals) [`U.skipIdenticals(observable)`](#u-skipidenticals)

`U.skipIdenticals` is shorthand for
[`U.skipDuplicates(Object.is)`](https://kefirjs.github.io/kefir/#skip-duplicates).

##### <a id="u-skipwhen"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-skipWhen) [`U.skipWhen(predicate, observable)`](#u-skipwhen)

`U.skipWhen(predicate)` is shorthand for [`U.skipUnless(x =>
!predicate(x))`](https://kefirjs.github.io/kefir/#filter).

##### <a id="u-startwith"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-startWith) [`U.startWith(value, observable)`](#u-startwith)

`U.startWith` creates a property that starts with the given value.  It uses the
[`toProperty`](https://kefirjs.github.io/kefir/#to-property) method of Kefir.

##### <a id="u-template"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-template) [`U.template([ ... ] | { ... })`](#u-template)

`U.template` composes an observable property from an arbitrarily nested template
of objects and arrays observables.

For example:

```jsx
const abProperty = U.template({a: anObservable, b: anotherObservable})
abProperty instanceof Kefir.Observable // true
```

#### <a id="subscribing"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#subscribing) [Subscribing](#subscribing)

##### <a id="u-on"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#U-on) [`U.on({value, error, end}, observable)`](#u-on)

`U.on` subscribes to an observable and dispatches the events to the actions
specified in the template.

**Note** that explicitly subscribing to an observable should be done *very
rarely* in a Karet application!  Full Karet applications can be written with
zero uses of explicit observable subscriptions, because the Reactive VDOM of
[Karet](https://github.com/calmm-js/karet/) automatically subscribes to and
unsubscribes from observables.  Nevertheless, it can sometimes be convenient to
subscribe explicitly to observables to perform side-effects.

For example:

```jsx
U.thru(
  observable,
  ...,
  U.on({
    value: value = console.log(value)
  })
)
```

### <a id="lifted-standard-functions"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#lifted-standard-functions) [Lifted standard functions](#lifted-standard-functions)

Standard JavaScript functions only operate on plain values.  Karet Util provides
[lifted](#u-liftrec) versions of some useful standard JavaScript functions.  The
below just directly links to relevant documentation in MDN.

#### <a id="JSON"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#JSON) [JSON](#JSON)

* [`U.parse(string[, reviver])` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
* [`U.stringify(value[, replacer[, space]])` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

#### <a id="URIs"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#URIs) [URIs](#URIs)

* [`U.decodeURI(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)
* [`U.decodeURIComponent(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
* [`U.encodeURI(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
* [`U.encodeURIComponent(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)

#### <a id="Math"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#Math) [Math](#Math)

* [`U.abs(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs)
* [`U.acos(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acos)
* [`U.acosh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acosh)
* [`U.asin(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin)
* [`U.asinh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asinh)
* [`U.atan(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan)
* [`U.atanh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atanh)
* [`U.atan2(y, x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2)
* [`U.cbrt(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cbrt)
* [`U.ceil(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil)
* [`U.clz32(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32)
* [`U.cos(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos)
* [`U.cosh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cosh)
* [`U.exp(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/exp)
* [`U.expm1(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/expm1)
* [`U.floor(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)
* [`U.fround(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround)
* [`U.hypot(...xs)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot)
* [`U.imul(x, y)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul)
* [`U.log(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log)
* [`U.log1p(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log1p)
* [`U.log10(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10)
* [`U.log2(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2)
* [`U.max(...xs)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max)
* [`U.min(...xs)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min)
* [`U.pow(x, y)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)
* [`U.round(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round)
* [`U.sign(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign)
* [`U.sin(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin)
* [`U.sinh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sinh)
* [`U.sqrt(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)
* [`U.tan(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tan)
* [`U.tanh(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/tanh)
* [`U.trunc(x)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc)

#### <a id="String"></a> [≡](#contents) [▶](https://calmm-js.github.io/karet.util/index.html#String) [String](#String)

* [<code>U.string\`template string with observables\`</code> ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw)
