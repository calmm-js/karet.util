import * as Kefir from "kefir"
import * as R     from "ramda"
import Atom       from "kefir.atom"
import React      from "karet"
import ReactDOM   from "react-dom/server"

import K, * as U from "../src/karet.util"

function show(x) {
  switch (typeof x) {
    case "string":
    case "object":
      return JSON.stringify(x)
    default:
      return `${x}`
  }
}

const testEq = (expr, expect) => it(`${expr} => ${show(expect)}`, done => {
  const actual =
    eval(`(Atom, K, Kefir, R, U) => ${expr}`)(Atom, K, Kefir, R, U)
  const check = actual => {
    if (!R.equals(actual, expect))
      throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
    done()
  }
  if (actual instanceof Kefir.Observable)
    actual.take(1).onValue(check)
  else
    check(actual)
})

const testRender = (vdom, expect) => it(`${expect}`, () => {
  const actual = ReactDOM.renderToStaticMarkup(vdom)

  if (actual !== expect)
    throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
})

describe("actions", () => {
  testEq('{let i = "" ; U.actions(false, Kefir.constant(x => i += "1" + x), undefined, x => i += "2" + x).onValue(f => f("z")); return i}', "1z2z")
})

describe("bind", () => {
  testEq('{const a = Atom(1);' +
         ' const e = {a: 2};' +
         ' const x = U.bind({a});' +
         ' x.onChange({target: e});' +
         ' return a}',
         2)
})

describe("bindProps", () => {
  testEq('{const a = Atom(1);' +
         ' const e = {a: 2};' +
         ' const x = U.bindProps({ref: "onChange", a});' +
         ' x.ref(e);' +
         ' a.set(3);' +
         ' return e.a}',
         3)

  testEq('{const a = Atom(1);' +
         ' const e = {a: 2};' +
         ' const x = U.bindProps({ref: "onChange", a});' +
         ' x.ref(e);' +
         ' e.a = 3;' +
         ' x.onChange({target: e});' +
         ' return a}',
         3)
})

describe("classes", () => {
  testEq('U.classes()', {className: ""})

  testEq('U.classes("a")', {className: "a"})

  testEq('U.classes("a", undefined, 0, false, "", "b")',
         {className: "a b"})

  testEq('K(U.classes("a", Kefir.constant("b")), R.identity)',
         {className: "a b"})
})

describe("mapCached", () => {
  testEq('U.seq(Kefir.concat([Kefir.constant([2, 1, 1]), Kefir.constant([1, 3, 2])]), U.mapCached(i => `item ${i}`))', ["item 1", "item 3", "item 2"])
})

describe("sink", () => {
  testEq('U.sink(Kefir.constant("lol"))', undefined)
})

describe("string", () => {
  testEq('U.string`Hello!`', "Hello!")
  testEq('U.string`Hello, ${"constant"}!`', "Hello, constant!")
  testEq('U.string`Hello, ${Kefir.constant("World")}!`', "Hello, World!")
  testEq('U.string`Hello, ${"constant"} ${Kefir.constant("property")}!`', "Hello, constant property!")
})

describe("Context", () => {
  const Who = U.withContext((_, {who}) => <div>Hello, {who}!</div>)

  testRender(<U.Context context={{who: Kefir.constant("World")}}><Who/></U.Context>,
             '<div>Hello, World!</div>')
})

describe("pipe", () => {
  testEq('U.pipe(U.add(1), U.add(2))(Kefir.constant(3))', 6)
})

describe("ifElse", () => {
  testEq('U.ifElse(U.equals("x"), () => "was x!", x => "was " + x)(Kefir.constant("y"))', "was y")
})

describe("cond", () => {
  testEq(`U.cond([[R.equals(1), R.always("one")],
                  [R.equals(2), R.always("two")]])(2)`, "two")
  testEq(`U.cond([[R.equals(1), R.always("one")],
                  [R.equals(2), R.always("two")]])(Kefir.constant(2))`, "two")
})

describe("always", () => {
  testEq(`U.always(Kefir.constant(42))(0)`, 42)
})

describe("identity", () => {
  testEq(`U.identity(Kefir.constant(42))`, 42)
})
