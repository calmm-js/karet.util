import * as Kefir from "kefir"
import * as R     from "ramda"
import Atom       from "kefir.atom"

import K, {bind, bindProps, classes, sink, string} from "../src/karet.util"

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
    eval(`(Atom, K, Kefir, R, bind, bindProps, classes, sink, string) => ${expr}`)(
           Atom, K, Kefir, R, bind, bindProps, classes, sink, string)
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

describe("sink", () => {
  testEq('sink(Kefir.constant("lol"))', null)
})

describe("string", () => {
  testEq('string`Hello!`', "Hello!")
  testEq('string`Hello, ${"constant"}!`', "Hello, constant!")
  testEq('string`Hello, ${Kefir.constant("World")}!`', "Hello, World!")
  testEq('string`Hello, ${"constant"} ${Kefir.constant("property")}!`', "Hello, constant property!")
})
