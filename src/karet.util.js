import * as A from 'kefir.atom'
import * as K from 'kefir'
import * as I from 'infestines'

import * as L from 'partial.lenses'
import * as F from 'karet.lift'
import * as React from 'react'

const header = 'karet.util: '

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1
    console.warn(header + m)
  }
}

// Actions /////////////////////////////////////////////////////////////////////

const doN = (n, method) =>
  I.arityN(n + 1, (target, ...params) =>
    F.combine(params, (...params) => () => target[method].apply(target, params))
  )

// Kefir ///////////////////////////////////////////////////////////////////////

const isMutable = x => x instanceof A.AbstractMutable
const isProperty = x => x instanceof K.Property
const isObservable = x => x instanceof K.Observable

const toUndefined = _ => {}
const toConstant = x => (isObservable(x) ? x : K.constant(x))

const invokeIf = (fn, x) => fn && fn(x)
const toHandler = fns => ({type, value}) => invokeIf(fns[type], value)

// Curried ---------------------------------------------------------------------

export const debounce = I.curry((ms, xs) => toConstant(xs).debounce(ms))
export const changes = xs => toConstant(xs).changes()
export const serially = xs => K.concat(xs.map(toConstant))
export const parallel = K.merge
export const delay = I.curry((ms, xs) => toConstant(xs).delay(ms))
export const endWith = I.curry((v, xs) => toConstant(xs).concat(toConstant(v)))
export const mapValue = I.curry((fn, xs) => toConstant(xs).map(fn))
export const flatMapParallel = I.curry((fn, xs) =>
  toConstant(xs).flatMap(I.pipe2U(fn, toConstant))
)
export const flatMapSerial = I.curry((fn, xs) =>
  toConstant(xs).flatMapConcat(I.pipe2U(fn, toConstant))
)
export const flatMapErrors = I.curry((fn, xs) =>
  toConstant(xs).flatMapErrors(I.pipe2U(fn, toConstant))
)
export const flatMapLatest = I.curry((fn, xs) =>
  toConstant(xs).flatMapLatest(I.pipe2U(fn, toConstant))
)
export const foldPast = I.curry((fn, s, xs) => toConstant(xs).scan(fn, s))
export const interval = I.curry(K.interval)
export const later = I.curry(K.later)
export const lazy = th => toProperty(flatMapLatest(th, toProperty()))
export const never = K.never()
export const on = I.curry((efs, xs) => toConstant(xs).onAny(toHandler(efs)))
export const sampledBy = I.curry((es, xs) => toConstant(xs).sampledBy(es))
export const skipFirst = I.curry((n, xs) => toConstant(xs).skip(n))
export const skipDuplicates = I.curry((equals, xs) =>
  toConstant(xs).skipDuplicates(equals)
)
export const skipIdenticals = skipDuplicates(I.identicalU)
export const skipUnless = I.curry((p, xs) => toConstant(xs).filter(p))
export const skipWhen = I.curry((p, xs) => toConstant(xs).filter(x => !p(x)))
export const startWith = I.curry((x, xs) => toConstant(xs).toProperty(() => x))
export const sink = I.pipe2U(startWith(undefined), F.lift(toUndefined))
export const takeFirst = I.curry((n, xs) => toConstant(xs).take(n))
export const takeFirstErrors = I.curry((n, xs) => toConstant(xs).takeErrors(n))
export const takeUntilBy = I.curry((ts, xs) => toConstant(xs).takeUntilBy(ts))
export const toProperty = xs => toConstant(xs).toProperty()
export const throttle = I.curry((ms, xs) => toConstant(xs).throttle(ms))
export const fromEvents = I.curry(K.fromEvents)
export const ignoreValues = s => s.ignoreValues()
export const ignoreErrors = s => s.ignoreErrors()

// Promises --------------------------------------------------------------------

const FromPromise = I.inherit(
  function FromPromise(makePromise) {
    K.Property.call(this)
    this.m = makePromise
    this.a = undefined
  },
  K.Property,
  {
    _onActivation() {
      const self = this
      const m = self.m
      if (m) {
        self.m = null
        const handle = m()
        const {abort} = handle
        const ready = handle.ready || handle
        self.a = abort
        ready.then(
          result => {
            const a = self.a
            if (a !== null) {
              self.a = null
              self._emitValue(result)
              self._emitEnd()
            }
          },
          error => {
            const a = self.a
            if (a !== null) {
              self.a = null
              self._emitError(error)
              self._emitEnd()
            }
          }
        )
      }
    },
    _onDeactivation() {
      const self = this
      const a = self.a
      if (a) {
        self.a = null
        self._emitEnd()
        a()
      }
    }
  }
)

export const fromPromise = makePromise => new FromPromise(makePromise)

// Conditionals ----------------------------------------------------------------

const ifteU = (b, t, e) => toProperty(flatMapLatest(b => (b ? t : e), b))

export const ifElse = I.curry(ifteU)
export const unless = I.curry((b, e) => ifteU(b, undefined, e))
export const when = I.arityN(2, ifteU)

export function cond(_) {
  let n = arguments.length
  let op = undefined
  while (n--) {
    const c = arguments[n]
    op = c.length !== 1 ? ifteU(c[0], c[1], op) : c[0]
  }
  return op
}

// Lifting ---------------------------------------------------------------------

export {combine, lift, liftRec} from 'karet.lift'

import {combines as combinesRaw} from 'kefir.combines'

export const combines =
  process.env.NODE_ENV === 'production'
    ? combinesRaw
    : function() {
        warn(
          combines,
          '`combines` has been obsoleted.  Please use `combine`, `template`, `lift`, or `liftRec` instead.'
        )
        return combinesRaw.apply(null, arguments)
      }

// Bus -------------------------------------------------------------------------

const streamPrototype = K.Stream.prototype

export const Bus = I.inherit(
  function Bus() {
    K.Stream.call(this)
  },
  K.Stream,
  {
    push: streamPrototype._emitValue,
    error: streamPrototype._emitError,
    end: streamPrototype._emitEnd
  }
)

export const bus = () => new Bus()

// Actions on buses ------------------------------------------------------------

export const doPush = doN(1, 'push')
export const doError = doN(1, 'error')
export const doEnd = doN(0, 'end')

// Convenience /////////////////////////////////////////////////////////////////

export const seq =
  process.env.NODE_ENV === 'production'
    ? I.seq
    : function(_) {
        warn(seq, '`seq` has been obsoleted.  Use `thru` instead.')
        return I.seq.apply(null, arguments)
      }

export const seqPartial =
  process.env.NODE_ENV === 'production'
    ? I.seqPartial
    : function(_) {
        warn(
          seqPartial,
          '`seqPartial` has been deprecated.  There is no replacement for it.'
        )
        return I.seqPartial.apply(null, arguments)
      }

export const scope = fn => fn()

export const template = observables => F.combine([observables], I.id)

export const tapPartial = F.lift(
  I.curry((effect, data) => {
    if (undefined !== data) effect(data)
    return data
  })
)

export const toPartial = fn =>
  F.liftRec(
    I.arityN(
      fn.length,
      (...xs) => (xs.every(I.isDefined) ? fn(...xs) : undefined)
    )
  )

function thruPlain(x, fs) {
  for (let i = 0, n = fs.length; i < n; ++i) x = fs[i](x)
  return x
}

const thruProperty = (x, fs) =>
  toProperty(flatMapLatest(fs => thruPlain(x, fs), fs))

export function thru(x) {
  const n = arguments.length
  let fs = undefined
  for (let i = 1; i < n; ++i) {
    const f = arguments[i]
    if (fs) {
      fs.push(f)
    } else if (isProperty(f)) {
      fs = [f]
    } else {
      x = f(x)
    }
  }
  if (fs) {
    return thruProperty(x, template(fs))
  } else {
    return x
  }
}

export function through() {
  const n = arguments.length
  let fs = Array(n)
  let plain = true
  for (let i = 0; i < n; ++i) {
    const f = (fs[i] = arguments[i])
    if (plain) plain = !isProperty(f)
  }
  if (plain) {
    return x => thruPlain(x, fs)
  } else {
    fs = template(fs)
    return x => thruProperty(x, fs)
  }
}

// Debugging ///////////////////////////////////////////////////////////////////

const showIso = (...xs) =>
  L.iso(
    x => console.log.apply(console, xs.concat([x])) || x,
    y => console.log.apply(console, xs.concat([y, '(set)'])) || y
  )

export function show(_) {
  const n = arguments.length - 1
  const xs = Array(n)
  for (let i = 0; i < n; ++i) xs[i] = arguments[i]
  return view(F.combine(xs, showIso), arguments[n])
}

// React ///////////////////////////////////////////////////////////////////////

export const onUnmount = effect =>
  K.stream(I.always(effect)).toProperty(I.always(undefined))

// Context ---------------------------------------------------------------------

const {Provider, Consumer} = React.createContext(I.object0)

export const Context = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn => props => {
      warn(
        Context,
        '`Context` has been obsoleted.  Just use the new React context API.'
      )
      return fn(props)
    })(({context, children}) => <Provider value={context}>{children}</Provider>)

export const withContext = (process.env.NODE_ENV === 'production'
  ? I.id
  : fn => props => {
      warn(
        withContext,
        '`withContext` has been obsoleted.  Just use the new React context API.'
      )
      return fn(props)
    })(toElem => props => (
  <Consumer>{context => toElem(props, context)}</Consumer>
))

// DOM Binding -----------------------------------------------------------------

export const getProps = template => ({target}) => {
  for (const k in template) template[k].set(target[k])
}

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
          case 'value': {
            const observables = ev.value
            for (const k in observables) e[k] = observables[k]
            break
          }
          case 'error':
            throw ev.value
          case 'end':
            observable = callback = null
            break
        }
      }
      observable = template(observables)
      observable.onAny(callback)
    }
  }
}

// Refs ------------------------------------------------------------------------

export const refTo = settable => elem => {
  if (null !== elem) settable.set(elem)
}

// Events ----------------------------------------------------------------------

export const actions = F.lift((...fns) => (...args) => {
  for (let i = 0, n = fns.length; i < n; ++i)
    if (I.isFunction(fns[i])) fns[i](...args)
})

const invoke = name => e => e[name]()

export const preventDefault = invoke('preventDefault')
export const stopPropagation = invoke('stopPropagation')

// classNames ------------------------------------------------------------------

const cnsImmediate = L.join(' ', [L.flatten, L.when(I.id)])

export const cns = F.lift((...xs) => cnsImmediate(xs) || undefined)

// Standard ////////////////////////////////////////////////////////////////////

// JSON ------------------------------------------------------------------------

export const parse = F.lift(JSON.parse)
export const stringify = F.lift(JSON.stringify)

// Math ------------------------------------------------------------------------

export const abs = F.lift(Math.abs)
export const acos = F.lift(Math.acos)
export const acosh = F.lift(Math.acosh)
export const asin = F.lift(Math.asin)
export const asinh = F.lift(Math.asinh)
export const atan = F.lift(Math.atan)
export const atan2 = F.lift(Math.atan2)
export const atanh = F.lift(Math.atanh)
export const cbrt = F.lift(Math.cbrt)
export const ceil = F.lift(Math.ceil)
export const clz32 = F.lift(Math.clz32)
export const cos = F.lift(Math.cos)
export const cosh = F.lift(Math.cosh)
export const exp = F.lift(Math.exp)
export const expm1 = F.lift(Math.expm1)
export const floor = F.lift(Math.floor)
export const fround = F.lift(Math.fround)
export const hypot = F.lift(Math.hypot)
export const imul = F.lift(Math.imul)
export const log = F.lift(Math.log)
export const log10 = F.lift(Math.log10)
export const log1p = F.lift(Math.log1p)
export const log2 = F.lift(Math.log2)
export const max = F.lift(Math.max)
export const min = F.lift(Math.min)
export const pow = F.lift(Math.pow)
export const round = F.lift(Math.round)
export const sign = F.lift(Math.sign)
export const sin = F.lift(Math.sin)
export const sinh = F.lift(Math.sinh)
export const sqrt = F.lift(Math.sqrt)
export const tan = F.lift(Math.tan)
export const tanh = F.lift(Math.tanh)
export const trunc = F.lift(Math.trunc)

// String ----------------------------------------------------------------------

export const string = F.lift(String.raw)

// Atoms ///////////////////////////////////////////////////////////////////////

// Creating --------------------------------------------------------------------

export const atom = value => new A.Atom(value)
export const variable = () => new A.Atom()
export const molecule = template => new A.Molecule(template)

// Transactions ----------------------------------------------------------------

export {holding} from 'kefir.atom'

// Side-effects ----------------------------------------------------------------

export const set = I.curry((settable, xs) => {
  const ss = F.combine([xs], xs => settable.set(xs))
  if (isProperty(ss)) return ss.toProperty(toUndefined)
})

// Actions on atoms ------------------------------------------------------------

export const doModify = doN(1, 'modify')
export const doSet = doN(1, 'set')
export const doRemove = doN(0, 'remove')

// Decomposing -----------------------------------------------------------------

export const view = I.curry((l, xs) => {
  if (isMutable(xs)) {
    return isProperty(template(l))
      ? new A.Join(F.combine([l], l => xs.view(l)))
      : xs.view(l)
  } else {
    return F.combine([l, xs], L.get)
  }
})

export const mapElems = I.curry((xi2y, xs) => {
  const vs = []
  return thru(
    xs,
    foldPast((ysIn, xsIn) => {
      const ysN = ysIn.length
      const xsN = xsIn.length
      if (xsN === ysN) return ysIn
      const m = Math.min(ysN, xsN)
      const ys = ysIn.slice(0, m)
      for (let i = xsN; i < ysN; ++i) vs[i]._onDeactivation()
      for (let i = m; i < xsN; ++i) ys[i] = xi2y((vs[i] = view(i, xs)), i)
      vs.length = xsN
      return ys
    }, []),
    skipIdenticals
  )
})

export const mapElemsWithIds = I.curry((idL, xi2y, xs) => {
  const id2info = new Map()
  const idOf = L.get(idL)
  const pred = (x, _, info) => idOf(x) === info.id
  return thru(
    xs,
    foldPast((ysIn, xsIn) => {
      const n = xsIn.length
      let ys = ysIn.length === n ? ysIn : Array(n)
      for (let i = 0; i < n; ++i) {
        const id = idOf(xsIn[i])
        let info = id2info.get(id)
        if (void 0 === info) {
          id2info.set(id, (info = {}))
          info.id = id
          info.hint = i
          info.elem = xi2y((info.view = view(L.find(pred, info), xs)), id)
        }
        if (ys[i] !== info.elem) {
          info.hint = i
          if (ys === ysIn) ys = ys.slice(0)
          ys[i] = info.elem
        }
      }
      if (ys !== ysIn) {
        id2info.forEach((info, id) => {
          if (ys[info.hint] !== info.elem) {
            info.view._onDeactivation()
            id2info.delete(id)
          }
        })
      }
      return ys
    }, []),
    skipIdenticals
  )
})
