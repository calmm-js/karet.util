# <a id="karet-util"></a> Karet Util &middot; [![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat) [![GitHub stars](https://img.shields.io/github/stars/calmm-js/karet.util.svg?style=social)](https://github.com/calmm-js/karet.util)

A collection of experimental utilities for working with
[Karet](https://github.com/calmm-js/karet).

[![npm version](https://badge.fury.io/js/karet.util.svg)](http://badge.fury.io/js/karet.util)
[![Build Status](https://travis-ci.org/calmm-js/karet.util.svg?branch=master)](https://travis-ci.org/calmm-js/karet.util)
[![Code Coverage](https://img.shields.io/codecov/c/github/calmm-js/karet.util/master.svg)](https://codecov.io/github/calmm-js/karet.util?branch=master)
[![](https://david-dm.org/calmm-js/karet.util.svg)](https://david-dm.org/calmm-js/karet.util)
[![](https://david-dm.org/calmm-js/karet.util/dev-status.svg)](https://david-dm.org/calmm-js/karet.util?type=dev)

## Reference

### Misc

#### `seq(x, ...fns)`
#### `seqPartial(x, ...fns)`
#### `scope(() => ...)`

#### `toPartial(totalFn)`

#### `show(x) ~> x`

#### `refTo(settable)(value or null)`

#### `getProps({prop: settable, ...})`
#### `setProps({prop: observable, ...})`
#### `bindProps({ref: eventName, prop: settable, ...})`
#### `bind({prop: settable, ...})`

#### `K`
#### `template(template of observables)`
#### `string`
#### `lift`

#### `ift(condition, consequent)`
#### `ifte(condition, consequent, alternative)`

#### `actions(...maybeFns)`

#### `mapCached(x => ..., array)`
#### `mapIndexed((x, i) => ..., array)`
#### `indices(array)`

### Atom
#### `atom(value)`
#### `variable()`
#### `molecule(template)`
#### `holding(() => ...)`
#### `view(lens, value)`
#### `set(settable, value)`

### Karet
#### `fromKefir()`

### Context
#### `Context`
#### `withContext`
#### `WithContext`

### Kefir
#### `debounce'
#### `changes'
#### `serially'
#### `parallel'
#### `delay'
#### `endWith'
#### `flatMapSerial'
#### `flatMapErrors'
#### `flatMapLatest'
#### `foldPast'
#### `interval'
#### `later'
#### `lazy'
#### `never'
#### `on'
#### `sampledBy'
#### `skipFirst'
#### `skipDuplicates'
#### `skipUnless'
#### `skipWhen'
#### `startWith'
#### `sink'
#### `takeFirst'
#### `takeUntilBy'
#### `toProperty'
#### `throttle'

### Ramda

### Math
