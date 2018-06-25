# <a id="karet-util"></a> [≡](#contents) Karet Util &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/karet.util.svg?style=social)](https://github.com/calmm-js/karet.util) [![npm](https://img.shields.io/npm/dm/karet.util.svg)](https://www.npmjs.com/package/karet.util)

A collection of utilities for working with
[Karet](https://github.com/calmm-js/karet).

[![npm version](https://badge.fury.io/js/karet.util.svg)](http://badge.fury.io/js/karet.util)
[![Build Status](https://travis-ci.org/calmm-js/karet.util.svg?branch=master)](https://travis-ci.org/calmm-js/karet.util)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/karet.util/master.svg)](https://codecov.io/github/calmm-js/karet.util?branch=master)
[![](https://david-dm.org/calmm-js/karet.util.svg)](https://david-dm.org/calmm-js/karet.util)
[![](https://david-dm.org/calmm-js/karet.util/dev-status.svg)](https://david-dm.org/calmm-js/karet.util?type=dev)

## <a id="contents"></a> [≡](#contents) Contents

* [Reference](#reference)
  * [About lifted functions](#about-lifted-functions)
  * [Debugging](#debugging)
    * [`U.show(...labels, any)`](#U-show)
  * [Atoms](#atoms)
    * [Creating atoms](#creating-atoms)
      * [`U.atom(value)`](#U-atom)
      * [`U.molecule([ ... ] | { ... })`](#U-molecule)
      * [`U.variable()`](#U-variable)
    * [Transactions](#transactions)
      * [`U.holding(() => { ... })`](#U-holding)
    * [Decomposing](#decomposing)
      * [`U.mapElems((elemAtom, index) => any, arrayAtom)`](#U-mapElems)
      * [`U.mapElemsWithIds(lensAtom, (elemAtom, id) => any, arrayAtom)`](#U-mapElemsWithIds)
      * [`U.view(lens, atom)`](#U-view)
    * [Side-effects on atoms](#side-effects-on-atoms)
      * [`U.set(atom, value)`](#U-set)
    * [Actions on atoms](#actions-on-atoms)
      * [`U.doModify(atom, mapper)`](#U-doModify)
      * [`U.doRemove(atom)`](#U-doRemove)
      * [`U.doSet(atom, value)`](#U-doSet)
  * [Bus](#bus)
    * [Creating buses](#creating-buses)
      * [`U.bus()`](#U-bus)
    * [Actions on buses](#actions-on-buses)
      * [`U.doEnd(bus)`](#U-doEnd)
      * [`U.doError(bus, error)`](#U-doError)
      * [`U.doPush(bus, value)`](#U-doPush)
  * [Convenience](#convenience)
    * [`U.scope((...) => ...)`](#U-scope)
    * ~~[`U.seq(any, ...fns)`](#U-seq)~~
    * ~~[`U.seqPartial(any, ...fns)`](#U-seqPartial)~~
    * [`U.tapPartial(action, any)`](#U-tapPartial)
    * [`U.thru(any, ...fns)`](#U-thru)
    * [`U.through(...fns)`](#U-through)
    * [`U.toPartial(fn)`](#U-toPartial)
  * [React helpers](#react-helpers)
    * ~~[Context](#context)~~
      * ~~[`<U.Context context={context} />`](#U-Context)~~
      * ~~[`U.withContext((props, context) => element)`](#U-withContext)~~
    * [Binding](#binding)
      * [`U.getProps({...propName: atom})`](#U-getProps)
      * [`U.setProps({...propName: observable})`](#U-setProps)
    * [Input components](#input-components)
      * [`<U.Input {...{value|checked}} />`](#U-Input)
      * [`<U.Select {...{value}} />`](#U-Select)
      * [`<U.TextArea {...{value}} />`](#U-TextArea)
    * [Refs](#refs)
      * [`U.refTo(variable)`](#U-refTo)
    * [Lifecycle](#lifcycle)
      * [`U.onUnmount(action)`](#U-onUnmount)
    * [Events](#events)
      * [`U.actions(...actions)`](#U-actions)
      * [`U.preventDefault(event)`](#U-preventDefault)
      * [`U.stopPropagation(event)`](#U-stopPropagation)
    * [Class names](#class-names)
      * [`U.cns(...classNames)`](#U-cns)
    * [Interop](#interop)
      * [`U.toKaret(ReactComponent)`](#U-toKaret)
      * [`U.toReact(KaretComponent)`](#U-toReact)
      * [`U.toReactExcept(propName => boolean, KaretComponent)`](#U-toReactExcept)
  * [Kefir](#kefir)
    * [Conditionals](#conditionals)
      * [`U.cond(...[condition, consequent][, [alternative]])`](#U-cond)
      * [`U.ifElse(condition, consequent, alternative)`](#U-ifElse)
      * [`U.unless(condition, alternative)`](#U-unless)
      * [`U.when(condition, consequent)`](#U-when)
    * [Animation](#animation)
      * [`U.animationSpan(milliseconds)`](#U-animationSpan)
    * [Lifting](#lifting)
      * [`U.combine([...any], fn)`](#U-combine)
      * ~~[`U.combines(...any, fn)`](#U-combines)~~
      * [`U.lift((...) => ...)`](#U-lift)
      * [`U.liftRec((...) => ...)`](#U-liftRec)
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
      * [`U.toProperty(observable)` ⌘](https://kefirjs.github.io/kefir/#to-property)
    * [Additional combinators](#additional-combinators)
      * [`U.consume(action, observable)`](#U-consume)
      * [`U.endWith(value, observable)`](#U-endWith)
      * [`U.fromPromise(() => promise | {ready, abort})`](#U-fromPromise)
      * [`U.lazy(() => observable)`](#U-lazy)
      * [`U.sink(observable)`](#U-sink)
      * [`U.skipIdenticals(observable)`](#U-skipIdenticals)
      * [`U.skipWhen(predicate, observable)`](#U-skipWhen)
      * [`U.startWith(value, observable)`](#U-startWith)
      * [`U.template([ ... ] | { ... })`](#U-template)
    * [Subscribing](#subscribing)
      * [`U.on({value, error, end}, observable)`](#U-on)
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

## <a id="reference"></a> [≡](#contents) Reference

This library provides a large number of named exports.  Typically one just
imports the library as:

```js
import * as U from 'karet.util'
```

### <a id="about-lifted-functions"></a> [≡](#contents) About lifted functions

Many of the functions in this library are [*lifted*](#U-liftRec) so that they
accept both ordinary values and observables as inputs.  When such functions are
given only ordinary values as inputs, they return immediately with the result
value.  OTOH, when such a function is given at least an observable as an input,
they return an observable of results.

### <a id="debugging"></a> [≡](#contents) [Debugging](#debugging)

#### <a id="U-show"></a> [≡](#contents) [`U.show(...labels, any)`](#U-show)

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

### <a id="atoms"></a> [≡](#contents) [Atoms](#atoms)

#### <a id="creating-atoms"></a> [≡](#contents) [Creating atoms](#creating-atoms)

##### <a id="U-atom"></a> [≡](#contents) [`U.atom(value)`](#U-atom)

`U.atom` creates a new atom with the given initial value.

For example:

```js
const notEmpty = U.atom('initial')
notEmpty.get()
// 'initial'
notEmpty.log()
// [property] <value:current> initial
```

##### <a id="U-molecule"></a> [≡](#contents) [`U.molecule([ ... ] | { ... })`](#U-molecule)

`U.molecule` composes an atom from a template of atoms.

For example:

```js
const xyA = U.atom({x: 1, y: 2})
const xL = U.view('x', xyA)
const yL = U.view('y', xyA)
const xyM = U.molecule({x: xL, y: yL})
```

When read, either as a property or via `get`, the atoms in the template are
replaced by their values:

```js
R.equals( xyM.get(), xyA.get() )
// true
```

When written to, the atoms in the template are written to with matching elements
from the written value:

```js
xyM.modify(L.set('x', 3))
xL.get()
// 3
yL.get()
// 2
```

The writes are performed holding event propagation.

It is considered an error, and the effect is unpredictable, if the written value
does not match the template, aside from the positions of abstract mutables, of
course, which means that write operations, `set`, `remove`, and `modify`, on
molecules and lensed atoms created from molecules are only partial.

Also, if the template contains multiple abstract mutables that correspond to the
same underlying state, then writing through the template will give unpredictable
results.

##### <a id="U-variable"></a> [≡](#contents) [`U.variable()`](#U-variable)

`U.variable` creates a new atom without an initial value.  See also
[`U.refTo`](#U-refTo).

For example:

```js
const empty = U.variable()
empty.get()
// undefined
empty.log()
empty.set('first')
// [property] <value> first
```

#### <a id="transactions"></a> [≡](#contents) [Transactions](#transactions)

##### <a id="U-holding"></a> [≡](#contents) [`U.holding(() => { ... })`](#U-holding)

`U.holding` is given a thunk to call while holding the propagation of events
from changes to atoms. The thunk can `get`, `set`, `remove` and `modify` any
number of atoms.  After the thunk returns, persisting changes to atoms are
propagated. For example:

```js
const xy = U.atom({x: 1, y: 2})
const x = U.view('x', xy)
const y = U.view('y', xy)
x.log('x')
// x <value:current> 1
y.log('y')
// y <value:current> 2
U.holding(() => {
  xy.set({x: 2, y: 1})
  x.set(x.get() - 1)
})
// y <value> 1
```

#### <a id="decomposing"></a> [≡](#contents) [Decomposing](#decomposing)

##### <a id="U-mapElems"></a> [≡](#contents) [`U.mapElems((elemAtom, index) => any, arrayAtom)`](#U-mapElems)

`U.mapElems` performs a cached incremental map over state containing an array of
values.  On changes, the mapping function is only called for elements that were
not in the state previously.  `U.mapElems` can be used for rendering a list of
*stateless components*, however, if elements in the array have unique ids, then
[`U.mapElemsWithIds`](#U-mapElemsWithIds) is generally preferable.

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

##### <a id="U-mapElemsWithIds"></a> [≡](#contents) [`U.mapElemsWithIds(idLens, (elemAtom, id) => any, arrayAtom)`](#U-mapElemsWithIds)

`U.mapElemsWithIds` performs a cached incremental map over state containing an
array of values with unique ids.  On changes, the mapping function is only
called for elements that were not in the state previously.  `U.mapElemsWithIds`
is particularly designed for rendering a list of potentially *stateful
components* efficiently.  See also [`U.mapElems`](#U-mapElems).

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

##### <a id="U-view"></a> [≡](#contents) [`U.view(lens, atom)`](#U-view)

`U.view` creates a read-write view with the given lens from the given original
atom.  The lens may also be an observable producing lenses.  Modifications to
the lensed atom are reflected in the original atom and vice verse.

For example:

```js
const root = U.atom({x: 1})
const x = U.view('x', root)
x.set(2)
root.get()
// { x: 2 }
root.set({x: 3})
x.get()
// 3
```

One of the key ideas that makes lensed atoms work is [the compositionality of
partial lenses](https://github.com/calmm-js/partial.lenses/#L-compose).  Those
equations make it possible not just to create lenses via composition (left hand
sides of equations), but also to create paths of lensed atoms (right hand sides
of equations).  More concretely, both the `c` in

```js
const b = U.view(a_to_b_PLens, a)
const c = U.view(b_to_c_PLens, b)
```

and in

```js
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

#### <a id="side-effects-on-atoms"></a> [≡](#contents) [Side-effects on atoms](#side-effects-on-atoms)

##### <a id="U-set"></a> [≡](#contents) [`U.set(atom, value)`](#U-set)

`U.set` sets the given value to the specified atom.  In case the value is
actually an observable, `U.set` returns a [sink](#U-sink) that sets any values
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

#### <a id="actions-on-atoms"></a> [≡](#contents) [Actions on atoms](#actions-on-atoms)

##### <a id="U-doModify"></a> [≡](#contents) [`U.doModify(atom, mapper)`](#U-doModify)

`U.doModify` creates an action that invokes the `modify` method on the given
atom with the given mapping function.

##### <a id="U-doRemove"></a> [≡](#contents) [`U.doRemove(atom)`](#U-doRemove)

`U.doRemove` creates an action that invokes the `remove` method on the given
atom.

##### <a id="U-doSet"></a> [≡](#contents) [`U.doSet(atom, value)`](#U-doSet)

`U.doSet` creates an action that invokes the `set` method on the given atom with
the given value.

### <a id="bus"></a> [≡](#contents) [Bus](#bus)

#### <a id="creating-buses"></a> [≡](#contents) [Creating buses](#creating-buses)

##### <a id="U-bus"></a> [≡](#contents) [`U.bus()`](#U-bus)

`U.bus()` creates a new observable `Bus` stream.  A `Bus` stream has the
following methods:

* `bus.push(value)` to explicitly emit value `value`,
* `bus.error(error)` to explicitly emit error `error`, and
* `bus.end()` to explicitly end the stream after which all the methods do
  nothing.

Note that buses and event streams, in general, are fairly rarely used in Calmm.
They can be useful for performing IO actions and in cases where actions from UI
controls need to be throttled or combined.

See the live [Counter using Event Streams](https://codesandbox.io/s/1840p9xo9l)
CodeSandbox for an example.

#### <a id="actions-on-buses"></a> [≡](#contents) [Actions on buses](#actions-on-buses)

##### <a id="U-doEnd"></a> [≡](#contents) [`U.doEnd(bus)`](#U-doEnd)

`U.doEnd` creates an action that invokes the `end` method on the given bus.

##### <a id="U-doError"></a> [≡](#contents) [`U.doError(bus, error)`](#U-doError)

`U.doError` creates an action that invokes the `error` method on the given bus
with the given value.

##### <a id="U-doPush"></a> [≡](#contents) [`U.doPush(bus, value)`](#U-doPush)

`U.doPush` creates an action that invokes the `push` method on the given bus
with the given value.

### <a id="convenience"></a> [≡](#contents) [Convenience](#convenience)

#### <a id="U-scope"></a> [≡](#contents) [`U.scope((...) => ...)`](#U-scope)

`U.scope` simply calls the given thunk.  IOW, `U.scope(fn)` is equivalent to
`(fn)()`.  You can use it to create a new scope at expression level.

For example:

```js
U.scope((x = 1, y = 2) => x + y)
// 3
```

#### <a id="U-seq"></a> [≡](#contents) ~~[`U.seq(any, ...fns)`](#U-seq)~~

**WARNING: `U.seq` has been obsoleted.  Use [`U.thru`](#U-thru) instead.**

`U.seq` allows one to pipe a value through a sequence of functions.  In other
words, `U.seq(x, fn_1, ..., fn_N)` is roughly equivalent to `fn_N( ... fn_1(x)
... )`.  It serves a similar purpose as the
[`->>`](https://clojuredocs.org/clojure.core/-%3E%3E) macro of Clojure or the
`|>` operator of
[F#](https://blogs.msdn.microsoft.com/dsyme/2011/05/17/archeological-semiotics-the-birth-of-the-pipeline-symbol-1994/)
and [Elm](http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#|>),
for example, or the
[`>|`](http://comp.lang.functional.narkive.com/zZJZg20r/a-family-of-function-application-operators-for-standard-ml)
operator defined in a Usenet post by some rando.  See also [`U.thru`](#U-thru).

For example:

```js
U.seq(1, x => x + 1, x => -x)
// -2
```

A common technique in JavaScript is to use method chaining: `x.fn_1().fn_2()`.
A problem with method chaining is that it requires having objects with methods.
Sometimes you may need to manipulate values that are not objects, like `null`
and `undefined`, and other times you may want to use functions that are not
directly provided as methods and it may not be desirable to [monkey
patch](https://en.wikipedia.org/wiki/Monkey_patch#Pitfalls) such methods.

`U.seq` is designed to work with partially applied
[curried](https://en.wikipedia.org/wiki/Currying) functions that take the <a
href="https://en.wikipedia.org/wiki/Object_(grammar)">object</a> as their last
argument and can be seen as providing a flexible alternative to method chaining.

#### <a id="U-seqPartial"></a> [≡](#contents) ~~[`U.seqPartial(any, ...fns)`](#U-seqPartial)~~

**WARNING: `seqPartial` has been deprecated.  There is no replacement for it.**

`U.seqPartial` allows one to pipe a value through a sequence of function in such
a way that if the value becomes `undefined` the process is stopped and
`undefined` is returned without calling the remaining functions.

#### <a id="U-tapPartial"></a> [≡](#contents) [`U.tapPartial(action, any)`](#U-tapPartial)

`U.tapPartial` is a [lifted](#U-liftRec) partial
[tap](http://ramdajs.com/docs/#tap) function.  The given action is called for
values flowing through except when the value is `undefined`.

For example:

```js
U.thru(
  observable,
  ...
  U.tap(value => console.log(value)),
  ...
)
```

#### <a id="U-thru"></a> [≡](#contents) [`U.thru(any, ...fns)`](#U-thru)

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
[`U.through`](#U-through).

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

#### <a id="U-through"></a> [≡](#contents) [`U.through(...fns)`](#U-through)

`U.through` allows one to compose a function that passes its single argument
through all of the given functions from left to right.  In other words,
`U.through(fn_1, ..., fn_N)(x)` is roughly equivalent to `fn_N( ... fn_1(x)
... )`.  It serves a similar purpose as
[`R.pipe`](http://ramdajs.com/docs/#pipe), but has been crafted to work with
[lifted](#lifting) functions.  See also [`U.thru`](#U-thru).

For example:

```js
U.through(x => x + 1, x => -x)(1)
// -2
```

#### <a id="U-toPartial"></a> [≡](#contents) [`U.toPartial(fn)`](#U-toPartial)

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

### <a id="react-helpers"></a> [≡](#contents) [React helpers](#react-helpers)

#### <a id="context"></a> [≡](#contents) ~~[Context](#context)~~

##### <a id="U-Context"></a> [≡](#contents) ~~[`<U.Context context={context} />`](#U-Context)~~

**WARNING: `U.Context` has been obsoleted. Just use the new [React context
API](https://reactjs.org/docs/context.html).**

`U.Context` is a component that allows one to set the context for child
components.  See also [`U.withContext`](#U-withContext).

Usually the context should be an object with the desired properties.  Also, in
Calmm, the values are usually observable properties.

For example:

```jsx
<U.Context context={{language: U.atom('fi')}}/>
  <Page />
<U.Context/>
```

##### <a id="U-withContext"></a> [≡](#contents) ~~[`U.withContext((props, context) => element)`](#U-withContext)~~

**WARNING: `U.withContext` has been obsoleted. Just use the new [React context
API](https://reactjs.org/docs/context.html).**

`U.withContext` creates a component that takes both the props and the context as
parameters.  See also [`U.Context`](#U-Context).

For example:

```jsx
const Text = U.withContext(({children: text}, {language}) => (
  <span>{translate(language, text)}</span>
)
```

#### <a id="binding"></a> [≡](#contents) [Binding](#binding)

##### <a id="U-getProps"></a> [≡](#contents) [`U.getProps({...propName: atom})`](#U-getProps)

`U.getProps` returns an event callback that gets the values of the properties
named in the given template from the event target and sets them to the atoms
that are the values of the properties.

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

##### <a id="U-setProps"></a> [≡](#contents) [`U.setProps({...propName: observable})`](#U-setProps)

`U.setProps` returns a callback designed to be used with `ref` that subscribes
to observables in the given template and copies values from the observables to
the named properties in the DOM element.  This allows one to bind to DOM
properties such as scroll position that are not HTML attributes.  See also
[`U.actions`](#U-actions).

See the live [Scroll](https://codesandbox.io/s/w6lpz5m9n7) CodeSandbox for an
example.

#### <a id="input-components"></a> [≡](#contents) [Input components](#input-components)

##### <a id="U-Input"></a> [≡](#contents) [`<U.Input {...{value|checked}} />`](#U-Input)

`U.Input` is a wrapper for an `input` element that binds either
[`onChange={U.getProps({value})}`](#U-getProps) or
[`onChange={U.getProps({checked})}`](#U-getProps) when either `value` or
`checked` is a defined property.

For example:

```jsx
const checked = U.atom(false)
// ...
<U.Input type="checkbox" checked={checked} />
```

##### <a id="U-Select"></a> [≡](#contents) [`<U.Select {...{value}} />`](#U-Select)

`U.Select` is a wrapper for a `select` element that binds
[`onChange={U.getProps({value})}`](#U-getProps) when `value` is a defined
property.

For example:

```jsx
const value = U.atom('')
// ...
<U.Select value={value} />
```

##### <a id="U-TextArea"></a> [≡](#contents) [`<U.TextArea {...{value}} />`](#U-TextArea)

`U.TextArea` is a wrapper for a `textarea` element that binds
[`onChange={U.getProps({value})}`](#U-getProps) when `value` is a defined
property.

For example:

```jsx
const value = U.atom('')
// ...
<U.TextArea value={value} />
```

#### <a id="refs"></a> [≡](#contents) [Refs](#refs)

##### <a id="U-refTo"></a> [≡](#contents) [`U.refTo(variable)`](#U-refTo)

`U.refTo` is designed for getting a reference to the DOM element of a component.
See also [`U.variable`](#U-variable).  See also [`U.actions`](#U-actions).

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
skipping `null` and using an initially empty [variable](#U-variable) rather than
an [atom](#U-atom) is that once the variable emits a value, you can be sure that
it refers to a DOM element.

Note than in case you also want to observe `null` values, you can use
[`U.set`](#U-set) instead of `U.refTo`:

```jsx
const Component = ({dom = U.variable()}) => (
  <div ref={U.set(dom)}>
    ...
  </div>
)
```

#### <a id="lifecycle"></a> [≡](#contents) [Lifecycle](#lifcycle)

##### <a id="U-onUnmount"></a> [≡](#contents) [`U.onUnmount(action)`](#U-onUnmount)

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

#### <a id="events"></a> [≡](#contents) [Events](#events)

##### <a id="U-actions"></a> [≡](#contents) [`U.actions(...actions)`](#U-actions)

`U.actions` is designed for creating an action from multiple actions.  It
returns an unary action function that calls the functions in the arguments with
the same argument.

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

##### <a id="U-preventDefault"></a> [≡](#contents) [`U.preventDefault(event)`](#U-preventDefault)

`U.preventDefault` invokes the `preventDefault` method on the given object.

##### <a id="U-stopPropagation"></a> [≡](#contents) [`U.stopPropagation(event)`](#U-stopPropagation)

`U.stopPropagation` invokes the `stopPropagation` method on the given object.

#### <a id="class-names"></a> [≡](#contents) [Class names](#class-names)

##### <a id="U-cns"></a> [≡](#contents) [`U.cns(...classNames)`](#U-cns)

`U.cns` is designed for creating a list of class names for the `className`
property.  It joins the truthy values from the arguments with a space.  In case
the result would be an empty string, `undefined` is returned instead.

For example:

```jsx
const Component = ({className}) => (
  <div className={U.cns(className, 'a-class-name', false, 'another-one', undefined)} />
)
```

#### <a id="interop"></a> [≡](#contents) [Interop](#interop)

##### <a id="U-toKaret"></a> [≡](#contents) [`U.toKaret(ReactComponent)`](#U-toKaret)

`U.toKaret` converts a React component that takes plain value properties to a
Karet component that can be given observable properties.  `U.toKaret` is useful
when using React components, such as [React
Select](http://jedwatson.github.io/react-select/), as children of Karet
components and with observable rather than plain value properties.  `U.toKaret`
is a synonym for [`fromClass`](https://github.com/calmm-js/karet#fromClass) from
the [Karet](https://github.com/calmm-js/karet) library.

##### <a id="U-toReact"></a> [≡](#contents) [`U.toReact(KaretComponent)`](#U-toReact)

`U.toReact` converts a Karet component that expects observable properties and
should not be rerendered unnecessarily into a React component that takes plain
value properties.  `U.toReact` may be needed particularly when a Karet component
is controlled by a higher-order React component, such as [React
Router](https://reacttraining.com/react-router/), because Karet components
typically (are not and) must not be rerendered unnecessarily.  `U.toReact` is
equivalent to [`U.toReactExcept(() => false)`](#U-toReactExcept).

##### <a id="U-toReactExcept"></a> [≡](#contents) [`U.toReactExcept(propName => boolean, KaretComponent)`](#U-toReactExcept)

`U.toReactExcept` converts a Karet component that expects observable properties
and should not be rerendered unnecessarily into a React component that takes
plain value properties.  The given predicate is used to determine which
properties must not be converted to observable properties.  Like
[`U.toReact`](#U-toReact), `U.toReactExcept` may be needed particularly when a
Karet component is controlled by a higher-order React component, such as [React
Router](https://reacttraining.com/react-router/), because Karet components
typically (are not and) must not be rerendered unnecessarily.  See the [Calmm
function to React class](https://codesandbox.io/s/kkx6zrzr35) CodeSandbox for an
example.

### <a id="kefir"></a> [≡](#contents) [Kefir](#kefir)

#### <a id="conditionals"></a> [≡](#contents) [Conditionals](#conditionals)

##### <a id="U-cond"></a> [≡](#contents) [`U.cond(...[condition, consequent][, [alternative]])`](#U-cond)

`U.cond` allows one to express a sequence of conditionals.  `U.cond` translates
to a nested expression of [`U.ifElse`](#U-ifElse)s.

```js
U.cond( [ condition, consequent ]
      , ...
    [ , [ alternative ] ] )
```

The last `[ alternative ]`, which, when present, needs to be a singleton array,
is optional.

##### <a id="U-ifElse"></a> [≡](#contents) [`U.ifElse(condition, consequent, alternative)`](#U-ifElse)

`U.ifElse` is basically an implementation of the conditional operator `condition
? consequent : alternative` for observable properties.

`U.ifElse(condition, consequent, alternative)` is roughly shorthand for

```js
U.toProperty(
  U.flatMapLatest(boolean => (boolean ? consequent : alternative), condition)
)
```

except that the `consequent` and `alternative` expressions are only evaluated
once.

##### <a id="U-unless"></a> [≡](#contents) [`U.unless(condition, alternative)`](#U-unless)

`U.unless(condition, alternative)` is shorthand for [`U.ifElse(condition,
undefined, alternative)`](#U-ifElse).

##### <a id="U-when"></a> [≡](#contents) [`U.when(condition, consequent)`](#U-when)

`U.when(condition, consequent)` is shorthand for [`U.ifElse(condition,
consequent, undefined)`](#U-ifElse).

#### <a id="animation"></a> [≡](#contents) [Animation](#animation)

##### <a id="U-animationSpan"></a> [≡](#contents) [`U.animationSpan(milliseconds)`](#U-animationSpan)

`U.animationSpan` creates a property of increasing values from 0 to 1 for the
given duration in milliseconds on each animation frame as generated by
[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

See the live [Animation](https://codesandbox.io/s/9ooox5695y) CodeSandbox for an
example.

#### <a id="lifting"></a> [≡](#contents) [Lifting](#lifting)

##### <a id="U-combine"></a> [≡](#contents) [`U.combine([...any], fn)`](#U-combine)

`U.combine` is a special purpose [Kefir](https://kefirjs.github.io/kefir/)
observable property combinator designed for combining properties for a sink that
accepts both observable properties and constant values such as the Reactive VDOM
of [Karet](https://github.com/calmm-js/karet).

Unlike typical property combinators, when `U.combine` is invoked with only
constants (no properties), then the result is computed immediately and returned
as a plain value.  This optimization eliminates redundant properties.

The basic semantics of `U.combine` can be described as

```js
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

##### <a id="U-combines"></a> [≡](#contents) ~~[`U.combines(...any[, fn])`](#U-combines)~~

**WARNING: `combines` has been obsoleted.  Please use [`U.combine`](#U-combine),
[`U.template`](#U-template), [`U.lift`](U-lift), or [`U.liftRec`](#U-liftRec)
instead.**

`U.combines` is a special purpose [Kefir](https://kefirjs.github.io/kefir/)
observable combinator designed for combining properties for a sink that accepts
both observables and constant values such as the Reactive VDOM of
[Karet](https://github.com/calmm-js/karet).

Unlike typical observable combinators, when `U.combines` is invoked with only
constants (no observables), then the result is computed immediately and returned
as a plain value.  This optimization eliminates redundant observables.

The basic semantics of `U.combines` can be described as

```js
U.combines(...xs, fn) === Kefir.combine(xs, fn).skipDuplicates(R.identical)
```

where [`Kefir.combine`](https://kefirjs.github.io/kefir/#combine) and
[`skipDuplicates`](https://kefirjs.github.io/kefir/#skip-duplicates) come from
Kefir and [`R.identical`](http://ramdajs.com/docs/#identical) from
[Ramda](http://ramdajs.com/).  Duplicates are skipped, because that can reduce
unnecessary updates.  Ramda's `R.identical` provides a semantics of equality
that works well within the context of embedding properties to VDOM.

Unlike with [`Kefir.combine`](https://kefirjs.github.io/kefir/#combine), any
argument of `U.combines` is allowed to be
* a constant,
* an observable (including the combiner function), or
* an array or object containing observables.

In other words, `U.combines` also provides functionality similar to
[`Bacon.combineTemplate`](https://github.com/baconjs/bacon.js#bacon-combinetemplate).

Note: `U.combines` is carefully optimized for space&mdash;if you write
equivalent combinations using Kefir's own operators, they will likely take more
memory.

##### <a id="U-lift"></a> [≡](#contents) [`U.lift((...) => ...)`](#U-lift)

`U.lift` allows one to lift a function operating on plain values to a function
that operates both on plain values and on observable properties.  When given
only plain values, the resulting function returns a plain value.  When given
observable properties, the resulting function returns an observable property of
results.  See also [`U.liftRec`](#U-liftRec)

For example:

```js
const includes = U.lift( (xs, x) => xs.includes(x) )

const obsOfBooleans = includes(obsOfArrays, obsOfValues)
```

`U.lift` works well for simple functions that do not return functions.  If you
need to lift higher-order functions that return new functions that should also
be lifted, try [`U.liftRec`](#U-liftRec).

##### <a id="U-liftRec"></a> [≡](#contents) [`U.liftRec((...) => ...)`](#U-liftRec)

`U.liftRec` allows one to lift a function operating on plain values to a
function that operates both on plain values and on observable properties.  When
given only plain values, the resulting function returns a plain value.  When
given observable properties, the resulting function returns an observable
property of results.  See also [`U.lift`](#U-lift).

For example:

```js
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

#### <a id="curried-combinators"></a> [≡](#contents) [Curried combinators](#curried-combinators)

[Kefir](https://kefirjs.github.io/kefir/) is a traditional JavaScript library
that provides a fluent API using method chaining.  Karet Util supports more
functional style JavaScript by providing curried functions for programming with
Kefir.

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
* [`U.toProperty(observable)` ⌘](https://kefirjs.github.io/kefir/#to-property)

#### <a id="additional-combinators"></a> [≡](#contents) [Additional combinators](#additional-combinators)

##### <a id="U-consume"></a> [≡](#contents) [`U.consume(action, observable)`](#U-consume)

`U.consume` creates a property that simply immediately produces `undefined` and
subscribes to the given observable whose values it passes to the given action
for as long as the returned property is subscribed to.  See also
[`U.sink`](#U-sink).

##### <a id="U-endWith"></a> [≡](#contents) [`U.endWith(value, observable)`](#U-endWith)

`U.endWith` creates an observable that ends with the given value.  That is,
after the given observable ends, the given value is emitted.

##### <a id="U-lazy"></a> [≡](#contents) [`U.lazy(() => observable)`](#U-lazy)

`U.lazy` allows to create an observable lazily.

For example, one use case for `U.lazy` is to create cyclic observables:

```js
const sequence = ['⠋', '⠙', '⠸', '⠴', '⠦', '⠇']
const loop = () =>
  U.serially([U.serially(sequence.map(U.later(100))), U.lazy(loop)])
```

See the live [Login](https://codesandbox.io/s/2wov8r44r0) CodeSandbox for an
example.

##### <a id="U-fromPromise"></a> [≡](#contents) [`U.fromPromise(() => promise | {ready, abort})`](#U-fromPromise)

`U.fromPromise` converts a thunk that returns a promise or an object of the
shape `{ready, abort}` where `ready` is a promise and `abort` is an action that
aborts the promise into a Kefir property.  The thunk is invoked once when the
property is subscribed to for the first time.  If an `abort` action is defined
and all subscriptions of the property are closed before the promise resolves,
the property is ended and the `abort` action is called once.

For example:

```js
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

##### <a id="U-sink"></a> [≡](#contents) [`U.sink(observable)`](#U-sink)

`U.sink` creates a property that simply immediately produces `undefined` and
subscribes to the given observable for as long as the returned sink is
subscribed to.  See also [`U.consume`](#U-consume).

##### <a id="U-skipIdenticals"></a> [≡](#contents) [`U.skipIdenticals(observable)`](#U-skipIdenticals)

`U.skipIdenticals` is shorthand for
[`U.skipDuplicates(Object.is)`](https://kefirjs.github.io/kefir/#skip-duplicates).

##### <a id="U-skipWhen"></a> [≡](#contents) [`U.skipWhen(predicate, observable)`](#U-skipWhen)

`U.skipWhen(predicate)` is shorthand for [`U.skipUnless(x =>
!predicate(x))`](https://kefirjs.github.io/kefir/#filter).

##### <a id="U-startWith"></a> [≡](#contents) [`U.startWith(value, observable)`](#U-startWith)

`U.startWith` creates a property that starts with the given value.  It uses the
[`toProperty`](https://kefirjs.github.io/kefir/#to-property) method of Kefir.

##### <a id="U-template"></a> [≡](#contents) [`U.template([ ... ] | { ... })`](#U-template)

`U.template` composes an observable property from an arbitrarily nested template
of objects and arrays observables.

For example:

```js
const abProperty = U.template({a: anObservable, b: anotherObservable})
abProperty instanceof Kefir.Observable
// true
```

#### <a id="subscribing"></a> [≡](#contents) [Subscribing](#subscribing)

##### <a id="U-on"></a> [≡](#contents) [`U.on({value, error, end}, observable)`](#U-on)

`U.on` subscribes to an observable and dispatches the events to the actions
specified in the template.

**Note** that explicitly subscribing to an observable should be done *very
rarely* in a Calmm application!  Full Calmm applications can be written with
zero uses of explicit observable subscriptions, because the Reactive VDOM of
[Karet](https://github.com/calmm-js/karet/) automatically subscribes to and
unsubscribes from observables.  Nevertheless, it can sometimes be convenient to
subscribe explicitly to observables to perform side-effects.

For example:

```js
U.thru(
  observable,
  ...,
  U.on({
    value: value = console.log(value)
  })
)
```

### <a id="lifted-standard-functions"></a> [≡](#contents) [Lifted standard functions](#lifted-standard-functions)

Standard JavaScript functions only operate on plain values.  Karet Util provides
[lifted](#U-liftRec) versions of some useful standard JavaScript functions.  The
below just directly links to relevant documentation in MDN.

#### <a id="JSON"></a> [≡](#contents) [JSON](#JSON)

* [`U.parse(string[, reviver])` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
* [`U.stringify(value[, replacer[, space]])` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

#### <a id="URIs"></a> [≡](#contents) [URIs](#URIs)

* [`U.decodeURI(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)
* [`U.decodeURIComponent(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent)
* [`U.encodeURI(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)
* [`U.encodeURIComponent(string)` ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)

#### <a id="Math"></a> [≡](#contents) [Math](#Math)

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

#### <a id="String"></a> [≡](#contents) [String](#String)

* [<code>U.string\`template string with observables\`</code> ⌘](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw)
