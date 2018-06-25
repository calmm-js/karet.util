import * as L from 'kefir.partial.lenses'
import * as R from 'kefir.ramda'
import * as React from 'karet'
import ReactDOM from 'react-dom/server'
import {Observable, Property, Stream, constant as C} from 'kefir'

import {AbstractMutable} from 'kefir.atom'
import * as U from '../dist/karet.util.cjs'

function show(x) {
  switch (typeof x) {
    case 'string':
    case 'object':
      return JSON.stringify(x)
    default:
      return `${x}`
  }
}

const toExpr = f =>
  f
    .toString()
    .replace(/\s+/g, ' ')
    .replace(/^\s*function\s*\(\s*\)\s*{\s*(return\s*)?/, '')
    .replace(/\s*;?\s*}\s*$/, '')
    .replace(/function\s*(\([a-zA-Z]*\))\s*/g, '$1 => ')
    .replace(/{\s*return\s*([^{;]+)\s*;\s*}/g, '$1')
    .replace(/\(([a-zA-Z0-9_]+)\) =>/g, '$1 =>')
    .replace(/\(0, _kefir[^.]*[.]constant\)/g, 'C')
    .replace(/_kefir[^.][.]/g, '')

const testEq = (expect, thunk) =>
  it(`${toExpr(thunk)} => ${show(expect)}`, done => {
    const actual = thunk()
    const check = actual => {
      const eq = R.equals(actual, expect)
      if (eq instanceof Observable || !eq) {
        done(Error(`Expected: ${show(expect)}, actual: ${show(actual)}`))
      } else {
        done()
      }
    }
    if (actual instanceof Observable) {
      U.thru(actual, U.takeFirst(1), U.on({value: check}))
    } else {
      check(actual)
    }
  })

const testRender = (expect, vdomThunk) =>
  it(`${expect}`, () => {
    const actual = ReactDOM.renderToStaticMarkup(vdomThunk())

    if (actual !== expect)
      throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
  })

describe('U.actions', () => {
  testEq('1z2z', () => {
    let i = ''
    U.actions(
      false,
      C(x => (i += '1' + x)),
      undefined,
      x => (i += '2' + x)
    ).onValue(f => f('z'))
    return i
  })
  testEq(undefined, () => U.actions(false, 0, 'not a function'))
  function theOnlyFunction() {}
  testEq(theOnlyFunction, () =>
    U.actions(false, theOnlyFunction, 'not a function')
  )
})

describe('U.view', () => {
  testEq(101, () => U.view('x', C({x: 101})))
  testEq(101, () => U.view(U.serially(['x']).toProperty(), C({x: 101})))
  testEq(101, () =>
    U.view(
      [U.thru(U.serially([0, 'x']).toProperty(), U.skipUnless(R.is(String)))],
      C({x: 101})
    )
  )
  testEq(101, () => U.view('x', {x: 101}))
  testEq(101, () => U.view('x', U.atom({x: 101})))
  testEq(101, () =>
    U.view(U.thru(C('x'), U.skipWhen(R.is(Number))), U.atom({x: 101}))
  )
  testEq(101, () =>
    U.view(
      [U.thru(C('x'), U.flatMapSerial(x => x), U.toProperty)],
      U.atom({x: 101})
    )
  )
})

describe('U.cns', () => {
  testEq(undefined, () => U.cns())
  testEq('a b', () => U.cns(null, ['a', false], undefined, C('b'), 0, ''))
})

describe('U.mapElems', () => {
  testEq([[1, 0, 1], [3, 1, 2], [4, 2, 4]], () => {
    let uniq = 0
    const xs = U.atom([2, 1, 1])
    const ys = U.thru(
      U.skipFirst(1, xs),
      U.mapElems((x, i) => [x, i, ++uniq]),
      U.flatMapLatest(U.template),
      U.toProperty
    )
    ys.onValue(() => {})
    xs.set([1, 3, 2])
    xs.set([1, 3])
    xs.set([3, 1])
    xs.set([1, 3, 4])
    return ys
  })
})

describe('U.mapElemsWithIds', () => {
  testEq(
    [[{id: '1'}, '1', 2], [{id: '4'}, '4', 4], [{id: '3'}, '3', 3]],
    () => {
      let uniq = 0
      const xs = U.atom([{id: '2'}, {id: '1'}, {id: '3'}])
      const ys = U.thru(
        U.lazy(() => xs),
        U.mapElemsWithIds('id', (x, i) => [x, i, ++uniq]),
        U.flatMapLatest(U.template),
        U.toProperty
      )
      ys.onValue(() => {})
      xs.set([{id: '1'}, {id: '2'}, {id: '3'}])
      xs.set([{id: '1'}, {id: '2'}, {id: '3'}])
      xs.set([{id: '1'}, {id: '3'}])
      xs.set([{id: '1'}, {id: '4'}, {id: '3'}])
      return ys
    }
  )
})

describe('U.sink', () => {
  testEq(undefined, () => U.sink(C('lol')))
})

describe('U.consume', () => {
  testEq(undefined, () => U.consume(console.log, U.never))
  testEq([undefined, [-3, -2, -1]], () => {
    const values = []
    return U.thru(
      U.serially([1, 2, 3]),
      U.consume(x => values.unshift(-x)),
      U.flatMapLatest(x => [x, values])
    )
  })
})

describe('U.string', () => {
  testEq('Hello!', () => U.string`Hello!`)
  testEq('Hello, constant!', () => U.string`Hello, ${'constant'}!`)
  testEq('Hello, World!', () => U.string`Hello, ${C('World')}!`)
  testEq(
    'Hello, constant property!',
    () => U.string`Hello, ${'constant'} ${C('property')}!`
  )
})

describe('U.Context', () => {
  const Who = U.withContext((_, {who}) => <div>Hello, {who}!</div>)

  testRender('<div>Hello, World!</div>', () => (
    <U.Context context={{who: C('World')}}>
      <Who />
    </U.Context>
  ))
})

describe('bound inputs', () => {
  const checked = U.atom(true)
  const value = U.atom('lol')
  testRender(
    '<div><input type="checkbox" checked=""/><input type="text" value="lol"/><select></select><textarea>lol</textarea></div>',
    () => (
      <div>
        <U.Input type="checkbox" {...{checked}} />
        <U.Input type="text" {...{value}} />
        <U.Select {...{value}} />
        <U.TextArea {...{value}} />
      </div>
    )
  )
  const fakeMount = elem => elem.type.render(elem.props)
  testEq('101', () => {
    const value = {
      set(v) {
        this.value = v
      }
    }
    const elem = fakeMount(<U.Input {...{value}} />)
    elem.props.onChange({target: {value: '101'}})
    return value.value
  })
  testEq(false, () => {
    const checked = {
      set(v) {
        this.value = v
      }
    }
    const elem = fakeMount(<U.Input {...{checked}} />)
    elem.props.onChange({target: {checked: false}})
    return checked.value
  })
})

describe('U.bus', () => {
  testEq(101, () => {
    const b = U.bus()
    let result
    U.thru(b, U.flatMapParallel(R.negate), U.on({value: x => (result = x)}))
    b.push(-101)
    return result
  })
  testEq(69, () => {
    const b = U.bus()
    let result
    U.thru(b, U.flatMapErrors(R.negate), U.on({value: x => (result = x)}))
    b.error(-69)
    return result
  })
  testEq(42, () => {
    const b = U.bus()
    b.end()
    return U.parallel([b, C(42)])
  })
})

describe('U.ifElse', () => {
  testEq(1, () => U.ifElse(C(true), C(1), C(2)))
  testEq(2, () => U.ifElse(C(false), 1, 2))
})

describe('U.when', () => {
  testEq('x', () => U.when(C(true), C('x')))
  testEq(undefined, () => U.when(C(false), 'x'))
})

describe('U.unless', () => {
  testEq('x', () => U.unless(C(false), C('x')))
  testEq(undefined, () => U.unless(C(true), 'x'))
})

describe('U.cond', () => {
  testEq(undefined, () => U.cond())
  testEq(2, () => U.cond([C(false), 1], [2]))
  testEq(3, () => U.cond([C(false), 1], [C(false), 2], [3]))
  testEq(undefined, () => U.cond([C(false), 1], [C(false), 2], [C(false), 3]))
})

describe('U.toPartial', () => {
  testEq(undefined, () => U.toPartial(R.add)(C(1), undefined))
  testEq(undefined, () => U.toPartial(R.add)(C(undefined), 2))
  testEq(3, () => U.toPartial(R.add)(1, C(2)))
})

describe('U.scope', () => {
  testEq(101, () => U.scope(() => 101))
})

describe('U.refTo', () => {
  testEq(undefined, () => {
    const x = U.variable()
    U.refTo(x)(null)
    return x.get()
  })
  testEq('y', () => {
    const x = U.variable()
    U.refTo(x)('y')
    return x.get()
  })
})

describe('U.molecule', () => {
  testEq({x: 1, y: 2}, () => U.molecule({x: U.atom(1), y: U.atom(2)}))
})

describe('U.template', () => {
  testEq({x: 1, y: 2}, () => U.template({x: C(1), y: C(2)}))
})

describe('U.set', () => {
  testEq(undefined, () => U.set(U.atom(0), 1))
  testEq(undefined, () => U.set(U.atom(0), C(1)))
})

describe('U.show', () => {
  testEq('any', () => U.show('any'))
  testEq('string', () => typeof U.show('any'))
  testEq('whatever', () => U.show(C('whatever')))
  testEq(true, () => U.show(U.interval(0, 'whatever')) instanceof Stream)
  testEq('whatever', () => U.show(U.interval(0, 'whatever')))
  testEq(true, () => U.show(C('whatever')) instanceof Property)
  testEq('whatever', () => U.show(U.atom('whatever')))
  testEq(true, () => U.show(U.atom('whatever')) instanceof AbstractMutable)
  testEq(true, () => {
    const x = U.atom(false)
    U.show('false -> true', x).set(true)
    return x
  })
})

describe('U.tapPartial', () => {
  testEq([1, 2], () => {
    const x = U.atom(0)
    const events = []
    U.thru(
      x,
      U.changes,
      U.toProperty,
      U.tapPartial(v => events.push(v)),
      U.on({})
    )
    x.set(1)
    x.set(undefined)
    x.set(2)
    return events
  })

  testEq([[1, undefined, 2], [1, 2]], () => {
    const events = []
    const x = U.tapPartial(v => events.push(v), 1)
    const y = U.tapPartial(v => events.push(v), undefined)
    const z = U.tapPartial(v => events.push(v), 2)
    return [[x, y, z], events]
  })
})

describe('U.thru', () => {
  testEq(3, () => U.thru(1, R.add(2)))
  testEq(3, () => U.thru(C(1), R.add(C(2))))
  testEq(3, () => U.thru(C({x: 1}), L.get(C('x')), R.add(C(2))))

  testEq([[true, 0], [true, 1]], () =>
    U.thru(
      U.atom({xs: ['a', 'b']}),
      U.view(C('xs')),
      U.mapElems((x, i) => [x instanceof AbstractMutable, i])
    )
  )
})

describe('U.through', () => {
  testEq(3, () => U.through(R.add(2))(1))
  testEq(3, () => U.through(R.add(C(2)))(C(1)))
  testEq(3, () => U.through(L.get(C('x')), R.add(C(2)))(C({x: 1})))

  testEq([[true, 0], [true, 1]], () =>
    U.through(
      U.view(C('xs')),
      U.mapElems((x, i) => [x instanceof AbstractMutable, i])
    )(U.atom({xs: ['a', 'b']}))
  )
})

describe('U.onUnmount', () => {
  const x = U.atom('initial')
  testEq(undefined, () => U.onUnmount(() => x.set('unmounted')))
  testEq('unmounted', () => x)
})

describe('U.getProps', () => {
  testEq({value: 101, checked: false}, () => {
    const value = U.atom()
    const checked = U.atom()
    U.getProps({value, checked})({target: {value: 42, checked: false}})
    U.getProps({value})({target: {value: 101}})
    return U.debounce(10, U.template({value, checked}))
  })
})

describe('U.endWith', () => {
  testEq(101, () => {
    const bus = U.bus()
    const x = U.delay(10, U.toProperty(U.endWith(101, bus)))
    U.on({}, x)
    bus.end()
    return x
  })
})

describe('U.sampledBy', () => {
  testEq([1, 3], () => {
    const src = U.atom(0)
    const tap = U.bus()
    const seq = []
    U.thru(U.sampledBy(tap, src), U.on({value: x => seq.push(x)}))
    src.set(1)
    tap.push()
    src.set(2)
    src.set(3)
    tap.push()
    src.set(4)
    return seq
  })
})

describe('U.setProps', () => {
  testEq({value: 42}, () => {
    const value = U.throttle(100, U.atom(42))
    const target = {value: 101}
    const ref = U.setProps({value})
    ref(target)
    ref(null)
    return target
  })
  testEq({value: 42}, () => {
    const stop = U.variable()
    const value = U.takeUntilBy(stop, U.ignoreErrors(U.atom(42)))
    const target = {value: 101}
    const ref = U.setProps({value})
    ref(target)
    stop.set('now')
    return target
  })
  testEq(42, () => {
    const value = U.bus()
    const target = {value: 101}
    const ref = U.setProps({
      value: U.toProperty(U.takeFirstErrors(1, U.ignoreValues(value)))
    })
    ref(target)
    try {
      value.push(101)
      value.error(42)
      return 'did not'
    } catch (e) {
      return e
    }
  })
})

describe('actions helpers', () => {
  testEq(101, () => {
    let result = 0
    U.stopPropagation({stopPropagation: () => (result = 101)})
    return result
  })
  testEq(101, () => {
    let result = 0
    U.preventDefault({preventDefault: () => (result = 101)})
    return result
  })
})

describe('actions', () => {
  testEq(42, () => {
    const x = U.atom(0)
    U.doSet(x, 42)()
    return x
  })
})

describe('Kefir', () => {
  testEq(4, () => U.mapValue(v => v * 2, C(2)))
})

const laterPromise = (ms, value) =>
  new Promise(fulfill => setTimeout(() => fulfill(value), ms))

describe('U.fromPromise', () => {
  testEq(1, () => U.fromPromise(() => laterPromise(25, 1)))

  testEq(3, () =>
    U.parallel([
      U.fromPromise(() => laterPromise(50, 2)),
      U.fromPromise(() => laterPromise(25, 3))
    ])
  )

  testEq(4, () => {
    const slow = U.fromPromise(() => laterPromise(50, 4))
    const fast = U.fromPromise(() => laterPromise(25, 5))
    return U.serially([
      U.thru(
        U.takeFirst(1, U.parallel([slow, fast])),
        U.flatMapLatest(() => U.later(0, 0)),
        U.flatMapLatest(() => slow)
      ),
      6
    ])
  })

  testEq(9, () => {
    const slow = U.fromPromise(() => ({
      ready: laterPromise(50, 7),
      abort: () => {}
    }))
    const fast = U.fromPromise(() => ({
      ready: laterPromise(25, 8),
      abort: () => {}
    }))
    return U.serially([
      U.thru(
        U.takeFirst(1, U.parallel([slow, fast])),
        U.flatMapLatest(() => U.later(0, 0)),
        U.flatMapLatest(() => slow)
      ),
      9
    ])
  })

  testEq(101, () =>
    U.thru(
      U.fromPromise(() =>
        laterPromise(25).then(() => {
          throw 42
        })
      ),
      U.flatMapErrors(error => error + 59)
    )
  )
})

describe('U.animationSpan', () => {
  testEq([0, 0.25, 0.5, 0.75, 1, 'done'], () => {
    global.window = 1
    global.cancelAnimationFrame = () => {}
    let i = 0
    global.requestAnimationFrame = step => {
      setTimeout(() => step(500 * ++i), 0)
    }
    const values = []
    return U.thru(
      U.serially([U.animationSpan(2000), 'done']),
      U.toProperty,
      R.tap(x => values.push(x)),
      U.skipUnless(R.equals('done')),
      U.mapValue(_ => values)
    )
  })
})

describe('toReact', () => {
  const Foo = U.toReactExcept(R.identical('foo'), function Foo({foo, bar = 2}) {
    return (
      <div>
        {foo}
        {bar}
      </div>
    )
  })
  testRender('<div>101</div>', () => <Foo foo={10} bar={1} />)
  it('smoke test', () => {
    const foo = new Foo({foo: 10, bar: 1})
    foo.props = {foo: 20, bar: 2}
    foo.componentDidUpdate()
    foo.props = {foo: 20, bar: 3}
    foo.componentDidUpdate()
    foo.props = {foo: 15}
    foo.componentDidUpdate()
    foo.componentWillUnmount()
  })
})

describe('obsoleted', () => {
  testEq(2, () => U.seq(1, R.inc))
  testEq(2, () => U.seqPartial(1, R.inc))
  testEq(3, () => U.combines(1, 2, R.add))
})
