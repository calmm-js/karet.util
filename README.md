# <a id="karet-util"></a> Karet Util &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/karet.util.svg?style=social)](https://github.com/calmm-js/karet.util)

A collection of experimental utilities for working with
[Karet](https://github.com/calmm-js/karet).

[![npm version](https://badge.fury.io/js/karet.util.svg)](http://badge.fury.io/js/karet.util)
[![Build Status](https://travis-ci.org/calmm-js/karet.util.svg?branch=master)](https://travis-ci.org/calmm-js/karet.util)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/karet.util/master.svg)](https://codecov.io/github/calmm-js/karet.util?branch=master)
[![](https://david-dm.org/calmm-js/karet.util.svg)](https://david-dm.org/calmm-js/karet.util)
[![](https://david-dm.org/calmm-js/karet.util/dev-status.svg)](https://david-dm.org/calmm-js/karet.util?type=dev)

## Contents

## Reference

### Misc

#### [≡](#contents) `U.seq(x, ...fns)`
#### [≡](#contents) `U.seqPartial(x, ...fns)`
#### [≡](#contents) `U.scope(() => ...)`

#### [≡](#contents) `U.toPartial(totalFn)`

#### [≡](#contents) `U.show(x) ~> x`

#### [≡](#contents) `U.refTo(settable)(value or null)`

#### [≡](#contents) `U.getProps({prop: settable, ...})`
#### [≡](#contents) `U.setProps({prop: observable, ...})`
#### [≡](#contents) `U.bindProps({ref: eventName, prop: settable, ...})`
#### [≡](#contents) `U.bind({prop: settable, ...})`

#### [≡](#contents) `K`
#### [≡](#contents) `U.template(template of observables)`
#### [≡](#contents) `U.string`
#### [≡](#contents) `U.lift`

#### [≡](#contents) `U.ift(condition, consequent)`
#### [≡](#contents) `U.ifte(condition, consequent, alternative)`

#### [≡](#contents) `U.actions(...maybeFns)`

#### [≡](#contents) `U.mapCached(x => ..., array)`
#### [≡](#contents) `U.mapIndexed((x, i) => ..., array)`
#### [≡](#contents) `U.indices(array)`

### Atom
#### [≡](#contents) `U.atom(value)`
#### [≡](#contents) `U.variable()`
#### [≡](#contents) `U.molecule(template)`
#### [≡](#contents) `U.holding(() => ...)`
#### [≡](#contents) `U.view(lens, value)`
#### [≡](#contents) `U.set(settable, value)`

### Karet
#### [≡](#contents) `U.fromKefir()`

### Context
#### [≡](#contents) `U.Context`
#### [≡](#contents) `U.withContext`
#### [≡](#contents) `U.WithContext`

### Kefir

Kefir operations in curried form.

#### [≡](#contents) `U.debounce(milliseconds, observable or constant) ~> observable`
#### [≡](#contents) `U.changes(observable) ~> observable`
#### [≡](#contents) `U.serially([...observables or constants]) ~> observable`
#### [≡](#contents) `U.parallel([...observables or constants]) ~> observable`
#### [≡](#contents) `U.delay(milliseconds, observable or constant) ~> observable`
#### [≡](#contents) `U.endWith(value, observable or constant) ~> observable`
#### [≡](#contents) `U.flatMapSerial(value => observable or constant, observable or constant) ~> observable`
#### [≡](#contents) `U.flatMapErrors(error => observable or constant, observable or constant) ~> observable`
#### [≡](#contents) `U.flatMapLatest(value => observable or constant, observable or constant) ~> observable`
#### [≡](#contents) `U.foldPast`
#### [≡](#contents) `U.interval`
#### [≡](#contents) `U.later`
#### [≡](#contents) `U.lazy(() => observable or constant) ~> property`
#### [≡](#contents) `U.never ~> observable`
#### [≡](#contents) `U.on`
#### [≡](#contents) `U.sampledBy`
#### [≡](#contents) `U.skipFirst`
#### [≡](#contents) `U.skipDuplicates`
#### [≡](#contents) `U.skipUnless`
#### [≡](#contents) `U.skipWhen`
#### [≡](#contents) `U.startWith`
#### [≡](#contents) `U.sink`
#### [≡](#contents) `U.takeFirst`
#### [≡](#contents) `U.takeUntilBy`
#### [≡](#contents) `U.toProperty`
#### [≡](#contents) `U.throttle`

### Ramda

Ramda functions lifted to take Kefir observables.

### Math
