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

#### <a id="U-seq"></a> [≡](#contents) [`U.seq(x, ...fns)`](#U-seq)
#### <a id="U-seqPartial"></a> [≡](#contents) [`U.seqPartial(x, ...fns)`](#U-seqPartial)
#### <a id="U-scope"></a> [≡](#contents) [`U.scope(() => ...)`](#U-scope)

#### <a id="U-toPartial"></a> [≡](#contents) [`U.toPartial(totalFn)`](#U-toPartial)

#### <a id="U-show"></a> [≡](#contents) [`U.show(x) ~> x`](#U-show)

#### <a id="U-refTo"></a> [≡](#contents) [`U.refTo(settable)(value or null)`](#U-refTo)

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
