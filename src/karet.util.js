import * as A from 'kefir.atom'
import * as K from 'kefir'
import * as I from 'infestines'

import * as L from 'partial.lenses'
import * as C from 'kefir.combines'
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
    C.combines(params, params => () => target[method].apply(target, params))
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
export const sink = I.pipe2U(startWith(undefined), C.lift1(toUndefined))
export const takeFirst = I.curry((n, xs) => toConstant(xs).take(n))
export const takeFirstErrors = I.curry((n, xs) => toConstant(xs).takeErrors(n))
export const takeUntilBy = I.curry((ts, xs) => toConstant(xs).takeUntilBy(ts))
export const toProperty = xs => toConstant(xs).toProperty()
export const throttle = I.curry((ms, xs) => toConstant(xs).throttle(ms))
export const fromEvents = I.curry(K.fromEvents)
export const ignoreValues = s => s.ignoreValues()
export const ignoreErrors = s => s.ignoreErrors()

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

export {combines, liftRec} from 'kefir.combines'

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

export const template = observables => C.combines(observables, I.id)

export const tapPartial = C.liftRec(
  I.curry((effect, data) => {
    if (undefined !== data) effect(data)
    return data
  })
)

export const toPartial = fn =>
  C.liftRec(
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
  const xs = Array(n + 1)
  for (let i = 0; i < n; ++i) xs[i] = arguments[i]
  xs[n] = showIso
  return view(C.combines.apply(null, xs), arguments[n])
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

export const actions = C.liftRec((...fns) => (...args) => {
  for (let i = 0, n = fns.length; i < n; ++i)
    if (I.isFunction(fns[i])) fns[i](...args)
})

const invoke = name => e => e[name]()

export const preventDefault = invoke('preventDefault')
export const stopPropagation = invoke('stopPropagation')

// classNames ------------------------------------------------------------------

const cnsImmediate = L.join(' ', [L.flatten, L.when(I.id)])

export const cns = C.liftRec((...xs) => cnsImmediate(xs) || undefined)

// Standard ////////////////////////////////////////////////////////////////////

// JSON ------------------------------------------------------------------------

export const parse = C.liftRec(JSON.parse)
export const stringify = C.liftRec(JSON.stringify)

// Math ------------------------------------------------------------------------

export const abs = C.liftRec(Math.abs)
export const acos = C.liftRec(Math.acos)
export const acosh = C.liftRec(Math.acosh)
export const asin = C.liftRec(Math.asin)
export const asinh = C.liftRec(Math.asinh)
export const atan = C.liftRec(Math.atan)
export const atan2 = C.liftRec(Math.atan2)
export const atanh = C.liftRec(Math.atanh)
export const cbrt = C.liftRec(Math.cbrt)
export const ceil = C.liftRec(Math.ceil)
export const clz32 = C.liftRec(Math.clz32)
export const cos = C.liftRec(Math.cos)
export const cosh = C.liftRec(Math.cosh)
export const exp = C.liftRec(Math.exp)
export const expm1 = C.liftRec(Math.expm1)
export const floor = C.liftRec(Math.floor)
export const fround = C.liftRec(Math.fround)
export const hypot = C.liftRec(Math.hypot)
export const imul = C.liftRec(Math.imul)
export const log = C.liftRec(Math.log)
export const log10 = C.liftRec(Math.log10)
export const log1p = C.liftRec(Math.log1p)
export const log2 = C.liftRec(Math.log2)
export const max = C.liftRec(Math.max)
export const min = C.liftRec(Math.min)
export const pow = C.liftRec(Math.pow)
export const round = C.liftRec(Math.round)
export const sign = C.liftRec(Math.sign)
export const sin = C.liftRec(Math.sin)
export const sinh = C.liftRec(Math.sinh)
export const sqrt = C.liftRec(Math.sqrt)
export const tan = C.liftRec(Math.tan)
export const tanh = C.liftRec(Math.tanh)
export const trunc = C.liftRec(Math.trunc)

// String ----------------------------------------------------------------------

export const string = C.liftRec(String.raw)

// Atoms ///////////////////////////////////////////////////////////////////////

// Creating --------------------------------------------------------------------

export const atom = value => new A.Atom(value)
export const variable = () => new A.Atom()
export const molecule = template => new A.Molecule(template)

// Transactions ----------------------------------------------------------------

export {holding} from 'kefir.atom'

// Side-effects ----------------------------------------------------------------

export const set = I.curry((settable, xs) => {
  const ss = C.combines(xs, xs => settable.set(xs))
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
      ? new A.Join(C.combines(l, l => xs.view(l)))
      : xs.view(l)
  } else {
    return C.combines(l, xs, L.get)
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
