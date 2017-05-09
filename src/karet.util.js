import * as R from "ramda"
import {
  AbstractMutable,
  Atom,
  Molecule,
  Join,
  holding
} from "kefir.atom"
import {
  Observable,
  Stream,
  concat as Kefir_concat,
  constant as Kefir_constant,
  fromEvents as Kefir_fromEvents,
  interval as Kefir_interval,
  later as Kefir_later,
  merge as Kefir_merge,
  never as Kefir_never
} from "kefir"
import {
  arityN,
  assocPartialU,
  curry as I_curry,
  curryN as I_curryN,
  dissocPartialU,
  hasU,
  id,
  identicalU,
  inherit,
  isDefined,
  pipe2U,
  seq,
  seqPartial
} from "infestines"

import {findHint, get} from "partial.lenses"
import K, {lift, lift1, lift1Shallow} from "kefir.combines"
import React, {fromKefir} from "karet"
import PropTypes from "prop-types"

//

export default K
export {lift, lift1, lift1Shallow}
export const liftStaged = fn => lift(pipe2U(fn, lift))
export const template = observables => K(observables, id)

//

export {fromKefir}

// Kefir

const toUndefined = _ => {}
const toConstant = x => x instanceof Observable ? x : Kefir_constant(x)

const invokeIf = (fn, x) => fn && fn(x)
const toHandler = fns => ({type, value}) => invokeIf(fns[type], value)

export const debounce = /*#__PURE__*/I_curry((ms, xs) => toConstant(xs).debounce(ms))
export const changes = xs => toConstant(xs).changes()
export const serially = xs => Kefir_concat(R.map(toConstant, xs))
export const parallel = /*#__PURE__*/Kefir_merge
export const delay = /*#__PURE__*/I_curry((ms, xs) => toConstant(xs).delay(ms))
export const endWith = /*#__PURE__*/I_curry((v, xs) => toConstant(xs).concat(toConstant(v)))
export const flatMapParallel = /*#__PURE__*/I_curry((fn, xs) =>
  toConstant(xs).flatMap(pipe2U(fn, toConstant)))
export const flatMapSerial = /*#__PURE__*/I_curry((fn, xs) =>
  toConstant(xs).flatMapConcat(pipe2U(fn, toConstant)))
export const flatMapErrors = /*#__PURE__*/I_curry((fn, xs) =>
  toConstant(xs).flatMapErrors(pipe2U(fn, toConstant)))
export const flatMapLatest = /*#__PURE__*/I_curry((fn, xs) =>
  toConstant(xs).flatMapLatest(pipe2U(fn, toConstant)))
export const foldPast = /*#__PURE__*/I_curry((fn, s, xs) => toConstant(xs).scan(fn, s))
export const interval = /*#__PURE__*/I_curry(Kefir_interval)
export const later = /*#__PURE__*/I_curry(Kefir_later)
export const lazy = th => seq(toProperty(), flatMapLatest(th), toProperty)
export const never = /*#__PURE__*/Kefir_never()
export const on = /*#__PURE__*/I_curry((efs, xs) => toConstant(xs).onAny(toHandler(efs)))
export const sampledBy = /*#__PURE__*/I_curry((es, xs) => toConstant(xs).sampledBy(es))
export const skipFirst = /*#__PURE__*/I_curry((n, xs) => toConstant(xs).skip(n))
export const skipDuplicates = /*#__PURE__*/I_curry((equals, xs) =>
  toConstant(xs).skipDuplicates(equals))
export const skipUnless = /*#__PURE__*/I_curry((p, xs) => toConstant(xs).filter(p))
export const skipWhen = /*#__PURE__*/I_curry((p, xs) => toConstant(xs).filter(x => !p(x)))
export const startWith = /*#__PURE__*/I_curry((x, xs) => toConstant(xs).toProperty(() => x))
export const sink = /*#__PURE__*/pipe2U(startWith(undefined), lift(toUndefined))
export const takeFirst = /*#__PURE__*/I_curry((n, xs) => toConstant(xs).take(n))
export const takeUntilBy = /*#__PURE__*/I_curry((ts, xs) => toConstant(xs).takeUntilBy(ts))
export const toProperty = xs => toConstant(xs).toProperty()
export const throttle = /*#__PURE__*/I_curry((ms, xs) => toConstant(xs).throttle(ms))
export const fromEvents = /*#__PURE__*/I_curry(Kefir_fromEvents)

export const set = /*#__PURE__*/I_curry((settable, xs) => {
  const ss = K(xs, xs => settable.set(xs))
  if (ss instanceof Observable)
    return ss.toProperty(toUndefined)
})

//

export const Bus = /*#__PURE__*/inherit(function Bus() {
  Stream.call(this)
}, Stream, {
  push(value) { this._emitValue(value) },
  error(value) { this._emitError(value) },
  end() { this._emitEnd() }
})

export const bus = () => new Bus()

//

export const refTo = settable => elem => {
  if (null !== elem)
    settable.set(elem)
}

//

export {seq, seqPartial}

export const scope = fn => fn()

export const toPartial = fn => lift(arityN(fn.length, (...xs) =>
  R.all(isDefined, xs) ? fn(...xs) : undefined))

export const show = x => console.log(x) || x

export const staged = fn => R.curryN(fn.length, function () {
  const xsN = arguments.length,
        fnN = fn.length,
        n = Math.min(xsN, fnN),
        xs = Array(n)
  for (let i=0; i<n; ++i)
    xs[i] = arguments[i]

  const fnxs = fn.apply(null, xs)
  if (fnN === xsN)
    return fnxs

  const m = xsN - n, ys = Array(m)
  for (let i=0; i<m; ++i)
    ys[i] = arguments[i+n]

  return fnxs.apply(null, ys)
})

//

export function setProps(observables) {
  let observable
  let callback
  return e => {
    if (callback) {
      observable.offAny(callback)
      observable = callback = null
    }
    if (e) {
      callback = ev => {
        switch (ev.type) {
          case "value": {
            const observables = ev.value
            for (const k in observables)
              e[k] = observables[k]
            break
          }
          case "error":
            throw ev.value
          case "end":
            observable = callback = null
            break
        }
      }
      observable = template(observables)
      observable.onAny(callback)
    }
  }
}

export const getProps = template => ({target}) => {
  for (const k in template)
    template[k].set(target[k])
}

export const bindProps = templateWithRef => {
  const ref = templateWithRef.ref
  const template = dissocPartialU("ref", templateWithRef)
  const r = {ref: setProps(template)}
  r[ref] = getProps(template)
  return r
}

export const bind = template =>
  assocPartialU("onChange", getProps(template), template)

//

function classesImmediate() {
  let result = ""
  for (let i=0, n=arguments.length; i<n; ++i) {
    const a = arguments[i]
    if (a) {
      if (result)
        result += " "
      result += a
    }
  }
  return result
}

export function cns() {
  const n = arguments.length, xs = Array(n+1)
  for (let i=0; i<n; ++i)
    xs[i] = arguments[i]
  xs[n] = classesImmediate
  return K.apply(null, xs)
}

export const classes = (...xs) => ({className: cns(...xs)})

//

const mapCachedInit = [{}, []]

const mapCachedStep = fromId => (old, ids) => {
  const oldIds = old[0], oldVs = old[1]
  const newIds = {}
  const n = ids.length
  let changed = n !== oldVs.length
  const newVs = Array(n)
  for (let i=0; i<n; ++i) {
    const id = ids[i]
    const k = id.toString()
    let v
    if (hasU(k, newIds))
      v = newIds[k]
    else
      v = newIds[k] = hasU(k, oldIds) ? oldIds[k] : fromId(id)
    newVs[i] = v
    if (!changed)
      changed = v !== oldVs[i]
  }
  return changed ? [newIds, newVs] : old
}

const mapCachedMap = /*#__PURE__*/lift1Shallow(x => x[1])

export const mapCached = /*#__PURE__*/I_curryN(2, fromId =>
  pipe2U(foldPast(mapCachedStep(fromId), mapCachedInit),
         mapCachedMap))

//

export const mapIndexed = /*#__PURE__*/I_curryN(2, xi2y =>
  lift1(xs => xs.map((x, i) => xi2y(x, i))))

const ifteU = (b, t, e) => toProperty(flatMapLatest(b => b ? t : e, b))

export const ifte = /*#__PURE__*/I_curry(ifteU)
export const ift = /*#__PURE__*/arityN(2, ifteU)

export function iftes() {
  let n = arguments.length
  let r = n & 1 ? arguments[--n] : undefined
  while (0 <= (n -= 2))
    r = ifteU(arguments[n], arguments[n+1], r)
  return r
}

//

export const view = /*#__PURE__*/I_curry((l, xs) =>
  xs instanceof AbstractMutable
  ? l instanceof Observable
    ? new Join(K(l, l => xs.view(l)))
    : xs.view(l)
  : K(l, xs, get))

//

const types = {context: PropTypes.any}

export const Context = /*#__PURE__*/inherit(function Context(props) {
  Context.childContextTypes = types
  React.Component.call(this, props)
}, React.Component, {
  getChildContext() {
    return {context: this.props.context}
  },
  render() {
    return this.props.children
  }
})

export function withContext(originalFn) {
  const fn = (props, {context}) => originalFn(props, context)
  fn.contextTypes = types
  return fn
}

export const WithContext = /*#__PURE__*/withContext(({Do}, context) =>
  <Do {...context}/>)

//

const actionsImmediate = (...fns) => (...args) => {
  for (let i=0, n=fns.length; i<n; ++i)
    if (fns[i] instanceof Function)
      fns[i](...args)
}

export const actions = (...fns) => K(...fns, actionsImmediate)

//

export const string = (strings, ...values) =>
  K(...values, (...values) => String.raw(strings, ...values))

//

export const atom = value => new Atom(value)
export const variable = () => new Atom()
export const molecule = template => new Molecule(template)

export {holding}

// Ramda

const maybe = f => x => x && f(x)

const stageLast1Of2Maybe = /*#__PURE__*/maybe(fn => x1 => x2 => fn(x1, x2))
const stageLast2Of3Maybe = /*#__PURE__*/maybe(fn => x1 => (x2, x3) => fn(x1, x2, x3))

const liftMaybe = /*#__PURE__*/maybe(lift)
const liftStagedMaybe = /*#__PURE__*/maybe(liftStaged)
const lift1Maybe = /*#__PURE__*/maybe(lift1)
const lift1ShallowMaybe = /*#__PURE__*/maybe(/*#__PURE__*/lift1Shallow)

export const F = /*#__PURE__*/R.F
export const T = /*#__PURE__*/R.T
export const __ = /*#__PURE__*/R.__
export const add = /*#__PURE__*/liftMaybe(R.add)
export const addIndex = /*#__PURE__*/liftStagedMaybe(R.addIndex)
export const adjust = /*#__PURE__*/liftMaybe(R.adjust)
export const all = /*#__PURE__*/liftMaybe(R.all)
export const allPass = /*#__PURE__*/liftStagedMaybe(R.allPass)
export const always = /*#__PURE__*/R.always // lifting won't really work
export const and = /*#__PURE__*/liftMaybe(R.and)
export const any = /*#__PURE__*/liftMaybe(R.any)
export const anyPass = /*#__PURE__*/liftStagedMaybe(R.anyPass)
export const ap = /*#__PURE__*/liftMaybe(R.ap)
export const aperture = /*#__PURE__*/liftMaybe(R.aperture)
export const append = /*#__PURE__*/liftMaybe(R.append)
export const apply = /*#__PURE__*/liftMaybe(R.apply)
export const applySpec = /*#__PURE__*/liftMaybe(R.applySpec)
export const ascend = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(R.ascend))
export const assoc = /*#__PURE__*/liftMaybe(R.assoc)
export const assocPath = /*#__PURE__*/liftMaybe(R.assocPath)
export const binary = /*#__PURE__*/liftStagedMaybe(R.binary)
//export const bind = /*#__PURE__*/liftMaybe(R.bind)                          -> conflict, useful?
export const both = /*#__PURE__*/liftStagedMaybe(R.both)
export const call = /*#__PURE__*/liftStagedMaybe(R.call)
export const chain = /*#__PURE__*/liftMaybe(R.chain)
export const clamp = /*#__PURE__*/liftMaybe(R.clamp)
//export const clone = /*#__PURE__*/liftMaybe(R.clone)                        -> useful?
export const comparator = /*#__PURE__*/liftStagedMaybe(R.comparator)
export const complement = /*#__PURE__*/liftStagedMaybe(R.complement)
export const compose = /*#__PURE__*/liftStagedMaybe(R.compose)
//export const composeK = /*#__PURE__*/liftMaybe(R.composeK)                  -> lift staged, useful?
//export const composeP = /*#__PURE__*/liftMaybe(R.composeP)                  -> lift staged, useful?
export const concat = /*#__PURE__*/liftMaybe(R.concat)
export const cond = /*#__PURE__*/liftStagedMaybe(R.cond)
export const construct = /*#__PURE__*/liftStagedMaybe(R.construct)
export const constructN = /*#__PURE__*/liftStagedMaybe(R.constructN)
export const contains = /*#__PURE__*/liftMaybe(R.contains)
export const converge = /*#__PURE__*/liftStagedMaybe(R.converge)
export const countBy = /*#__PURE__*/liftMaybe(R.countBy)
export const curry = /*#__PURE__*/liftStagedMaybe(R.curry)
export const curryN = /*#__PURE__*/liftStagedMaybe(R.curryN)
export const dec = /*#__PURE__*/liftMaybe(R.dec)
export const defaultTo = /*#__PURE__*/liftMaybe(R.defaultTo)
export const descend = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(R.descend))
export const difference = /*#__PURE__*/liftMaybe(R.difference)
export const differenceWith = /*#__PURE__*/liftMaybe(R.differenceWith)
export const dissoc = /*#__PURE__*/liftMaybe(R.dissoc)
export const dissocPath = /*#__PURE__*/liftMaybe(R.dissocPath)
export const divide = /*#__PURE__*/liftMaybe(R.divide)
export const drop = /*#__PURE__*/liftMaybe(R.drop)
export const dropLast = /*#__PURE__*/liftMaybe(R.dropLast)
export const dropLastWhile = /*#__PURE__*/liftMaybe(R.dropLastWhile)
export const dropRepeats = /*#__PURE__*/liftMaybe(R.dropRepeats)
export const dropRepeatsWith = /*#__PURE__*/liftMaybe(R.dropRepeatsWith)
export const dropWhile = /*#__PURE__*/liftMaybe(R.dropWhile)
export const either = /*#__PURE__*/liftStagedMaybe(R.either)
export const empty = /*#__PURE__*/liftMaybe(R.empty)
export const eqBy = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(R.eqBy))
export const eqProps = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(R.eqProps))
export const equals = /*#__PURE__*/liftMaybe(R.equals)
export const evolve = /*#__PURE__*/liftMaybe(R.evolve)
export const filter = /*#__PURE__*/liftMaybe(R.filter)
export const find = /*#__PURE__*/liftMaybe(R.find)
export const findIndex = /*#__PURE__*/liftMaybe(R.findIndex)
export const findLast = /*#__PURE__*/liftMaybe(R.findLast)
export const findLastIndex = /*#__PURE__*/liftMaybe(R.findLastIndex)
export const flatten = /*#__PURE__*/liftMaybe(R.flatten)
export const flip = /*#__PURE__*/liftStagedMaybe(R.flip)
//export const forEach = /*#__PURE__*/liftMaybe(R.forEach)                       -> useful?
//export const forEachObjIndexed = = /*#__PURE__*/liftMaybe(R.forEachObjIndexed) -> useful?
export const fromPairs = /*#__PURE__*/liftMaybe(R.fromPairs)
export const groupBy = /*#__PURE__*/liftMaybe(R.groupBy)
export const groupWith = /*#__PURE__*/liftMaybe(R.groupWith)
export const gt = /*#__PURE__*/liftMaybe(R.gt)
export const gte = /*#__PURE__*/liftMaybe(R.gte)
export const has = /*#__PURE__*/liftMaybe(R.has)
export const hasIn = /*#__PURE__*/liftMaybe(R.hasIn)
export const head = /*#__PURE__*/liftMaybe(R.head)
export const identical = /*#__PURE__*/liftMaybe(R.identical)
export const identity = /*#__PURE__*/R.identity // lifting won't really work
export const ifElse = /*#__PURE__*/liftStagedMaybe(R.ifElse)
export const inc = /*#__PURE__*/liftMaybe(R.inc)
export const indexBy = /*#__PURE__*/liftMaybe(R.indexBy)
export const indexOf = /*#__PURE__*/liftMaybe(R.indexOf)
export const init = /*#__PURE__*/liftMaybe(R.init)
export const insert = /*#__PURE__*/liftMaybe(R.insert)
export const insertAll = /*#__PURE__*/liftMaybe(R.insertAll)
export const intersection = /*#__PURE__*/liftMaybe(R.intersection)
export const intersectionWith = /*#__PURE__*/liftMaybe(R.intersectionWith)
export const intersperse = /*#__PURE__*/liftMaybe(R.intersperse)
export const into = /*#__PURE__*/liftMaybe(R.into)
export const invert = /*#__PURE__*/liftMaybe(R.invert)
export const invertObj = /*#__PURE__*/liftMaybe(R.invertObj)
export const invoker = /*#__PURE__*/liftStagedMaybe(R.invoker)
export const is = /*#__PURE__*/liftMaybe(stageLast1Of2Maybe(R.is))
export const isEmpty = /*#__PURE__*/liftMaybe(R.isEmpty)
export const isNil = /*#__PURE__*/liftMaybe(R.isNil)
export const join = /*#__PURE__*/liftMaybe(R.join)
export const juxt = /*#__PURE__*/liftStagedMaybe(R.juxt)
export const keys = /*#__PURE__*/lift1ShallowMaybe(R.keys)
export const keysIn = /*#__PURE__*/liftMaybe(R.keysIn)
export const last = /*#__PURE__*/liftMaybe(R.last)
export const lastIndexOf = /*#__PURE__*/liftMaybe(R.lastIndexOf)
export const length = /*#__PURE__*/lift1ShallowMaybe(R.length)
//export const lens = /*#__PURE__*/liftMaybe(R.lens)                          -> partial.lenses
//export const lensIndex = /*#__PURE__*/liftMaybe(R.lensIndex)                -> partial.lenses
//export const lensPath = /*#__PURE__*/liftMaybe(R.lensPath)                  -> partial.lenses
//export const lensProp = /*#__PURE__*/liftMaybe(R.lensProp)                  -> partial.lenses
//export const lift = /*#__PURE__*/liftMaybe(R.lift)                          -> conflict
//export const liftN = /*#__PURE__*/liftMaybe(R.liftN)                        -> conflict
export const lt = /*#__PURE__*/liftMaybe(R.lt)
export const lte = /*#__PURE__*/liftMaybe(R.lte)
export const map = /*#__PURE__*/liftMaybe(R.map)
export const mapAccum = /*#__PURE__*/liftMaybe(R.mapAccum)
export const mapAccumRight = /*#__PURE__*/liftMaybe(R.mapAccumRight)
export const mapObjIndexed = /*#__PURE__*/liftMaybe(R.mapObjIndexed)
export const match = /*#__PURE__*/liftMaybe(R.match)
export const mathMod = /*#__PURE__*/liftMaybe(R.mathMod)
export const max = /*#__PURE__*/liftMaybe(R.max)
export const maxBy = /*#__PURE__*/liftMaybe(R.maxBy)
export const mean = /*#__PURE__*/liftMaybe(R.mean)
export const median = /*#__PURE__*/liftMaybe(R.median)
export const memoize = /*#__PURE__*/liftStagedMaybe(R.memoize)
export const merge = /*#__PURE__*/liftMaybe(R.merge)
export const mergeAll = /*#__PURE__*/liftMaybe(R.mergeAll)
export const mergeWith = /*#__PURE__*/liftMaybe(R.mergeWith)
export const mergeWithKey = /*#__PURE__*/liftMaybe(R.mergeWithKey)
export const min = /*#__PURE__*/liftMaybe(R.min)
export const minBy = /*#__PURE__*/liftMaybe(R.minBy)
export const modulo = /*#__PURE__*/liftMaybe(R.modulo)
export const multiply = /*#__PURE__*/liftMaybe(R.multiply)
export const nAry = /*#__PURE__*/liftStagedMaybe(R.nAry)
export const negate = /*#__PURE__*/liftMaybe(R.negate)
export const none = /*#__PURE__*/liftMaybe(R.none)
export const not = /*#__PURE__*/liftMaybe(R.not)
export const nth = /*#__PURE__*/liftMaybe(R.nth)
export const nthArg = /*#__PURE__*/liftStagedMaybe(R.nthArg)
export const objOf = /*#__PURE__*/liftMaybe(R.objOf)
export const of = /*#__PURE__*/liftMaybe(R.of)
export const omit = /*#__PURE__*/liftMaybe(R.omit)
//export const once = /*#__PURE__*/liftMaybe(R.once)                          -> lift staged, usually wrong thing to do?
export const or = /*#__PURE__*/liftMaybe(R.or)
//export const over = /*#__PURE__*/liftMaybe(R.over)                          -> partial.lenses
export const pair = /*#__PURE__*/liftMaybe(R.pair)
export const partial = /*#__PURE__*/liftStagedMaybe(R.partial)
export const partialRight = /*#__PURE__*/liftStagedMaybe(R.partialRight)
export const partition = /*#__PURE__*/liftMaybe(R.partition)
export const path = /*#__PURE__*/liftMaybe(R.path)
export const pathEq = /*#__PURE__*/liftMaybe(R.pathEq)
export const pathOr = /*#__PURE__*/liftMaybe(R.pathOr)
export const pathSatisfies = /*#__PURE__*/liftMaybe(R.pathSatisfies)
export const pick = /*#__PURE__*/liftMaybe(R.pick)
export const pickAll = /*#__PURE__*/liftMaybe(R.pickAll)
export const pickBy = /*#__PURE__*/liftMaybe(R.pickBy)
export const pipe = /*#__PURE__*/liftStagedMaybe(R.pipe)
//export const pipeK = /*#__PURE__*/liftMaybe(R.pipeK)                        -> lift staged, useful?
//export const pipeP = /*#__PURE__*/liftMaybe(R.pipeP)                        -> lift staged, useful?
export const pluck = /*#__PURE__*/liftMaybe(R.pluck)
export const prepend = /*#__PURE__*/liftMaybe(R.prepend)
export const product = /*#__PURE__*/liftMaybe(R.product)
export const project = /*#__PURE__*/liftMaybe(R.project)
export const prop = /*#__PURE__*/liftMaybe(R.prop)
export const propEq = /*#__PURE__*/liftMaybe(R.propEq)
export const propIs = /*#__PURE__*/liftMaybe(R.propIs)
export const propOr = /*#__PURE__*/liftMaybe(R.propOr)
export const propSatisfies = /*#__PURE__*/liftMaybe(R.propSatisfies)
export const props = /*#__PURE__*/liftMaybe(R.props)
export const range = /*#__PURE__*/liftMaybe(R.range)
export const reduce = /*#__PURE__*/liftMaybe(R.reduce)
export const reduceBy = /*#__PURE__*/liftMaybe(R.reduceBy)
export const reduceRight = /*#__PURE__*/liftMaybe(R.reduceRight)
export const reduceWhile = /*#__PURE__*/liftMaybe(R.reduceWhile)
export const reduced = /*#__PURE__*/liftMaybe(R.reduced)
export const reject = /*#__PURE__*/liftMaybe(R.reject)
export const remove = /*#__PURE__*/liftMaybe(R.remove)
export const repeat = /*#__PURE__*/liftMaybe(R.repeat)
export const replace = /*#__PURE__*/liftMaybe(R.replace)
export const reverse = /*#__PURE__*/liftMaybe(R.reverse)
export const scan = /*#__PURE__*/liftMaybe(R.scan)
export const sequence = /*#__PURE__*/liftMaybe(R.sequence)
//export const set = /*#__PURE__*/liftMaybe(R.set)                            -> partial.lenses, conflict
export const slice = /*#__PURE__*/liftMaybe(R.slice)
export const sort = /*#__PURE__*/liftMaybe(R.sort)
export const sortBy = /*#__PURE__*/liftMaybe(R.sortBy)
export const sortWith = /*#__PURE__*/liftMaybe(R.sortWith)
export const split = /*#__PURE__*/liftMaybe(R.split)
export const splitAt = /*#__PURE__*/liftMaybe(R.splitAt)
export const splitEvery = /*#__PURE__*/liftMaybe(R.splitEvery)
export const splitWhen = /*#__PURE__*/liftMaybe(R.splitWhen)
export const subtract = /*#__PURE__*/liftMaybe(R.subtract)
export const sum = /*#__PURE__*/liftMaybe(R.sum)
export const symmetricDifference = /*#__PURE__*/liftMaybe(R.symmetricDifference)
export const symmetricDifferenceWith = /*#__PURE__*/liftMaybe(R.symmetricDifferenceWith)
export const tail = /*#__PURE__*/liftMaybe(R.tail)
export const take = /*#__PURE__*/liftMaybe(R.take)
export const takeLast = /*#__PURE__*/liftMaybe(R.takeLast)
export const takeLastWhile = /*#__PURE__*/liftMaybe(R.takeLastWhile)
export const takeWhile = /*#__PURE__*/liftMaybe(R.takeWhile)
export const tap = /*#__PURE__*/liftMaybe(R.tap)
export const test = /*#__PURE__*/liftMaybe(R.test)
export const times = /*#__PURE__*/liftMaybe(R.times)
export const toLower = /*#__PURE__*/liftMaybe(R.toLower)
export const toPairs = /*#__PURE__*/liftMaybe(R.toPairs)
export const toPairsIn = /*#__PURE__*/liftMaybe(R.toPairsIn)
export const toString = /*#__PURE__*/liftMaybe(R.toString)
export const toUpper = /*#__PURE__*/liftMaybe(R.toUpper)
export const transduce = /*#__PURE__*/liftMaybe(R.transduce)
export const transpose = /*#__PURE__*/liftMaybe(R.transpose)
export const traverse = /*#__PURE__*/liftMaybe(R.traverse)
export const trim = /*#__PURE__*/liftMaybe(R.trim)
export const tryCatch = /*#__PURE__*/liftStagedMaybe(R.tryCatch)
export const type = /*#__PURE__*/liftMaybe(R.type)
export const unapply = /*#__PURE__*/liftStagedMaybe(R.unapply)
export const unary = /*#__PURE__*/liftStagedMaybe(R.unary)
export const uncurryN = /*#__PURE__*/liftStagedMaybe(R.uncurryN)
export const unfold = /*#__PURE__*/liftMaybe(R.unfold)
export const union = /*#__PURE__*/liftMaybe(R.union)
export const unionWith = /*#__PURE__*/liftMaybe(R.unionWith)
export const uniq = /*#__PURE__*/liftMaybe(R.uniq)
export const uniqBy = /*#__PURE__*/liftMaybe(R.uniqBy)
export const uniqWith = /*#__PURE__*/liftMaybe(R.uniqWith)
export const unless = /*#__PURE__*/liftMaybe(R.unless)
export const unnest = /*#__PURE__*/liftMaybe(R.unnest)
export const until = /*#__PURE__*/liftMaybe(R.until)
export const update = /*#__PURE__*/liftMaybe(R.update)
export const useWith = /*#__PURE__*/liftStagedMaybe(R.useWith)
export const values = /*#__PURE__*/lift1Maybe(R.values)
export const valuesIn = /*#__PURE__*/liftMaybe(R.valuesIn)
//export const view = /*#__PURE__*/liftMaybe(R.view)                          -> partial.lenses, conflict
export const when = /*#__PURE__*/liftMaybe(R.when)
export const where = /*#__PURE__*/liftStagedMaybe(stageLast1Of2Maybe(R.where))
export const whereEq = /*#__PURE__*/liftStagedMaybe(stageLast1Of2Maybe(R.whereEq))
export const without = /*#__PURE__*/liftMaybe(R.without)
export const xprod = /*#__PURE__*/liftMaybe(R.xprod)
export const zip = /*#__PURE__*/liftMaybe(R.zip)
export const zipObj = /*#__PURE__*/liftMaybe(R.zipObj)
export const zipWith = /*#__PURE__*/liftMaybe(R.zipWith)

// Math

export const abs    = /*#__PURE__*/lift1ShallowMaybe(Math.abs)
export const acos   = /*#__PURE__*/lift1ShallowMaybe(Math.acos)
export const acosh  = /*#__PURE__*/lift1ShallowMaybe(Math.acosh)
export const asin   = /*#__PURE__*/lift1ShallowMaybe(Math.asin)
export const asinh  = /*#__PURE__*/lift1ShallowMaybe(Math.asinh)
export const atan   = /*#__PURE__*/lift1ShallowMaybe(Math.atan)
export const atan2  = /*#__PURE__*/liftMaybe(Math.atan2)
export const atanh  = /*#__PURE__*/lift1ShallowMaybe(Math.atanh)
export const cbrt   = /*#__PURE__*/lift1ShallowMaybe(Math.cbrt)
export const ceil   = /*#__PURE__*/lift1ShallowMaybe(Math.ceil)
export const clz32  = /*#__PURE__*/lift1ShallowMaybe(Math.clz32)
export const cos    = /*#__PURE__*/lift1ShallowMaybe(Math.cos)
export const cosh   = /*#__PURE__*/lift1ShallowMaybe(Math.cosh)
export const exp    = /*#__PURE__*/lift1ShallowMaybe(Math.exp)
export const expm1  = /*#__PURE__*/lift1ShallowMaybe(Math.expm1)
export const floor  = /*#__PURE__*/lift1ShallowMaybe(Math.floor)
export const fround = /*#__PURE__*/lift1ShallowMaybe(Math.fround)
export const hypot  = /*#__PURE__*/liftMaybe(Math.hypot)
export const imul   = /*#__PURE__*/liftMaybe(Math.imul)
export const log    = /*#__PURE__*/lift1ShallowMaybe(Math.log)
export const log10  = /*#__PURE__*/lift1ShallowMaybe(Math.log10)
export const log1p  = /*#__PURE__*/lift1ShallowMaybe(Math.log1p)
export const log2   = /*#__PURE__*/lift1ShallowMaybe(Math.log2)
export const pow    = /*#__PURE__*/liftMaybe(Math.pow)
export const round  = /*#__PURE__*/lift1ShallowMaybe(Math.round)
export const sign   = /*#__PURE__*/lift1ShallowMaybe(Math.sign)
export const sin    = /*#__PURE__*/lift1ShallowMaybe(Math.sin)
export const sinh   = /*#__PURE__*/lift1ShallowMaybe(Math.sinh)
export const sqrt   = /*#__PURE__*/lift1ShallowMaybe(Math.sqrt)
export const tan    = /*#__PURE__*/lift1ShallowMaybe(Math.tan)
export const tanh   = /*#__PURE__*/lift1ShallowMaybe(Math.tanh)
export const trunc  = /*#__PURE__*/lift1ShallowMaybe(Math.trunc)

//

export const indices = /*#__PURE__*/pipe2U(length, lift1Shallow(R.range(0)))

//

export const mapElems = /*#__PURE__*/I_curry((xi2y, xs) => seq(
  xs,
  foldPast((ysIn, xsIn) => {
    const xsN = xsIn.length
    const ysN = ysIn.length
    if (xsN === ysN)
      return ysIn
    const ys = Array(xsN)
    for (let i=0; i<xsN; ++i)
      ys[i] = i < ysN ? ysIn[i] : xi2y(view(i, xs), i)
    return ys
  }, []),
  skipDuplicates(identicalU)))

//

export const mapElemsWithIds = /*#__PURE__*/I_curry((idOf, xi2y, xs) => {
  const id2info = {}
  const find = findHint((x, info) => idOf(x) === info.id)
  return seq(
    xs,
    foldPast((ysIn, xsIn) => {
      const n = xsIn.length
      let ys = ysIn.length === n ? ysIn : Array(n)
      for (let i=0; i<n; ++i) {
        const id = idOf(xsIn[i])
        let info = id2info[id]
        if (void 0 === info) {
          info = id2info[id] = {}
          info.id = id
          info.hint = i
          info.elem = xi2y(view(find(info), xs), id)
        }
        if (ys[i] !== info.elem) {
          info.hint = i
          if (ys === ysIn)
            ys = ys.slice(0)
          ys[i] = info.elem
        }
      }
      if (ys !== ysIn) {
        for (const id in id2info) {
          const info = id2info[id]
          if (ys[info.hint] !== info.elem)
            delete id2info[id]
        }
      }
      return ys
    }, []),
    skipDuplicates(identicalU))
})
