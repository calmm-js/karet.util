import * as A            from "kefir.atom"
import * as Kefir        from "kefir"
import * as I            from "infestines"
import * as L            from "partial.lenses"
import * as R            from "ramda"
import K, * as C         from "kefir.combines"
import React, * as Karet from "karet"

const Observable = Kefir.Observable
const constant = Kefir.constant

//

const isUndefined = x => x === undefined

//

export default K
export const lift1 = C.lift1
export const lift1Shallow = C.lift1Shallow
export const lift = C.lift
export const liftStaged = fn => I.pipe2U(fn, lift)

export const template = observables => K(observables, I.id)

//

export const fromKefir = Karet.fromKefir

// Kefir

const toUndefined = _ => {}
const toConstant = x => x instanceof Observable ? x : constant(x)

const invokeIf = (fn, x) => fn && fn(x)
const toHandler = fns => ({type, value}) => invokeIf(fns[type], value)

export const debounce = I.curry((ms, xs) => toConstant(xs).debounce(ms))
export const changes = xs => toConstant(xs).changes()
export const serially = xs => Kefir.concat(R.map(toConstant, xs))
export const parallel = Kefir.merge
export const delay = I.curry((ms, xs) => toConstant(xs).delay(ms))
export const endWith = I.curry((v, xs) => toConstant(xs).concat(toConstant(v)))
export const flatMapSerial = I.curry((fn, xs) =>
  toConstant(xs).flatMapConcat(I.pipe2U(fn, toConstant)))
export const flatMapErrors = I.curry((fn, xs) =>
  toConstant(xs).flatMapErrors(I.pipe2U(fn, toConstant)))
export const flatMapLatest = I.curry((fn, xs) =>
  toConstant(xs).flatMapLatest(I.pipe2U(fn, toConstant)))
export const foldPast = I.curry((fn, s, xs) => toConstant(xs).scan(fn, s))
export const interval = I.curry(Kefir.interval)
export const later = I.curry(Kefir.later)
export const never = Kefir.never()
export const on = I.curry((efs, xs) => toConstant(xs).onAny(toHandler(efs)))
export const sampledBy = I.curry((es, xs) => toConstant(xs).sampledBy(es))
export const skipFirst = I.curry((n, xs) => toConstant(xs).skip(n))
export const skipDuplicates = I.curry((equals, xs) =>
  toConstant(xs).skipDuplicates(equals))
export const skipUnless = I.curry((p, xs) => toConstant(xs).filter(p))
export const skipWhen = I.curry((p, xs) => toConstant(xs).filter(x => !p(x)))
export const startWith = I.curry((x, xs) => toConstant(xs).toProperty(() => x))
export const sink = I.pipe2U(startWith(undefined), lift(toUndefined))
export const takeFirst = I.curry((n, xs) => toConstant(xs).take(n))
export const takeUntilBy = I.curry((ts, xs) => toConstant(xs).takeUntilBy(ts))
export const toProperty = xs => toConstant(xs).toProperty()

export const set = I.curry((settable, xs) => {
  const ss = K(xs, xs => settable.set(xs))
  if (ss instanceof Observable)
    return ss.toProperty(toUndefined)
})

//

export const refTo = a => e => e && a.set(e)

//

export const seq = I.seq

export const seqPartial = I.seqPartial

export const scope = fn => fn()

export const toPartial = fn => lift(I.arityN(fn.length, (...xs) =>
  R.any(isUndefined, xs) ? undefined : fn(...xs)))

export const show = x => console.log(x) || x

export const staged = fn => R.curryN(fn.length, (...xs) =>
  fn.length === xs.length
  ? fn(...xs)
  : fn(...xs.slice(0, fn.length))(...xs.slice(fn.length)))

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

export const bindProps = ({ref, ...template}) =>
  ({ref: setProps(template), [ref]: getProps(template)})

export const bind = template =>
  ({...template, onChange: getProps(template)})

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

export const classes = (...cs) =>
  ({className: K(...cs, classesImmediate)})

//

const mapCachedInit = [{}, []]

const mapCachedStep = fromId => (old, ids) => {
  const [oldIds, oldVs] = old
  const newIds = {}
  const n = ids.length
  let changed = n !== oldVs.length
  const newVs = Array(n)
  for (let i=0; i<n; ++i) {
    const id = ids[i]
    const k = id.toString()
    let v
    if (k in newIds)
      v = newIds[k]
    else
      v = newIds[k] = k in oldIds ? oldIds[k] : fromId(id)
    newVs[i] = v
    if (!changed)
      changed = v !== oldVs[i]
  }
  return changed ? [newIds, newVs] : old
}

const mapCachedMap = lift1Shallow(x => x[1])

export const mapCached = staged(fromId =>
  I.pipe2U(foldPast(mapCachedStep(fromId), mapCachedInit),
           mapCachedMap))

//

export const mapIndexed = staged(xi2y => lift1(xs => xs.map((x, i) => xi2y(x, i))))

export const ifte = I.curry((b, t, e) =>
  toProperty(flatMapLatest(b => b ? t : e, b)))
export const ift = I.curry((b, t) =>
  toProperty(flatMapLatest(b => b ? t : undefined, b)))

//

const viewProp = (l, xs) => K(xs, L.get(l))

export const view = I.curry((l, xs) =>
  xs instanceof A.AbstractMutable ? xs.view(l) : viewProp(l, xs))

//

const types = {context: React.PropTypes.any}

export class Context extends React.Component {
  constructor(props) {
    super(props)
  }
  getChildContext() {
    return {context: this.props.context}
  }
  render() {
    return this.props.children
  }
}

Context.childContextTypes = types

export function withContext(originalFn) {
  const fn = (props, {context}) => originalFn(props, context)
  fn.contextTypes = types
  return fn
}

export const WithContext = withContext(({Do}, context) => <Do {...context}/>)

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

export const atom = value => new A.Atom(value)
export const variable = () => new A.Atom()
export const molecule = template => new A.Molecule(template)

export const holding = A.holding

// Ramda

const maybe = f => x => x && f(x)
const liftMaybe = maybe(lift)
const liftStagedMaybe = maybe(liftStaged)
const lift1Maybe = maybe(lift1)
const lift1ShallowMaybe = maybe(lift1Shallow)

//export const F = liftMaybe(R.F)
//export const T = liftMaybe(R.T)
//export const __ = liftMaybe(R.__)
export const add = liftMaybe(R.add)
export const addIndex = liftStagedMaybe(R.addIndex)
//export const adjust = liftMaybe(R.adjust)                      -> partial.lenses
export const all = liftMaybe(R.all)
export const allPass = liftStagedMaybe(R.allPass)
export const always = liftStagedMaybe(R.always)
export const and = liftMaybe(R.and)
export const any = liftMaybe(R.any)
export const anyPass = liftStagedMaybe(R.anyPass)
export const ap = liftMaybe(R.ap)
export const aperture = liftMaybe(R.aperture)
export const append = liftMaybe(R.append)
export const apply = liftMaybe(R.apply)
export const applySpec = liftMaybe(R.applySpec)
//export const assoc = liftMaybe(R.assoc)                        -> partial.lenses
//export const assocPath = liftMaybe(R.assocPath)                -> partial.lenses
export const binary = liftStagedMaybe(R.binary)
//export const bind = liftMaybe(R.bind)                          -> conflict, useful?
export const both = liftStagedMaybe(R.both)
//export const call = liftMaybe(R.call)                          -> not staged properly by Ramda, useful?
export const chain = liftMaybe(R.chain)
export const clamp = liftMaybe(R.clamp)
//export const clone = liftMaybe(R.clone)                        -> useful?
export const comparator = liftStagedMaybe(R.comparator)
export const complement = liftStagedMaybe(R.complement)
export const compose = liftStagedMaybe(R.compose)
//export const composeK = liftMaybe(R.composeK)                  -> lift staged, useful?
//export const composeP = liftMaybe(R.composeP)                  -> lift staged, useful?
export const concat = liftMaybe(R.concat)
export const cond = liftMaybe(R.cond)
export const construct = liftStagedMaybe(R.construct)
export const constructN = liftStagedMaybe(R.constructN)
export const contains = liftMaybe(R.contains)
//export const converge = liftMaybe(R.converge)
export const countBy = liftMaybe(R.countBy)
export const curry = liftStagedMaybe(R.curry)
export const curryN = liftStagedMaybe(R.curryN)
export const dec = liftMaybe(R.dec)
export const defaultTo = liftMaybe(R.defaultTo)
export const difference = liftMaybe(R.difference)
export const differenceWith = liftMaybe(R.differenceWith)
//export const dissoc = liftMaybe(R.dissoc)                      -> partial.lenses
//export const dissocPath = liftMaybe(R.dissocPath)              -> partial.lenses
export const divide = liftMaybe(R.divide)
export const drop = liftMaybe(R.drop)
export const dropLast = liftMaybe(R.dropLast)
export const dropLastWhile = liftMaybe(R.dropLastWhile)
export const dropRepeats = liftMaybe(R.dropRepeats)
export const dropRepeatsWith = liftMaybe(R.dropRepeatsWith)
export const dropWhile = liftMaybe(R.dropWhile)
export const either = liftStagedMaybe(R.either)
export const empty = liftMaybe(R.empty)
export const eqBy = liftMaybe(R.eqBy)
export const eqProps = liftMaybe(R.eqProps)
export const equals = liftMaybe(R.equals)
export const evolve = liftMaybe(R.evolve)
export const filter = liftMaybe(R.filter)
export const find = liftMaybe(R.find)
export const findIndex = liftMaybe(R.findIndex)
export const findLast = liftMaybe(R.findLast)
export const findLastIndex = liftMaybe(R.findLastIndex)
export const flatten = liftMaybe(R.flatten)
export const flip = liftStagedMaybe(R.flip)
//export const forEach = liftMaybe(R.forEach)                    -> useful?
export const fromPairs = liftMaybe(R.fromPairs)
export const groupBy = liftMaybe(R.groupBy)
export const groupWith = liftMaybe(R.groupWith)
export const gt = liftMaybe(R.gt)
export const gte = liftMaybe(R.gte)
export const has = liftMaybe(R.has)
export const hasIn = liftMaybe(R.hasIn)
export const head = liftMaybe(R.head)
export const identical = liftMaybe(R.identical)
//export const identity = liftMaybe(R.identity)                  -> useful?
export const ifElse = liftStagedMaybe(R.ifElse)
export const inc = liftMaybe(R.inc)
export const indexBy = liftMaybe(R.indexBy)
export const indexOf = liftMaybe(R.indexOf)
export const init = liftMaybe(R.init)
export const insert = liftMaybe(R.insert)
export const insertAll = liftMaybe(R.insertAll)
export const intersection = liftMaybe(R.intersection)
export const intersectionWith = liftMaybe(R.intersectionWith)
export const intersperse = liftMaybe(R.intersperse)
export const into = liftMaybe(R.into)
export const invert = liftMaybe(R.invert)
export const invertObj = liftMaybe(R.invertObj)
export const invoker = liftStagedMaybe(R.invoker)
export const is = liftMaybe(R.is)
export const isEmpty = liftMaybe(R.isEmpty)
export const isNil = liftMaybe(R.isNil)
export const join = liftMaybe(R.join)
export const juxt = liftStagedMaybe(R.juxt)
export const keys = lift1ShallowMaybe(R.keys)
export const keysIn = liftMaybe(R.keysIn)
export const last = liftMaybe(R.last)
export const lastIndexOf = liftMaybe(R.lastIndexOf)
export const length = lift1ShallowMaybe(R.length)
//export const lens = liftMaybe(R.lens)                          -> partial.lenses
//export const lensIndex = liftMaybe(R.lensIndex)                -> partial.lenses
//export const lensPath = liftMaybe(R.lensPath)                  -> partial.lenses
//export const lensProp = liftMaybe(R.lensProp)                  -> partial.lenses
//export const lift = liftMaybe(R.lift)                          -> conflict
//export const liftN = liftMaybe(R.liftN)                        -> conflict
export const lt = liftMaybe(R.lt)
export const lte = liftMaybe(R.lte)
export const map = liftMaybe(R.map)
export const mapAccum = liftMaybe(R.mapAccum)
export const mapAccumRight = liftMaybe(R.mapAccumRight)
export const mapObjIndexed = liftMaybe(R.mapObjIndexed)
export const match = liftMaybe(R.match)
export const mathMod = liftMaybe(R.mathMod)
export const max = liftMaybe(R.max)
export const maxBy = liftMaybe(R.maxBy)
export const mean = liftMaybe(R.mean)
export const median = liftMaybe(R.median)
export const memoize = liftStagedMaybe(R.memoize)
export const merge = liftMaybe(R.merge)
export const mergeAll = liftMaybe(R.mergeAll)
export const mergeWith = liftMaybe(R.mergeWith)
export const mergeWithKey = liftMaybe(R.mergeWithKey)
export const min = liftMaybe(R.min)
export const minBy = liftMaybe(R.minBy)
export const modulo = liftMaybe(R.modulo)
export const multiply = liftMaybe(R.multiply)
export const nAry = liftStagedMaybe(R.nAry)
export const negate = liftMaybe(R.negate)
export const none = liftMaybe(R.none)
export const not = liftMaybe(R.not)
export const nth = liftMaybe(R.nth)
export const nthArg = liftStagedMaybe(R.nthArg)
export const objOf = liftMaybe(R.objOf)
export const of = liftMaybe(R.of)
//export const omit = liftMaybe(R.omit)                          -> partial.lenses
//export const once = liftMaybe(R.once)                          -> lift staged, usually wrong thing to do?
export const or = liftMaybe(R.or)
//export const over = liftMaybe(R.over)                          -> partial.lenses
export const pair = liftMaybe(R.pair)
export const partial = liftStagedMaybe(R.partial)
export const partialRight = liftStagedMaybe(R.partialRight)
export const partition = liftMaybe(R.partition)
//export const path = liftMaybe(R.path)                          -> partial.lenses
//export const pathEq = liftMaybe(R.pathEq)                      -> partial.lenses
//export const pathOr = liftMaybe(R.pathOr)                      -> partial.lenses
//export const pathSatisfies = liftMaybe(R.pathSatisfies)        -> partial.lenses
//export const pick = liftMaybe(R.pick)                          -> partial.lenses
//export const pickAll = liftMaybe(R.pickAll)                    -> partial.lenses
export const pickBy = liftMaybe(R.pickBy)
export const pipe = liftStagedMaybe(R.pipe)
//export const pipeK = liftMaybe(R.pipeK)                        -> lift staged, useful?
//export const pipeP = liftMaybe(R.pipeP)                        -> lift staged, useful?
//export const pluck = liftMaybe(R.pluck)                        -> partial.lenses
export const prepend = liftMaybe(R.prepend)
export const product = liftMaybe(R.product)
export const project = liftMaybe(R.project)
//export const prop = liftMaybe(R.prop)                          -> partial.lenses
//export const propEq = liftMaybe(R.propEq)                      -> partial.lenses
//export const propIs = liftMaybe(R.propIs)                      -> partial.lenses
//export const propOr = liftMaybe(R.propOr)                      -> partial.lenses
//export const propSatisfies = liftMaybe(R.propSatisfies)        -> partial.lenses
//export const props = liftMaybe(R.props)
export const range = liftMaybe(R.range)
export const reduce = liftMaybe(R.reduce)
export const reduceBy = liftMaybe(R.reduceBy)
export const reduceRight = liftMaybe(R.reduceRight)
export const reduceWhile = liftMaybe(R.reduceWhile)
//export const reduced = liftMaybe(R.reduced)                    -> useful?
export const reject = liftMaybe(R.reject)
export const remove = liftMaybe(R.remove)
export const repeat = liftMaybe(R.repeat)
export const replace = liftMaybe(R.replace)
export const reverse = liftMaybe(R.reverse)
export const scan = liftMaybe(R.scan)
export const sequence = liftMaybe(R.sequence)
//export const set = liftMaybe(R.set)                            -> partial.lenses
export const slice = liftMaybe(R.slice)
export const sort = liftMaybe(R.sort)
export const sortBy = liftMaybe(R.sortBy)
export const split = liftMaybe(R.split)
export const splitAt = liftMaybe(R.splitAt)
export const splitEvery = liftMaybe(R.splitEvery)
export const splitWhen = liftMaybe(R.splitWhen)
export const subtract = liftMaybe(R.subtract)
export const sum = liftMaybe(R.sum)
export const symmetricDifference = liftMaybe(R.symmetricDifference)
export const symmetricDifferenceWith = liftMaybe(R.symmetricDifferenceWith)
export const tail = liftMaybe(R.tail)
export const take = liftMaybe(R.take)
export const takeLast = liftMaybe(R.takeLast)
export const takeLastWhile = liftMaybe(R.takeLastWhile)
export const takeWhile = liftMaybe(R.takeWhile)
export const tap = liftMaybe(R.tap)
export const test = liftMaybe(R.test)
export const times = liftMaybe(R.times)
export const toLower = liftMaybe(R.toLower)
export const toPairs = liftMaybe(R.toPairs)
export const toPairsIn = liftMaybe(R.toPairsIn)
export const toString = liftMaybe(R.toString)
export const toUpper = liftMaybe(R.toUpper)
export const transduce = liftMaybe(R.transduce)
export const transpose = liftMaybe(R.transpose)
export const traverse = liftMaybe(R.traverse)
export const trim = liftMaybe(R.trim)
export const tryCatch = liftStagedMaybe(R.tryCatch)
export const type = liftMaybe(R.type)
export const unapply = liftStagedMaybe(R.unapply)
export const unary = liftStagedMaybe(R.unary)
export const uncurryN = liftStagedMaybe(R.uncurryN)
export const unfold = liftMaybe(R.unfold)
export const union = liftMaybe(R.union)
export const unionWith = liftMaybe(R.unionWith)
export const uniq = liftMaybe(R.uniq)
export const uniqBy = liftMaybe(R.uniqBy)
export const uniqWith = liftMaybe(R.uniqWith)
export const unless = liftMaybe(R.unless)
export const unnest = liftMaybe(R.unnest)
export const until = liftMaybe(R.until)
//export const update = liftMaybe(R.update)                      -> partial.lenses
export const useWith = liftStagedMaybe(R.useWith)
export const values = lift1Maybe(R.values)
export const valuesIn = liftMaybe(R.valuesIn)
//export const view = liftMaybe(R.view)                          -> partial.lenses, conflict
export const when = liftMaybe(R.when)
export const where = liftMaybe(R.where)
export const whereEq = liftMaybe(R.whereEq)
export const without = liftMaybe(R.without)
export const xprod = liftMaybe(R.xprod)
export const zip = liftMaybe(R.zip)
export const zipObj = liftMaybe(R.zipObj)
export const zipWith = liftMaybe(R.zipWith)

// Math

export const abs    = lift1ShallowMaybe(Math.abs)
export const acos   = lift1ShallowMaybe(Math.acos)
export const acosh  = lift1ShallowMaybe(Math.acosh)
export const asin   = lift1ShallowMaybe(Math.asin)
export const asinh  = lift1ShallowMaybe(Math.asinh)
export const atan   = lift1ShallowMaybe(Math.atan)
export const atan2  = liftMaybe(Math.atan2)
export const atanh  = lift1ShallowMaybe(Math.atanh)
export const cbrt   = lift1ShallowMaybe(Math.cbrt)
export const ceil   = lift1ShallowMaybe(Math.ceil)
export const clz32  = lift1ShallowMaybe(Math.clz32)
export const cos    = lift1ShallowMaybe(Math.cos)
export const cosh   = lift1ShallowMaybe(Math.cosh)
export const exp    = lift1ShallowMaybe(Math.exp)
export const expm1  = lift1ShallowMaybe(Math.expm1)
export const floor  = lift1ShallowMaybe(Math.floor)
export const fround = lift1ShallowMaybe(Math.fround)
export const hypot  = liftMaybe(Math.hypot)
export const imul   = liftMaybe(Math.imul)
export const log    = lift1ShallowMaybe(Math.log)
export const log10  = lift1ShallowMaybe(Math.log10)
export const log1p  = lift1ShallowMaybe(Math.log1p)
export const log2   = lift1ShallowMaybe(Math.log2)
export const pow    = liftMaybe(Math.pow)
export const round  = lift1ShallowMaybe(Math.round)
export const sign   = lift1ShallowMaybe(Math.sign)
export const sin    = lift1ShallowMaybe(Math.sin)
export const sinh   = lift1ShallowMaybe(Math.sinh)
export const sqrt   = lift1ShallowMaybe(Math.sqrt)
export const tan    = lift1ShallowMaybe(Math.tan)
export const tanh   = lift1ShallowMaybe(Math.tanh)
export const trunc  = lift1ShallowMaybe(Math.trunc)

//

export const indices = I.pipe2U(length, lift1Shallow(R.range(0)))
