import * as A from 'kefir.atom'
import * as K from 'kefir'
import * as I from 'infestines'

import * as L from 'partial.lenses'
import * as F from 'karet.lift'
import * as Karet from 'karet'
import * as React from 'react'

////////////////////////////////////////////////////////////////////////////////

const setName =
  process.env.NODE_ENV === 'production'
    ? x => x
    : (to, name) => I.defineNameU(to, name)

// Actions /////////////////////////////////////////////////////////////////////

const doN = (n, method, name) =>
  I.arityN(
    n + 1,
    setName(
      (target, ...params) =>
        F.combine(params, (...params) =>
          setName(() => target[method].apply(target, params), name)
        ),
      name
    )
  )

// Kefir ///////////////////////////////////////////////////////////////////////

const isMutable = x => x instanceof A.AbstractMutable
const isObservable = x => x instanceof K.Observable
const isProperty = x => x instanceof K.Property
const isStream = x => x instanceof K.Stream

const toUndefined = _ => {}
const toObservable = x => (isObservable(x) ? x : K.constant(x))

const invokeIf = (fn, x) => fn && fn(x)
const toHandler = fns => ({type, value}) => invokeIf(fns[type], value)

// Curried ---------------------------------------------------------------------

export const debounce = I.curry(function debounce(ms, xs) {
  return toObservable(xs).debounce(ms)
})
export const changes = xs => toObservable(xs).changes()
export const serially = xs => K.concat(xs.map(toObservable))
export const parallel = K.merge
export const delay = I.curry(function delay(ms, xs) {
  return toObservable(xs).delay(ms)
})
export const mapValue = I.curry(function mapValue(fn, xs) {
  return toObservable(xs).map(fn)
})
export const flatMapParallel = I.curry(function flatMapParallel(fn, xs) {
  return toObservable(xs).flatMap(I.pipe2U(fn, toObservable))
})
export const flatMapSerial = I.curry(function flatMapSerial(fn, xs) {
  return toObservable(xs).flatMapConcat(I.pipe2U(fn, toObservable))
})
export const flatMapErrors = I.curry(function flatMapErrors(fn, xs) {
  return toObservable(xs).flatMapErrors(I.pipe2U(fn, toObservable))
})
export const flatMapLatest = I.curry(function flatMapLatest(fn, xs) {
  return toObservable(xs).flatMapLatest(I.pipe2U(fn, toObservable))
})
export const foldPast = I.curry(function foldPast(fn, s, xs) {
  return toObservable(xs).scan(fn, s)
})
export const interval = I.curry(K.interval)
export const later = I.curry(K.later)
export const never = K.never()
export const on = I.curry(function on(efs, xs) {
  return toObservable(xs).onAny(toHandler(efs))
})
export const sampledBy = I.curry(function sampledBy(es, xs) {
  return toObservable(xs).sampledBy(es)
})
export const skipFirst = I.curry(function skipFirst(n, xs) {
  return toObservable(xs).skip(n)
})
export const skipDuplicates = I.curry(function skipDuplicates(equals, xs) {
  return toObservable(xs).skipDuplicates(equals)
})
export const skipUnless = I.curry(function skipUnless(p, xs) {
  return toObservable(xs).filter(p)
})
export const takeFirst = I.curry(function takeFirst(n, xs) {
  return toObservable(xs).take(n)
})
export const takeFirstErrors = I.curry(function takeFirstErrors(n, xs) {
  return toObservable(xs).takeErrors(n)
})
export const takeUntilBy = I.curry(function takeUntilBy(ts, xs) {
  return toObservable(xs).takeUntilBy(ts)
})
export const toProperty = xs =>
  isProperty(xs) ? xs : isStream(xs) ? xs.toProperty() : K.constant(xs)
export const throttle = I.curry(function throttle(ms, xs) {
  return toObservable(xs).throttle(ms)
})
export const fromEvents = I.curry(K.fromEvents)
export const ignoreValues = s => s.ignoreValues()
export const ignoreErrors = s => s.ignoreErrors()

// Additional ------------------------------------------------------------------

export const startWith = I.curry(function startWith(x, xs) {
  return toObservable(xs).toProperty(() => x)
})
export const sink = I.pipe2U(startWith(undefined), F.lift(toUndefined))

export const consume = I.pipe2U(mapValue, sink)
export const endWith = I.curry(function endWith(v, xs) {
  return toObservable(xs).concat(toObservable(v))
})
export const lazy = th => toProperty(flatMapLatest(th, toProperty()))
export const skipIdenticals = skipDuplicates(I.identicalU)
export const skipWhen = I.curry(function skipWhen(p, xs) {
  return toObservable(xs).filter(x => !p(x))
})
export const template = observables => F.combine([observables], I.id)

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

export const not = F.lift(function not(x) {
  return !x
})

const mkBop = (zero, bop) =>
  function() {
    let n = arguments.length
    let op = n ? arguments[--n] : zero
    while (n--) {
      op = bop(arguments[n], op)
    }
    return op
  }

export const and = setName(
  mkBop(true, function and(l, r) {
    return toProperty(flatMapLatest(l => l && r, l))
  }),
  'andAlso'
)

export const or = setName(
  mkBop(false, function or(l, r) {
    return toProperty(flatMapLatest(l => l || r, l))
  }),
  'orElse'
)

const ifteU = function ifElse(b, t, e) {
  return toProperty(flatMapLatest(b => (b ? t : e), b))
}

export const ifElse = I.curry(ifteU)
export const unless = I.curry(function unless(b, e) {
  return ifteU(b, undefined, e)
})
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

// Animation -------------------------------------------------------------------

const Ticks = I.inherit(
  function Ticks(duration) {
    const self = this
    K.Property.call(self)
    self.d = duration
    self.s = self.i = 0
  },
  K.Property,
  {
    _onActivation() {
      const self = this
      const step = t => {
        if (!self.s) self.s = t
        let n = (t - self.s) / self.d
        if (1 < n) n = 1
        self._emitValue(n)
        if (n < 1) {
          self.i = requestAnimationFrame(step)
        } else {
          self._emitEnd()
        }
      }
      self.i = requestAnimationFrame(step)
    },
    _onDeactivation() {
      cancelAnimationFrame(this.i)
    }
  }
)

export const animationSpan =
  process.env.NODE_ENV === 'production'
    ? typeof window === 'undefined'
      ? I.always(never)
      : d => new Ticks(d)
    : function animationSpan(d) {
        return typeof window === 'undefined' ? never : new Ticks(d)
      }

// Lifting ---------------------------------------------------------------------

export {combine, lift, liftRec} from 'karet.lift'

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

export const doPush = doN(1, 'push', 'doPush')
export const doError = doN(1, 'error', 'doError')
export const doEnd = doN(0, 'end', 'doEnd')

// Convenience /////////////////////////////////////////////////////////////////

export const scope = fn => fn()

export const tapPartial = F.lift(
  I.curry(function tapPartial(effect, data) {
    if (undefined !== data) effect(data)
    return data
  })
)

export const toPartial = fn =>
  F.liftRec(
    I.arityN(fn.length, function toPartial(...xs) {
      return xs.every(I.isDefined) ? fn(...xs) : undefined
    })
  )

const thruPlain = function thru(x, fs) {
  for (let i = 0, n = fs.length; i < n; ++i) x = fs[i](x)
  return x
}

const thruProperty = function thru(x, fs) {
  return toProperty(
    flatMapLatest(function thru(fs) {
      return thruPlain(x, fs)
    }, fs)
  )
}

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
    return function through(x) {
      return thruPlain(x, fs)
    }
  } else {
    fs = template(fs)
    return function through(x) {
      return thruProperty(x, fs)
    }
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
  const iso = F.combine(xs, showIso)
  const s = arguments[n]
  return isStream(s)
    ? isProperty(iso)
      ? K.combine([iso, s], L.get)
      : mapValue(L.get(iso), s)
    : view(iso, s)
}

// React ///////////////////////////////////////////////////////////////////////

export const onUnmount = effect =>
  K.stream(I.always(effect)).toProperty(I.always(undefined))

// DOM Binding -----------------------------------------------------------------

const getProp = (name, object) =>
  function getProp({target}) {
    const value = target[name]
    if (I.isFunction(object.push)) {
      object.push(value)
    } else {
      object.set(value)
    }
  }

export function getProps(template) {
  let result
  for (const k in template) {
    if (result)
      return function getProps(e) {
        A.holding(function getProps() {
          for (const k in template) getProp(k, template[k])(e)
        })
      }
    result = getProp(k, template[k])
  }
  return result
}

export function setProps(observables) {
  let observable
  let callback
  return function setProps(e) {
    if (callback) {
      observable.offAny(callback)
      observable = callback = null
    }
    if (e) {
      callback = function setProps(ev) {
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

// Input components ------------------------------------------------------------

function tryGet(name, props) {
  const value = props[name]
  if (null != value) return getProp(name, value)
}

const mkBound = (Elem, name, checked) =>
  React.forwardRef(
    setName((props, ref) => {
      const getter =
        tryGet('value', props) || (checked && tryGet(checked, props))
      if (getter)
        props = L.set('onChange', actions(getter, props.onChange), props)
      return Karet.createElement(Elem, ref ? L.set('ref', ref, props) : props)
    }, name)
  )

export const Select = mkBound('select', 'Select')
export const Input = mkBound('input', 'Input', 'checked')
export const TextArea = mkBound('textarea', 'TextArea')

// Refs ------------------------------------------------------------------------

export const refTo = settable =>
  function refTo(elem) {
    if (null !== elem) settable.set(elem)
  }

// Events ----------------------------------------------------------------------

const actionsCollect = L.collect([L.flatten, L.when(I.isFunction)])

export const actions = F.lift(function actions(...fnsIn) {
  const fns = actionsCollect(fnsIn)
  switch (fns.length) {
    case 0:
      return undefined
    case 1:
      return fns[0]
    default:
      return function actions(e) {
        A.holding(() => {
          for (let i = 0, n = fns.length; i < n; ++i) fns[i](e)
        })
      }
  }
})

const invoke = name => setName(e => e[name](), name)

export const preventDefault = invoke('preventDefault')
export const stopPropagation = invoke('stopPropagation')

// classNames ------------------------------------------------------------------

const cnsImmediate = L.join(' ', [L.flatten, L.when(I.id)])

export const cns = F.lift(function cns(...xs) {
  return cnsImmediate(xs) || undefined
})

// Interop ---------------------------------------------------------------------

export const pure = Component =>
  I.inherit(
    function Pure(props) {
      React.PureComponent.call(this, props)
    },
    React.PureComponent,
    {
      render() {
        return <Component {...this.props} />
      }
    }
  )

function shallowWhereEq(lhs, rhs) {
  for (const k in lhs) if (!I.identicalU(lhs[k], rhs[k])) return false
  return true
}

const shallowEquals = (lhs, rhs) =>
  shallowWhereEq(lhs, rhs) && shallowWhereEq(rhs, lhs)

function updateObs(prevObs, nextProps, plain) {
  const nextObs = {}
  for (const k in nextProps) {
    const v = nextProps[k]
    if (plain(k)) {
      nextObs[k] = v
    } else {
      const obs = (nextObs[k] =
        prevObs[k] || new K.Property().skipDuplicates(I.identicalU))
      obs._emitValue(v)
    }
  }
  for (const k in prevObs) {
    if (!plain(k)) {
      const v = prevObs[k]
      if (v !== nextObs[k]) {
        v._emitEnd()
      }
    }
  }
  return nextObs
}

export const toReactExcept = I.curry(function toReactExcept(plain, Calmm) {
  const Pure = pure(Calmm)
  return I.inherit(
    function ToClass(props) {
      React.PureComponent.call(this, props)
      this.o = updateObs(I.object0, props, plain)
    },
    React.PureComponent,
    {
      componentDidUpdate() {
        const prev = this.o
        const next = (this.o = updateObs(prev, this.props, plain))
        if (!shallowEquals(prev, next)) {
          this.forceUpdate()
        }
      },
      render() {
        return <Pure {...this.o} />
      },
      componentWillUnmount() {
        updateObs(this.o, I.object0, plain)
      }
    }
  )
})

export const toReact = toReactExcept(I.always(false))

export {fromClass as toKaret} from 'karet'

// Standard ////////////////////////////////////////////////////////////////////

// JSON ------------------------------------------------------------------------

export const parse = F.lift(JSON.parse)
export const stringify = F.lift(JSON.stringify)

// URIs ------------------------------------------------------------------------

const du = F.lift(decodeURI)
const duc = F.lift(decodeURIComponent)
const eu = F.lift(encodeURI)
const euc = F.lift(encodeURIComponent)

export {
  du as decodeURI,
  duc as decodeURIComponent,
  eu as encodeURI,
  euc as encodeURIComponent
}

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

export const set = I.curry(function set(settable, xs) {
  const ss = F.combine([xs], xs => settable.set(xs))
  if (isProperty(ss)) return ss.toProperty(toUndefined)
})

// Actions on atoms ------------------------------------------------------------

export const doModify = doN(1, 'modify', 'doModify')
export const doSet = doN(1, 'set', 'doSet')
export const doRemove = doN(0, 'remove', 'doRemove')

// Decomposing -----------------------------------------------------------------

const getMutable = (xs, l) => xs.view(l)
const getProperty = (xs, l) => F.combine([l, xs], L.get)
const getConstant = (xs, l) => L.get(l, xs)
const chooseGet = xs =>
  isMutable(xs) ? getMutable : isProperty(xs) ? getProperty : getConstant

//

const destructureUnsupported = name =>
  function unsupported() {
    throw Error(`destructure: \`${name}\` unsupported`)
  }

const DestructureCommon = {
  deleteProperty: destructureUnsupported('deleteProperty'),
  has: destructureUnsupported('has'),
  ownKeys: destructureUnsupported('ownKeys'),
  set: destructureUnsupported('set')
}

const DestructureMutable = I.assign({}, DestructureCommon, {
  get: getMutable,
  set: (target, prop, value) => !target.modify(L.set(prop, value)),
  deleteProperty: (target, prop) => !target.modify(L.remove(prop))
})

const DestructureProperty = I.assign({}, DestructureCommon, {
  get: getProperty
})

export function destructure(x) {
  if (isMutable(x)) {
    return new Proxy(x, DestructureMutable)
  } else if (isProperty(x)) {
    return new Proxy(x, DestructureProperty)
  } else {
    return x
  }
}

//

export const view = I.curry(function view(l, xs) {
  if (isMutable(xs)) {
    return isProperty(template(l))
      ? new A.Join(F.combine([l], l => xs.view(l)))
      : getMutable(xs, l)
  } else {
    return getProperty(xs, l)
  }
})

//

export const mapElems = I.curry(function mapElems(xi2y, xs) {
  const vs = []
  const get = chooseGet(xs)
  return thru(
    xs,
    foldPast(function mapElems(ysIn, xsIn) {
      const ysN = ysIn.length
      const xsN = xsIn.length
      if (xsN === ysN) return ysIn
      const m = Math.min(ysN, xsN)
      const ys = ysIn.slice(0, m)
      for (let i = xsN; i < ysN; ++i) vs[i]._onDeactivation()
      for (let i = m; i < xsN; ++i) ys[i] = xi2y((vs[i] = get(xs, i)), i)
      vs.length = xsN
      return ys
    }, []),
    skipIdenticals
  )
})

export const mapElemsWithIds = I.curry(function mapElemsWithIds(idL, xi2y, xs) {
  const id2info = new Map()
  const idOf = L.get(idL)
  const pred = (x, _, info) => idOf(x) === info.id
  const get = chooseGet(xs)
  return thru(
    xs,
    foldPast(function mapElemsWithIds(ysIn, xsIn) {
      const n = xsIn.length
      let ys = ysIn.length === n ? ysIn : Array(n)
      for (let i = 0; i < n; ++i) {
        const id = idOf(xsIn[i])
        let info = id2info.get(id)
        if (void 0 === info) {
          id2info.set(id, (info = {}))
          info.id = id
          info.hint = i
          info.elem = xi2y((info.view = get(xs, L.find(pred, info))), id)
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
