import * as A            from "kefir.atom"
import * as Kefir        from "kefir"
import * as L            from "partial.lenses"
import * as R            from "ramda"
import K, * as C         from "kefir.combines"
import React, * as Karet from "karet"

const Observable = Kefir.Observable
const constant = Kefir.constant

//

export default K
export const lift1 = C.lift1
export const lift1Shallow = C.lift1Shallow
export const lift = C.lift
export const liftStaged = fn => lift(R.pipe(fn, lift))

//

export const fromKefir = Karet.fromKefir

// Kefir

const toUndefined = () => {}
const toConstant = x => x instanceof Observable ? x : constant(x)

export const debounce = R.curry((ms, xs) =>
  xs instanceof Observable ? xs.debounce(ms) : xs)
export const flatMapLatest = R.curry((fn, xs) =>
  xs instanceof Observable ? xs.flatMapLatest(x => toConstant(fn(x))) : fn(xs))
export const flatMapErrors = R.curry((fn, xs) =>
  xs instanceof Observable ? xs.flatMapErrors(x => toConstant(fn(x))) : xs)
export const foldPast = R.curry((fn, s, xs) =>
  xs instanceof Observable ? xs.scan(fn, s) : fn(s, xs))
export const later = R.curry(Kefir.later)
export const sampledBy = R.curry((es, xs) =>
  xs instanceof Observable ? xs.sampledBy(es) : xs)
export const skipDuplicates = R.curry((equals, xs) =>
  xs instanceof Observable ? xs.skipDuplicates(equals) : xs)
export const skipUnless = R.curry((p, xs) =>
  xs instanceof Observable ? xs.filter(p) : xs)
export const skipWhen = R.curry((p, xs) =>
  xs instanceof Observable ? xs.filter(x => !p(x)) : xs)
export const startWith = R.curry((x, xs) =>
  xs instanceof Observable ? xs.toProperty(() => x) : xs)
export const sink = R.pipe(startWith(null), lift(toUndefined)) // XXX Remove?
export const toProperty = xs =>
  xs instanceof Observable ? xs.toProperty() : xs

export const set = R.curry((settable, xs) => {
  const ss = K(xs, xs => settable.set(xs))
  if (ss instanceof Observable)
    return ss.toProperty(toUndefined)
})

//

export const refTo = a => e => e && a.set(e)

//

export function seq(x) {
  let r = x
  for (let i=1, n=arguments.length; i<n; ++i)
    r = arguments[i](r)
  return r
}

export function seqPartial(x) {
  let r = x
  for (let i=1, n=arguments.length; r !== undefined && i<n; ++i)
    r = arguments[i](r)
  return r
}

export const scope = fn => fn()

export const toPartial = fn => lift(R.curryN(fn.length, (...xs) =>
  R.any(R.equals(undefined), xs) ? undefined : fn(...xs)))

export const show = x => console.log(x) || x

export const staged = fn => R.curryN(fn.length, (...xs) =>
  fn.length === xs.length
  ? fn(...xs)
  : fn(...xs.slice(0, fn.length))(...xs.slice(fn.length)))

//

export const setProps = template => {
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
            const template = ev.value
            for (const k in template)
              e[k] = template[k]
            break
          }
          case "error":
            throw ev.value
          case "end":
            observable = callback = null
            break
        }
      }
      observable = K(template, R.identity)
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
  R.pipe(foldPast(mapCachedStep(fromId), mapCachedInit),
         mapCachedMap))

//

export const mapIndexed = staged(xi2y => lift1(xs => xs.map((x, i) => xi2y(x, i))))

const invoke = thunk => typeof thunk === "function" ? thunk() : thunk

export const ifte = lift((b, t, e) => invoke(b ? t : e))
export const ift = lift((b, fn) => b ? invoke(fn) : null)

//

const viewProp = (l, xs) => K(xs, L.get(l))

export const view = R.curry((l, xs) =>
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

export const withContext = originalFn => {
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

//export const F = lift(R.F)
//export const T = lift(R.T)
//export const __ = lift(R.__)
export const add = lift(R.add)
export const addIndex = liftStaged(R.addIndex)
//export const adjust = lift(R.adjust)                      -> partial.lenses
export const all = lift(R.all)
export const allPass = liftStaged(R.allPass)
export const always = lift(R.always)
export const and = lift(R.and)
export const any = lift(R.any)
//export const anyPass = lift(R.anyPass)
export const ap = lift(R.ap)
export const aperture = lift(R.aperture)
export const append = lift(R.append)
export const apply = lift(R.apply)
export const applySpec = lift(R.applySpec)
//export const assoc = lift(R.assoc)                        -> partial.lenses
//export const assocPath = lift(R.assocPath)                -> partial.lenses
export const binary = liftStaged(R.binary)
//export const bind = lift(R.bind)                          -> conflict, useful?
export const both = liftStaged(R.both)
//export const call = lift(R.call)                          -> not staged properly by Ramda, useful?
export const chain = lift(R.chain)
export const clamp = lift(R.clamp)
//export const clone = lift(R.clone)                        -> useful?
export const comparator = liftStaged(R.comparator)
export const complement = liftStaged(R.complement)
//export const compose = lift(R.compose)                    -> lift staged, useful?
//export const composeK = lift(R.composeK)                  -> lift staged, useful?
//export const composeP = lift(R.composeP)                  -> lift staged, useful?
export const concat = lift(R.concat)
export const cond = lift(R.cond)
export const construct = liftStaged(R.construct)
export const constructN = liftStaged(R.constructN)
export const contains = lift(R.contains)
//export const converge = lift(R.converge)
export const countBy = lift(R.countBy)
export const curry = liftStaged(R.curry)
export const curryN = liftStaged(R.curryN)
export const dec = lift(R.dec)
export const defaultTo = lift(R.defaultTo)
export const difference = lift(R.difference)
export const differenceWith = lift(R.differenceWith)
//export const dissoc = lift(R.dissoc)                      -> partial.lenses
//export const dissocPath = lift(R.dissocPath)              -> partial.lenses
export const divide = lift(R.divide)
export const drop = lift(R.drop)
export const dropLast = lift(R.dropLast)
export const dropLastWhile = lift(R.dropLastWhile)
export const dropRepeats = lift(R.dropRepeats)
export const dropRepeatsWith = lift(R.dropRepeatsWith)
export const dropWhile = lift(R.dropWhile)
export const either = liftStaged(R.either)
export const empty = lift(R.empty)
export const eqBy = lift(R.eqBy)
export const eqProps = lift(R.eqProps)
export const equals = lift(R.equals)
export const evolve = lift(R.evolve)
export const filter = lift(R.filter)
export const find = lift(R.find)
export const findIndex = lift(R.findIndex)
export const findLast = lift(R.findLast)
export const findLastIndex = lift(R.findLastIndex)
export const flatten = lift(R.flatten)
export const flip = liftStaged(R.flip)
//export const forEach = lift(R.forEach)                    -> useful?
export const fromPairs = lift(R.fromPairs)
export const groupBy = lift(R.groupBy)
export const groupWith = lift(R.groupWith)
export const gt = lift(R.gt)
export const gte = lift(R.gte)
export const has = lift(R.has)
export const hasIn = lift(R.hasIn)
export const head = lift(R.head)
export const identical = lift(R.identical)
//export const identity = lift(R.identity)                  -> useful?
export const ifElse = lift(R.ifElse)
export const inc = lift(R.inc)
export const indexBy = lift(R.indexBy)
export const indexOf = lift(R.indexOf)
export const init = lift(R.init)
export const insert = lift(R.insert)
export const insertAll = lift(R.insertAll)
export const intersection = lift(R.intersection)
export const intersectionWith = lift(R.intersectionWith)
export const intersperse = lift(R.intersperse)
export const into = lift(R.into)
export const invert = lift(R.invert)
export const invertObj = lift(R.invertObj)
export const invoker = liftStaged(R.invoker)
export const is = lift(R.is)
export const isArrayLike = lift(R.isArrayLike)
export const isEmpty = lift(R.isEmpty)
export const isNil = lift(R.isNil)
export const join = lift(R.join)
export const juxt = liftStaged(R.juxt)
export const keys = lift1Shallow(R.keys)
export const keysIn = lift(R.keysIn)
export const last = lift(R.last)
export const lastIndexOf = lift(R.lastIndexOf)
export const length = lift1Shallow(R.length)
//export const lens = lift(R.lens)                          -> partial.lenses
//export const lensIndex = lift(R.lensIndex)                -> partial.lenses
//export const lensPath = lift(R.lensPath)                  -> partial.lenses
//export const lensProp = lift(R.lensProp)                  -> partial.lenses
//export const lift = lift(R.lift)                          -> conflict
//export const liftN = lift(R.liftN)                        -> conflict
export const lt = lift(R.lt)
export const lte = lift(R.lte)
export const map = lift(R.map)
export const mapAccum = lift(R.mapAccum)
export const mapAccumRight = lift(R.mapAccumRight)
export const mapObjIndexed = lift(R.mapObjIndexed)
export const match = lift(R.match)
export const mathMod = lift(R.mathMod)
export const max = lift(R.max)
export const maxBy = lift(R.maxBy)
export const mean = lift(R.mean)
export const median = lift(R.median)
export const memoize = liftStaged(R.memoize)
export const merge = lift(R.merge)
export const mergeAll = lift(R.mergeAll)
export const mergeWith = lift(R.mergeWith)
export const mergeWithKey = lift(R.mergeWithKey)
export const min = lift(R.min)
export const minBy = lift(R.minBy)
export const modulo = lift(R.modulo)
export const multiply = lift(R.multiply)
//export const nAry = lift(R.nAry)
export const negate = lift(R.negate)
export const none = lift(R.none)
export const not = lift(R.not)
export const nth = lift(R.nth)
export const nthArg = liftStaged(R.nthArg)
export const objOf = lift(R.objOf)
export const of = lift(R.of)
//export const omit = lift(R.omit)                          -> partial.lenses
//export const once = lift(R.once)                          -> lift staged, usually wrong thing to do?
export const or = lift(R.or)
//export const over = lift(R.over)                          -> partial.lenses
export const pair = lift(R.pair)
export const partial = liftStaged(R.partial)
export const partialRight = liftStaged(R.partialRight)
export const partition = lift(R.partition)
//export const path = lift(R.path)                          -> partial.lenses
//export const pathEq = lift(R.pathEq)                      -> partial.lenses
//export const pathOr = lift(R.pathOr)                      -> partial.lenses
//export const pathSatisfies = lift(R.pathSatisfies)        -> partial.lenses
//export const pick = lift(R.pick)                          -> partial.lenses
//export const pickAll = lift(R.pickAll)                    -> partial.lenses
export const pickBy = lift(R.pickBy)
//export const pipe = lift(R.pipe)                          -> lift staged, useful?
//export const pipeK = lift(R.pipeK)                        -> lift staged, useful?
//export const pipeP = lift(R.pipeP)                        -> lift staged, useful?
//export const pluck = lift(R.pluck)                        -> partial.lenses
export const prepend = lift(R.prepend)
export const product = lift(R.product)
export const project = lift(R.project)
//export const prop = lift(R.prop)                          -> partial.lenses
//export const propEq = lift(R.propEq)                      -> partial.lenses
//export const propIs = lift(R.propIs)                      -> partial.lenses
//export const propOr = lift(R.propOr)                      -> partial.lenses
//export const propSatisfies = lift(R.propSatisfies)        -> partial.lenses
//export const props = lift(R.props)
export const range = lift(R.range)
export const reduce = lift(R.reduce)
export const reduceBy = lift(R.reduceBy)
export const reduceRight = lift(R.reduceRight)
export const reduceWhile = lift(R.reduceWhile)
//export const reduced = lift(R.reduced)                    -> useful?
export const reject = lift(R.reject)
export const remove = lift(R.remove)
export const repeat = lift(R.repeat)
export const replace = lift(R.replace)
export const reverse = lift(R.reverse)
export const scan = lift(R.scan)
export const sequence = lift(R.sequence)
//export const set = lift(R.set)                            -> partial.lenses
export const slice = lift(R.slice)
export const sort = lift(R.sort)
export const sortBy = lift(R.sortBy)
export const split = lift(R.split)
export const splitAt = lift(R.splitAt)
export const splitEvery = lift(R.splitEvery)
export const splitWhen = lift(R.splitWhen)
export const subtract = lift(R.subtract)
export const sum = lift(R.sum)
export const symmetricDifference = lift(R.symmetricDifference)
export const symmetricDifferenceWith = lift(R.symmetricDifferenceWith)
export const tail = lift(R.tail)
export const take = lift(R.take)
export const takeLast = lift(R.takeLast)
export const takeLastWhile = lift(R.takeLastWhile)
export const takeWhile = lift(R.takeWhile)
export const tap = lift(R.tap)
export const test = lift(R.test)
export const times = lift(R.times)
export const toLower = lift(R.toLower)
export const toPairs = lift(R.toPairs)
export const toPairsIn = lift(R.toPairsIn)
export const toString = lift(R.toString)
export const toUpper = lift(R.toUpper)
export const transduce = lift(R.transduce)
export const transpose = lift(R.transpose)
export const traverse = lift(R.traverse)
export const trim = lift(R.trim)
export const tryCatch = liftStaged(R.tryCatch)
export const type = lift(R.type)
export const unapply = liftStaged(R.unapply)
export const unary = liftStaged(R.unary)
export const uncurryN = liftStaged(R.uncurryN)
export const unfold = lift(R.unfold)
export const union = lift(R.union)
export const unionWith = lift(R.unionWith)
export const uniq = lift(R.uniq)
export const uniqBy = lift(R.uniqBy)
export const uniqWith = lift(R.uniqWith)
export const unless = lift(R.unless)
export const unnest = lift(R.unnest)
export const until = lift(R.until)
//export const update = lift(R.update)                      -> partial.lenses
export const useWith = liftStaged(R.useWith)
export const values = lift1(R.values)
export const valuesIn = lift(R.valuesIn)
//export const view = lift(R.view)                          -> partial.lenses, conflict
export const when = lift(R.when)
export const where = lift(R.where)
export const whereEq = lift(R.whereEq)
export const without = lift(R.without)
export const xprod = lift(R.xprod)
export const zip = lift(R.zip)
export const zipObj = lift(R.zipObj)
export const zipWith = lift(R.zipWith)

// Math

export const abs    = lift1Shallow(Math.abs)
export const acos   = lift1Shallow(Math.acos)
export const acosh  = lift1Shallow(Math.acosh)
export const asin   = lift1Shallow(Math.asin)
export const asinh  = lift1Shallow(Math.asinh)
export const atan   = lift1Shallow(Math.atan)
export const atan2  = lift(Math.atan2)
export const atanh  = lift1Shallow(Math.atanh)
export const cbrt   = lift1Shallow(Math.cbrt)
export const ceil   = lift1Shallow(Math.ceil)
export const clz32  = lift1Shallow(Math.clz32)
export const cos    = lift1Shallow(Math.cos)
export const cosh   = lift1Shallow(Math.cosh)
export const exp    = lift1Shallow(Math.exp)
export const expm1  = lift1Shallow(Math.expm1)
export const floor  = lift1Shallow(Math.floor)
export const fround = lift1Shallow(Math.fround)
export const hypot  = lift(Math.hypot)
export const imul   = lift(Math.imul)
export const log    = lift1Shallow(Math.log)
export const log10  = lift1Shallow(Math.log10)
export const log1p  = lift1Shallow(Math.log1p)
export const log2   = lift1Shallow(Math.log2)
export const pow    = lift(Math.pow)
export const round  = lift1Shallow(Math.round)
export const sign   = lift1Shallow(Math.sign)
export const sin    = lift1Shallow(Math.sin)
export const sinh   = lift1Shallow(Math.sinh)
export const sqrt   = lift1Shallow(Math.sqrt)
export const tan    = lift1Shallow(Math.tan)
export const tanh   = lift1Shallow(Math.tanh)
export const trunc  = lift1Shallow(Math.trunc)

//

export const indices = R.pipe(length, lift1Shallow(R.range(0)))
