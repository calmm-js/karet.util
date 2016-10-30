import * as A                 from "kefir.atom"
import {Observable, constant} from "kefir"
import * as L                 from "partial.lenses"
import * as R                 from "ramda"
import K, * as C              from "kefir.combines"
import React, * as Karet      from "karet"

//

export default K
export const lift1 = C.lift1
export const lift1Shallow = C.lift1Shallow
export const lift = C.lift

//

export const fromKefir = Karet.fromKefir

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

const mapCachedMap = x => x[1]

export const mapCached = R.curry((fromId, ids) =>
  ids instanceof Observable
  ? K(ids.scan(mapCachedStep(fromId), mapCachedInit), mapCachedMap)
  : mapCachedMap(mapCachedStep(fromId)(mapCachedInit, ids)))

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

export const pipe = (f, ...fns) => R.pipe(lift(f), ...fns.map(lift1)) // XXX Remove?

export const scope = fn => fn()

export const toPartial = fn => R.curryN(fn.length, (...xs) =>
  R.any(R.equals(undefined), xs) ? undefined : fn(...xs))

export const show = x => console.log(x) || x

export const staged = fn => R.curryN(fn.length, (...xs) =>
  fn.length === xs.length
  ? fn(...xs)
  : fn(...xs.slice(0, fn.length))(...xs.slice(fn.length)))

//

export const mapIndexed = staged(xi2y => lift1(xs => xs.map((x, i) => xi2y(x, i))))

export const filter = lift(R.filter)
export const keys = lift1Shallow(R.keys)
export const length = lift1Shallow(R.length)
export const map = lift(R.map)
export const range = lift(R.range)
export const sort = lift(R.sort)
export const sortBy = lift(R.sortBy)
export const values = lift1(R.values)

export const indices = R.pipe(length, lift1Shallow(R.range(0)))

const invoke = thunk => typeof thunk === "function" ? thunk() : thunk

export const ifte = lift((b, t, e) => invoke(b ? t : e))
export const when = lift((b, fn) => b ? invoke(fn) : null)

//

const viewProp = (l, xs) => K(xs, L.get(l))

export const view = R.curry((l, xs) =>
  xs instanceof A.AbstractMutable ? xs.view(l) : viewProp(l, xs))

//

const toNull = () => null

export const sink = stream => K(constant(null).concat(stream), toNull)

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
