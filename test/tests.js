import * as Kefir from "kefir"
import * as R     from "ramda"
import Atom       from "kefir.atom"
import React      from "karet"
import ReactDOM   from "react-dom/server"

import K, {
  Context,
  actions,
  bind,
  bindProps,
  classes,
  fromIds,
  idx,
  sink,
  string,
  withContext
} from "../src/karet.util"

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
    eval(`(Atom, K, Kefir, R, actions, bind, bindProps, classes, fromIds, idx, sink, string) => ${expr}`)(
           Atom, K, Kefir, R, actions, bind, bindProps, classes, fromIds, idx, sink, string)
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
  testEq('{let i = "" ; actions(false, Kefir.constant(x => i += "1" + x), undefined, x => i += "2" + x).onValue(f => f("z")); return i}', "1z2z")
})

describe("bind", () => {
  testEq('{const a = Atom(1);' +
         ' const e = {a: 2};' +
         ' const x = bind({a});' +
         ' x.onChange({target: e});' +
         ' return a}',
         2)
})

describe("bindProps", () => {
  testEq('{const a = Atom(1);' +
         ' const e = {a: 2};' +
         ' const x = bindProps({ref: "onChange", a});' +
         ' x.ref(e);' +
         ' a.set(3);' +
         ' return e.a}',
         3)

  testEq('{const a = Atom(1);' +
         ' const e = {a: 2};' +
         ' const x = bindProps({ref: "onChange", a});' +
         ' x.ref(e);' +
         ' e.a = 3;' +
         ' x.onChange({target: e});' +
         ' return a}',
         3)
})

describe("classes", () => {
  testEq('classes()', {className: ""})

  testEq('classes("a")', {className: "a"})

  testEq('classes("a", undefined, 0, false, "", "b")',
         {className: "a b"})

  testEq('K(classes("a", Kefir.constant("b")), R.identity)',
         {className: "a b"})
})

describe("fromIds", () => {
  testEq('fromIds(Kefir.concat([Kefir.constant([2, 1, 1]), Kefir.constant([1, 3, 2])]), i => `item ${i}`)', ["item 1", "item 3", "item 2"])

  testEq('fromIds(["a", "c", "b"].map(idx), R.toString)', ["a:0", "c:1", "b:2"])
})

describe("sink", () => {
  testEq('sink(Kefir.constant("lol"))', null)
})

describe("string", () => {
  testEq('string`Hello!`', "Hello!")
  testEq('string`Hello, ${"constant"}!`', "Hello, constant!")
  testEq('string`Hello, ${Kefir.constant("World")}!`', "Hello, World!")
  testEq('string`Hello, ${"constant"} ${Kefir.constant("property")}!`', "Hello, constant property!")
})

describe("Context", () => {
  const Who = withContext((_, {who}) => <div>Hello, {who}!</div>)

  testRender(<Context context={{who: Kefir.constant("World")}}><Who/></Context>,
             '<div>Hello, World!</div>')
})
