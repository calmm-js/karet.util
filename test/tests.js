import * as Kefir from "kefir"
import * as R     from "ramda"
import React      from "karet"
import ReactDOM   from "react-dom/server"

import K, * as U from "../dist/karet.util.cjs"

function show(x) {
  switch (typeof x) {
    case "string":
    case "object":
      return JSON.stringify(x)
    default:
      return `${x}`
  }
}

const testEq = (exprIn, expect) => {
  const expr = exprIn.replace(/[ \n]+/g, " ")
  return it(`${expr} => ${show(expect)}`, done => {
    const actual =
      eval(`(K, Kefir, R, U, C) => ${expr}`)(K, Kefir, R, U, Kefir.constant)
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
}

const testRender = (vdom, expect) => it(`${expect}`, () => {
  const actual = ReactDOM.renderToStaticMarkup(vdom)

  if (actual !== expect)
    throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
})

describe("actions", () => {
  testEq(`{let i = "";
           U.actions(false,
                     C(x => i += "1" + x),
                     undefined,
                     x => i += "2" + x)
            .onValue(f => f("z"));
           return i}`,
         "1z2z")
})

describe("bind", () => {
  testEq(`{const a = U.atom(1);
           const e = {a: 2};
           const x = U.bind({a});
           x.onChange({target: e});
           return a}`,
         2)
})

describe("view", () => {
  testEq(`U.view("x", Kefir.constant({x: 101}))`, 101)
  testEq(`U.view(Kefir.constant("x"), Kefir.constant({x: 101}))`, 101)
  testEq(`U.view("x", {x: 101})`, 101)
  testEq(`U.view("x", U.atom({x: 101}))`, 101)
  testEq(`U.view(Kefir.constant("x"), U.atom({x: 101}))`, 101)
})

describe("bindProps", () => {
  testEq(`{const a = U.atom(1);
           const e = {a: 2};
           const x = U.bindProps({ref: "onChange", a});
           x.ref(e);
           a.set(3);
           return e.a}`,
         3)

  testEq(`{const a = U.atom(1);
           const e = {a: 2};
           const x = U.bindProps({ref: "onChange", a});
           x.ref(e);
           e.a = 3;
           x.onChange({target: e});
           return a}`,
         3)
})

describe("classes", () => {
  testEq('U.classes()', {className: ""})

  testEq('U.classes("a")', {className: "a"})

  testEq('U.classes("a", undefined, 0, false, "", "b")',
         {className: "a b"})

  testEq('K(U.classes("a", C("b")), R.identity)',
         {className: "a b"})
})

describe("cns", () => {
  testEq(`U.cns()`, "")
  testEq(`U.cns(null, "a", false, undefined, C("b"), 0, "")`, "a b")
})

describe("mapCached", () => {
  testEq(`U.seq(Kefir.concat([C([2, 1, 1]), C([1, 3, 2])]),
                U.toProperty,
                U.mapCached(i => "item " + i))`,
         ["item 1", "item 3", "item 2"])
})

describe("mapElems", () => {
  testEq(`{let uniq = 0;
           const xs = U.atom([2, 1, 1]);
           const ys =
             U.seq(xs,
                   U.mapElems((x, i) => [x, i, ++uniq]),
                   U.flatMapLatest(U.template),
                   U.toProperty);
          ys.onValue(() => {});
          xs.set([1, 3, 2]);
          return ys}`,
         [[1, 0, 1], [3, 1, 2], [2, 2, 3]])
})

describe("mapElemsWithIds", () => {
  testEq(`{let uniq = 0;
           const xs = U.atom([{id: "2"}, {id: "1"}, {id: "3"}]);
           const ys =
             U.seq(xs,
                   U.mapElemsWithIds(s => s.id, (x, i) => [x, i, ++uniq]),
                   U.flatMapLatest(U.template),
                   U.toProperty);
           ys.onValue(() => {});
           xs.set([{id: "1"}, {id: "2"}, {id: "3"}]);
           return ys}`,
         [[{id: "1"}, "1", 2],
          [{id: "2"}, "2", 1],
          [{id: "3"}, "3", 3]])
})

describe("sink", () => {
  testEq('U.sink(C("lol"))', undefined)
})

describe("string", () => {
  testEq('U.string`Hello!`', "Hello!")
  testEq('U.string`Hello, ${"constant"}!`', "Hello, constant!")
  testEq('U.string`Hello, ${C("World")}!`', "Hello, World!")
  testEq('U.string`Hello, ${"constant"} ${C("property")}!`',
         "Hello, constant property!")
})

describe("Context", () => {
  const Who = U.withContext((_, {who}) => <div>Hello, {who}!</div>)

  testRender(<U.Context context={{who: Kefir.constant("World")}}>
               <Who/>
             </U.Context>,
             '<div>Hello, World!</div>')
})

describe("ifte", () => {
  testEq('U.ifte(C(true), C(1), C(2))', 1)
  testEq('U.ifte(C(false), 1, 2)', 2)
})

describe("ift", () => {
  testEq('U.ift(C(true), C("x"))', "x")
  testEq('U.ift(C(false), "x")', undefined)
})

describe("toPartial", () => {
  testEq(`U.toPartial(R.add)(C(1), undefined)`, undefined)
  testEq(`U.toPartial(R.add)(C(undefined), 2)`, undefined)
  testEq(`U.toPartial(R.add)(1, C(2))`, 3)
})

describe("mapIndexed", () => {
  testEq(`U.mapIndexed((x, i) => [x,i], C([3,1,4]))`, [[3,0], [1,1], [4,2]])
})

describe("scope", () => {
  testEq(`U.scope(() => 101)`, 101)
})

describe("refTo", () => {
  testEq(`{const x = U.variable(); U.refTo(x)(null); return x.get()}`,
         undefined)
  testEq(`{const x = U.variable(); U.refTo(x)("y"); return x.get()}`, "y")
})

describe("molecule", () => {
  testEq(`U.molecule({x: U.atom(1), y: U.atom(2)})`, {x: 1, y: 2})
})

describe("template", () => {
  testEq(`U.template({x: C(1), y: C(2)})`, {x: 1, y: 2})
})

describe("set", () => {
  testEq(`U.set(U.atom(0), 1)`, undefined)
  testEq(`U.set(U.atom(0), C(1))`, undefined)
})

describe("show", () => {
  testEq(`U.show("any")`, "any")
})

describe("staged", () => {
  testEq(`U.staged(x => y => x + y)(1)(2)`, 3)
  testEq(`U.staged(x => y => x + y)(1, 2)`, 3)
})

describe("Ramda", () => {
  testEq(`U.add(C(1), C(2))`, 3)
  testEq(`U.addIndex(R.map)((x, i) => [x, i], C([3, 1, 4]))`,
         [[3,0], [1,1], [4,2]])
  testEq(`U.adjust(R.inc, C(1), C([1,2,3]))`, [1,3,3])
  testEq(`U.all(R.equals(1), C([1,2,3]))`, false)
  testEq(`U.allPass([x => x > 1, x => x < 3])(C(2))`, true)
  testEq(`U.filter(U.allPass([C(x => x > 1), C(x => x < 3)]), C([1,2,3]))`, [2])
  testEq(`U.and(C("a"), C("b"))`, "b")
  testEq(`U.any(R.equals(1), C([1,2,3]))`, true)
  testEq(`U.anyPass([x => x > 1, x => x < 3])(C(1))`, true)
  testEq(`U.filter(U.anyPass([C(x => x > 1), C(x => x < 3)]), C([1,2,3]))`,
         [1,2,3])
  testEq(`U.ap([U.multiply(2), C(U.add(3))], C([1,2,3]))`, [2, 4, 6, 4, 5, 6])
  testEq('U.ifElse(U.equals("x"), () => "was x!", x => "was " + x)(C("y"))',
         "was y")
  testEq('U.pipe(U.add(1), U.add(2))(C(3))', 6)
  testEq(`U.always(C(42))(0)`, 42)
  testEq(`U.cond([[R.equals(1), R.always("one")],
                  [R.equals(2), R.always("two")]])(2)`,
         "two")
  testEq(`U.cond([[R.equals(1), R.always("one")],
                  [R.equals(2), R.always("two")]])(C(2))`,
         "two")
  testEq(`U.identity(C(42))`, 42)
  testEq(`U.filter(U.where({id: U.has(U.__, C({x: 1, y: 1}))}),
                   [{id: "y"}, {id: "z"}, {id: "x"}])`,
         [{id: "y"}, {id: "x"}])
})
