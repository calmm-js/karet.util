import { F, T, __, add, addIndex, adjust, all, allPass, always, and, any, anyPass, ap, aperture, append, apply, applySpec, ascend, assoc, assocPath, binary, both, call, chain, clamp, comparator, complement, compose, concat, cond, construct, constructN, contains, converge, countBy, curry, curryN, dec, defaultTo, descend, difference, differenceWith, dissoc, dissocPath, divide, drop, dropLast, dropLastWhile, dropRepeats, dropRepeatsWith, dropWhile, either, empty, endsWith, eqBy, eqProps, equals, evolve, filter, find, findIndex, findLast, findLastIndex, flatten, flip, fromPairs, groupBy, groupWith, gt, gte, has, hasIn, head, identical, identity, ifElse, inc, indexBy, indexOf, init, innerJoin, insert, insertAll, intersection, intersperse, into, invert, invertObj, invoker, is, isEmpty, isNil, join, juxt, keys, keysIn, last, lastIndexOf, length, lt, lte, map, mapAccum, mapAccumRight, mapObjIndexed, match, mathMod, max, maxBy, mean, median, memoize, memoizeWith, merge, mergeAll, mergeDeepLeft, mergeDeepRight, mergeDeepWith, mergeDeepWithKey, mergeWith, mergeWithKey, min, minBy, modulo, multiply, nAry, negate, none, not, nth, nthArg, o, objOf, of, omit, or, pair, partial, partialRight, partition, path, pathEq, pathOr, pathSatisfies, pick, pickAll, pickBy, pipe, pluck, prepend, product, project, prop, propEq, propIs, propOr, propSatisfies, props, range, reduce, reduceBy, reduceRight, reduceWhile, reduced, reject, remove, repeat, replace, reverse, scan, sequence, slice, sort, sortBy, sortWith, split, splitAt, splitEvery, splitWhen, startsWith, subtract, sum, symmetricDifference, symmetricDifferenceWith, tail, take, takeLast, takeLastWhile, takeWhile, tap, test, times, toLower, toPairs, toPairsIn, toString, toUpper, transduce, transpose, traverse, trim, tryCatch, type, unapply, unary, uncurryN, unfold, union, unionWith, uniq, uniqBy, uniqWith, unless, unnest, until, update, useWith, values, valuesIn, when, where, whereEq, without, xprod, zip, zipObj, zipWith } from 'ramda';
import { AbstractMutable, Atom, Join, Molecule, holding } from 'kefir.atom';
import { Observable, Stream, concat as concat$1, constant, fromEvents, interval, later, merge as merge$1, never } from 'kefir';
import { arityN, assocPartialU, curry as curry$1, curryN as curryN$1, dissocPartialU, id, identicalU, inherit, isDefined, pipe2U, seq, seqPartial } from 'infestines';
import { find as find$1, flatten as flatten$1, get, join as join$1, when as when$1 } from 'partial.lenses';
import K, { lift, lift1, lift1Shallow } from 'kefir.combines';
import { fromKefir } from 'karet';
import { Component } from 'react';
import PropTypes from 'prop-types';

var liftStaged = function liftStaged(fn) {
  return lift(pipe2U(fn, lift));
};
var template = function template(observables) {
  return K(observables, id);
};

// Kefir

var toUndefined = function toUndefined(_) {};
var toConstant = function toConstant(x) {
  return x instanceof Observable ? x : constant(x);
};

var invokeIf = function invokeIf(fn, x) {
  return fn && fn(x);
};
var toHandler = function toHandler(fns) {
  return function (_ref) {
    var type$$1 = _ref.type,
        value = _ref.value;
    return invokeIf(fns[type$$1], value);
  };
};

var debounce = /*#__PURE__*/curry$1(function (ms, xs) {
  return toConstant(xs).debounce(ms);
});
var changes = function changes(xs) {
  return toConstant(xs).changes();
};
var serially = function serially(xs) {
  return concat$1(map(toConstant, xs));
};
var parallel = /*#__PURE__*/merge$1;
var delay = /*#__PURE__*/curry$1(function (ms, xs) {
  return toConstant(xs).delay(ms);
});
var endWith = /*#__PURE__*/curry$1(function (v, xs) {
  return toConstant(xs).concat(toConstant(v));
});
var mapValue = /*#__PURE__*/curry$1(function (fn, xs) {
  return toConstant(xs).map(fn);
});
var flatMapParallel = /*#__PURE__*/curry$1(function (fn, xs) {
  return toConstant(xs).flatMap(pipe2U(fn, toConstant));
});
var flatMapSerial = /*#__PURE__*/curry$1(function (fn, xs) {
  return toConstant(xs).flatMapConcat(pipe2U(fn, toConstant));
});
var flatMapErrors = /*#__PURE__*/curry$1(function (fn, xs) {
  return toConstant(xs).flatMapErrors(pipe2U(fn, toConstant));
});
var flatMapLatest = /*#__PURE__*/curry$1(function (fn, xs) {
  return toConstant(xs).flatMapLatest(pipe2U(fn, toConstant));
});
var foldPast = /*#__PURE__*/curry$1(function (fn, s, xs) {
  return toConstant(xs).scan(fn, s);
});
var interval$1 = /*#__PURE__*/curry$1(interval);
var later$1 = /*#__PURE__*/curry$1(later);
var lazy = function lazy(th) {
  return seq(toProperty(), flatMapLatest(th), toProperty);
};
var never$1 = /*#__PURE__*/never();
var on = /*#__PURE__*/curry$1(function (efs, xs) {
  return toConstant(xs).onAny(toHandler(efs));
});
var sampledBy = /*#__PURE__*/curry$1(function (es, xs) {
  return toConstant(xs).sampledBy(es);
});
var skipFirst = /*#__PURE__*/curry$1(function (n, xs) {
  return toConstant(xs).skip(n);
});
var skipDuplicates = /*#__PURE__*/curry$1(function (equals$$1, xs) {
  return toConstant(xs).skipDuplicates(equals$$1);
});
var skipUnless = /*#__PURE__*/curry$1(function (p, xs) {
  return toConstant(xs).filter(p);
});
var skipWhen = /*#__PURE__*/curry$1(function (p, xs) {
  return toConstant(xs).filter(function (x) {
    return !p(x);
  });
});
var startWith = /*#__PURE__*/curry$1(function (x, xs) {
  return toConstant(xs).toProperty(function () {
    return x;
  });
});
var sink = /*#__PURE__*/pipe2U(startWith(undefined), lift(toUndefined));
var takeFirst = /*#__PURE__*/curry$1(function (n, xs) {
  return toConstant(xs).take(n);
});
var takeUntilBy = /*#__PURE__*/curry$1(function (ts, xs) {
  return toConstant(xs).takeUntilBy(ts);
});
var toProperty = function toProperty(xs) {
  return toConstant(xs).toProperty();
};
var throttle = /*#__PURE__*/curry$1(function (ms, xs) {
  return toConstant(xs).throttle(ms);
});
var fromEvents$1 = /*#__PURE__*/curry$1(fromEvents);

var set = /*#__PURE__*/curry$1(function (settable, xs) {
  var ss = K(xs, function (xs) {
    return settable.set(xs);
  });
  if (ss instanceof Observable) return ss.toProperty(toUndefined);
});

//

var Bus = /*#__PURE__*/inherit(function Bus() {
  Stream.call(this);
}, Stream, {
  push: function push(value) {
    this._emitValue(value);
  },
  error: function error(value) {
    this._emitError(value);
  },
  end: function end() {
    this._emitEnd();
  }
});

var bus = function bus() {
  return new Bus();
};

//

var refTo = function refTo(settable) {
  return function (elem) {
    if (null !== elem) settable.set(elem);
  };
};

var scope = function scope(fn) {
  return fn();
};

var toPartial = function toPartial(fn) {
  return lift(arityN(fn.length, function () {
    for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
      xs[_key] = arguments[_key];
    }

    return all(isDefined, xs) ? fn.apply(undefined, xs) : undefined;
  }));
};

var show = function show(x) {
  return console.log(x) || x;
};

var staged = function staged(fn) {
  return curryN(fn.length, function () {
    var xsN = arguments.length,
        fnN = fn.length,
        n = Math.min(xsN, fnN),
        xs = Array(n);
    for (var i = 0; i < n; ++i) {
      xs[i] = arguments[i];
    }var fnxs = fn.apply(null, xs);
    if (fnN === xsN) return fnxs;

    var m = xsN - n,
        ys = Array(m);
    for (var _i = 0; _i < m; ++_i) {
      ys[_i] = arguments[_i + n];
    }return fnxs.apply(null, ys);
  });
};

//

function setProps(observables) {
  var observable = void 0;
  var _callback = void 0;
  return function (e) {
    if (_callback) {
      observable.offAny(_callback);
      observable = _callback = null;
    }
    if (e) {
      _callback = function callback(ev) {
        switch (ev.type) {
          case "value":
            {
              var _observables = ev.value;
              for (var k in _observables) {
                e[k] = _observables[k];
              }break;
            }
          case "error":
            throw ev.value;
          case "end":
            observable = _callback = null;
            break;
        }
      };
      observable = template(observables);
      observable.onAny(_callback);
    }
  };
}

var getProps = function getProps(template) {
  return function (_ref2) {
    var target = _ref2.target;

    for (var k in template) {
      template[k].set(target[k]);
    }
  };
};

var bindProps = function bindProps(templateWithRef) {
  var ref = templateWithRef.ref;
  var template = dissocPartialU("ref", templateWithRef);
  var r = { ref: setProps(template) };
  r[ref] = getProps(template);
  return r;
};

var bind = function bind(template) {
  return assocPartialU("onChange", getProps(template), template);
};

//

var flatJoin = /*#__PURE__*/lift1(join$1(" ", [flatten$1, when$1(id)]));

var cns = function cns() {
  for (var _len2 = arguments.length, xs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    xs[_key2] = arguments[_key2];
  }

  return flatJoin(xs);
};

var classes = function classes() {
  return { className: cns.apply(undefined, arguments) };
};

//

var mapCachedInit = [new Map(), []];

var mapCachedStep = function mapCachedStep(fromId) {
  return function (old, ids) {
    var oldIds = old[0],
        oldVs = old[1];
    var newIds = new Map();
    var n = ids.length;
    var changed = n !== oldVs.length;
    var newVs = Array(n);
    for (var i = 0; i < n; ++i) {
      var _id = ids[i];
      var v = void 0;
      if (newIds.has(_id)) v = newIds.get(_id);else newIds.set(_id, v = oldIds.has(_id) ? oldIds.get(_id) : fromId(_id));
      newVs[i] = v;
      if (!changed) changed = v !== oldVs[i];
    }
    return changed ? [newIds, newVs] : old;
  };
};

var mapCachedMap = /*#__PURE__*/lift1Shallow(function (x) {
  return x[1];
});

var mapCached = /*#__PURE__*/curryN$1(2, function (fromId) {
  return pipe2U(foldPast(mapCachedStep(fromId), mapCachedInit), mapCachedMap);
});

//

var mapIndexed = /*#__PURE__*/curryN$1(2, function (xi2y) {
  return lift1(function (xs) {
    return xs.map(function (x, i) {
      return xi2y(x, i);
    });
  });
});

var ifteU = function ifteU(b, t, e) {
  return toProperty(flatMapLatest(function (b) {
    return b ? t : e;
  }, b));
};

var ifte = /*#__PURE__*/curry$1(ifteU);
var ift = /*#__PURE__*/arityN(2, ifteU);

function iftes(_c, _t) {
  var n = arguments.length;
  var r = n & 1 ? arguments[--n] : undefined;
  while (0 <= (n -= 2)) {
    r = ifteU(arguments[n], arguments[n + 1], r);
  }return r;
}

//

var view = /*#__PURE__*/curry$1(function (l, xs) {
  return xs instanceof AbstractMutable ? l instanceof Observable ? new Join(K(l, function (l) {
    return xs.view(l);
  })) : xs.view(l) : K(l, xs, get);
});

//

var types = { context: PropTypes.any };

var Context = /*#__PURE__*/inherit(function Context(props$$1) {
  Component.call(this, props$$1);
}, Component, {
  getChildContext: function getChildContext() {
    return { context: this.props.context };
  },
  render: function render() {
    return this.props.children;
  }
}, {
  childContextTypes: types
});

function withContext(originalFn) {
  var fn = function fn(props$$1, _ref3) {
    var context = _ref3.context;
    return originalFn(props$$1, context);
  };
  fn.contextTypes = types;
  return fn;
}

var WithContext = /*#__PURE__*/withContext(function (_ref4, context) {
  var Do = _ref4.Do;
  return React.createElement(Do, context);
});

//

var actionsImmediate = function actionsImmediate() {
  for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    fns[_key3] = arguments[_key3];
  }

  return function () {
    for (var i = 0, n = fns.length; i < n; ++i) {
      if (fns[i] instanceof Function) fns[i].apply(fns, arguments);
    }
  };
};

var actions = function actions() {
  for (var _len4 = arguments.length, fns = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    fns[_key4] = arguments[_key4];
  }

  return K.apply(undefined, fns.concat([actionsImmediate]));
};

//

var string = function string(strings) {
  for (var _len5 = arguments.length, values$$1 = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    values$$1[_key5 - 1] = arguments[_key5];
  }

  return K.apply(undefined, values$$1.concat([function () {
    for (var _len6 = arguments.length, values$$1 = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      values$$1[_key6] = arguments[_key6];
    }

    return String.raw.apply(String, [strings].concat(values$$1));
  }]));
};

//

var atom = function atom(value) {
  return new Atom(value);
};
var variable = function variable() {
  return new Atom();
};
var molecule = function molecule(template) {
  return new Molecule(template);
};

// Ramda

var maybe = function maybe(f) {
  return function (x) {
    return x && f(x);
  };
};

var stageLast1Of2Maybe = /*#__PURE__*/maybe(function (fn) {
  return function (x1) {
    return function (x2) {
      return fn(x1, x2);
    };
  };
});
var stageLast2Of3Maybe = /*#__PURE__*/maybe(function (fn) {
  return function (x1) {
    return function (x2, x3) {
      return fn(x1, x2, x3);
    };
  };
});

var liftMaybe = /*#__PURE__*/maybe(lift);
var liftStagedMaybe = /*#__PURE__*/maybe(liftStaged);
var lift1Maybe = /*#__PURE__*/maybe(lift1);
var lift1ShallowMaybe = /*#__PURE__*/maybe( /*#__PURE__*/lift1Shallow);

//export const bind = /*#__PURE__*/liftMaybe(R.bind)                             -> conflict, useful?
//export const clone = /*#__PURE__*/liftMaybe(R.clone)                           -> useful?
//export const composeK = /*#__PURE__*/liftMaybe(R.composeK)                     -> lift staged, useful?
//export const composeP = /*#__PURE__*/liftMaybe(R.composeP)                     -> lift staged, useful?
//export const forEach = /*#__PURE__*/liftMaybe(R.forEach)                       -> useful?
//export const forEachObjIndexed = = /*#__PURE__*/liftMaybe(R.forEachObjIndexed) -> useful?
//export const intersectionWith = /*#__PURE__*/liftMaybe(R.intersectionWith)     -> deprecated
//export const lens = /*#__PURE__*/liftMaybe(R.lens)                             -> partial.lenses
//export const lensIndex = /*#__PURE__*/liftMaybe(R.lensIndex)                   -> partial.lenses
//export const lensPath = /*#__PURE__*/liftMaybe(R.lensPath)                     -> partial.lenses
//export const lensProp = /*#__PURE__*/liftMaybe(R.lensProp)                     -> partial.lenses
//export const lift = /*#__PURE__*/liftMaybe(R.lift)                             -> conflict
//export const liftN = /*#__PURE__*/liftMaybe(R.liftN)                           -> conflict
//export const once = /*#__PURE__*/liftMaybe(R.once)                             -> lift staged, usually wrong thing to do?
//export const over = /*#__PURE__*/liftMaybe(R.over)                             -> partial.lenses
//export const pipeK = /*#__PURE__*/liftMaybe(R.pipeK)                           -> lift staged, useful?
//export const pipeP = /*#__PURE__*/liftMaybe(R.pipeP)                           -> lift staged, useful?
//export const set = /*#__PURE__*/liftMaybe(R.set)                               -> partial.lenses, conflict
//export const view = /*#__PURE__*/liftMaybe(R.view)                             -> partial.lenses, conflict

var F$1 = /*#__PURE__*/F;
var T$1 = /*#__PURE__*/T;
var __$1 = /*#__PURE__*/__;
var add$1 = /*#__PURE__*/liftMaybe(add);
var addIndex$1 = /*#__PURE__*/liftStagedMaybe(addIndex);
var adjust$1 = /*#__PURE__*/liftMaybe(adjust);
var all$1 = /*#__PURE__*/liftMaybe(all);
var allPass$1 = /*#__PURE__*/liftStagedMaybe(allPass);
var always$1 = /*#__PURE__*/always; // lifting won't really work
var and$1 = /*#__PURE__*/liftMaybe(and);
var any$1 = /*#__PURE__*/liftMaybe(any);
var anyPass$1 = /*#__PURE__*/liftStagedMaybe(anyPass);
var ap$1 = /*#__PURE__*/liftMaybe(ap);
var aperture$1 = /*#__PURE__*/liftMaybe(aperture);
var append$1 = /*#__PURE__*/liftMaybe(append);
var apply$1 = /*#__PURE__*/liftMaybe(apply);
var applySpec$1 = /*#__PURE__*/liftMaybe(applySpec);
var ascend$1 = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(ascend));
var assoc$1 = /*#__PURE__*/liftMaybe(assoc);
var assocPath$1 = /*#__PURE__*/liftMaybe(assocPath);
var binary$1 = /*#__PURE__*/liftStagedMaybe(binary);
var both$1 = /*#__PURE__*/liftStagedMaybe(both);
var call$1 = /*#__PURE__*/liftStagedMaybe(call);
var chain$1 = /*#__PURE__*/liftMaybe(chain);
var clamp$1 = /*#__PURE__*/liftMaybe(clamp);
var comparator$1 = /*#__PURE__*/liftStagedMaybe(comparator);
var complement$1 = /*#__PURE__*/liftStagedMaybe(complement);
var compose$1 = /*#__PURE__*/liftStagedMaybe(compose);
var concat$2 = /*#__PURE__*/liftMaybe(concat);
var cond$1 = /*#__PURE__*/liftStagedMaybe(cond);
var construct$1 = /*#__PURE__*/liftStagedMaybe(construct);
var constructN$1 = /*#__PURE__*/liftStagedMaybe(constructN);
var contains$1 = /*#__PURE__*/liftMaybe(contains);
var converge$1 = /*#__PURE__*/liftStagedMaybe(converge);
var countBy$1 = /*#__PURE__*/liftMaybe(countBy);
var curry$2 = /*#__PURE__*/liftStagedMaybe(curry);
var curryN$2 = /*#__PURE__*/liftStagedMaybe(curryN);
var dec$1 = /*#__PURE__*/liftMaybe(dec);
var defaultTo$1 = /*#__PURE__*/liftMaybe(defaultTo);
var descend$1 = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(descend));
var difference$1 = /*#__PURE__*/liftMaybe(difference);
var differenceWith$1 = /*#__PURE__*/liftMaybe(differenceWith);
var dissoc$1 = /*#__PURE__*/liftMaybe(dissoc);
var dissocPath$1 = /*#__PURE__*/liftMaybe(dissocPath);
var divide$1 = /*#__PURE__*/liftMaybe(divide);
var drop$1 = /*#__PURE__*/liftMaybe(drop);
var dropLast$1 = /*#__PURE__*/liftMaybe(dropLast);
var dropLastWhile$1 = /*#__PURE__*/liftMaybe(dropLastWhile);
var dropRepeats$1 = /*#__PURE__*/liftMaybe(dropRepeats);
var dropRepeatsWith$1 = /*#__PURE__*/liftMaybe(dropRepeatsWith);
var dropWhile$1 = /*#__PURE__*/liftMaybe(dropWhile);
var either$1 = /*#__PURE__*/liftStagedMaybe(either);
var empty$1 = /*#__PURE__*/liftMaybe(empty);
var endsWith$1 = /*#__PURE__*/liftMaybe(endsWith);
var eqBy$1 = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(eqBy));
var eqProps$1 = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(eqProps));
var equals$1 = /*#__PURE__*/liftMaybe(equals);
var evolve$1 = /*#__PURE__*/liftMaybe(evolve);
var filter$1 = /*#__PURE__*/liftMaybe(filter);
var find$2 = /*#__PURE__*/liftMaybe(find);
var findIndex$1 = /*#__PURE__*/liftMaybe(findIndex);
var findLast$1 = /*#__PURE__*/liftMaybe(findLast);
var findLastIndex$1 = /*#__PURE__*/liftMaybe(findLastIndex);
var flatten$2 = /*#__PURE__*/liftMaybe(flatten);
var flip$1 = /*#__PURE__*/liftStagedMaybe(flip);
var fromPairs$1 = /*#__PURE__*/liftMaybe(fromPairs);
var groupBy$1 = /*#__PURE__*/liftMaybe(groupBy);
var groupWith$1 = /*#__PURE__*/liftMaybe(groupWith);
var gt$1 = /*#__PURE__*/liftMaybe(gt);
var gte$1 = /*#__PURE__*/liftMaybe(gte);
var has$1 = /*#__PURE__*/liftMaybe(has);
var hasIn$1 = /*#__PURE__*/liftMaybe(hasIn);
var head$1 = /*#__PURE__*/liftMaybe(head);
var identical$1 = /*#__PURE__*/liftMaybe(identical);
var identity$1 = /*#__PURE__*/identity; // lifting won't really work
var ifElse$1 = /*#__PURE__*/liftStagedMaybe(ifElse);
var inc$1 = /*#__PURE__*/liftMaybe(inc);
var indexBy$1 = /*#__PURE__*/liftMaybe(indexBy);
var indexOf$1 = /*#__PURE__*/liftMaybe(indexOf);
var init$1 = /*#__PURE__*/liftMaybe(init);
var innerJoin$1 = /*#__PURE__*/liftMaybe(innerJoin);
var insert$1 = /*#__PURE__*/liftMaybe(insert);
var insertAll$1 = /*#__PURE__*/liftMaybe(insertAll);
var intersection$1 = /*#__PURE__*/liftMaybe(intersection);
var intersperse$1 = /*#__PURE__*/liftMaybe(intersperse);
var into$1 = /*#__PURE__*/liftMaybe(into);
var invert$1 = /*#__PURE__*/liftMaybe(invert);
var invertObj$1 = /*#__PURE__*/liftMaybe(invertObj);
var invoker$1 = /*#__PURE__*/liftStagedMaybe(invoker);
var is$1 = /*#__PURE__*/liftMaybe(stageLast1Of2Maybe(is));
var isEmpty$1 = /*#__PURE__*/liftMaybe(isEmpty);
var isNil$1 = /*#__PURE__*/liftMaybe(isNil);
var join$2 = /*#__PURE__*/liftMaybe(join);
var juxt$1 = /*#__PURE__*/liftStagedMaybe(juxt);
var keys$1 = /*#__PURE__*/lift1ShallowMaybe(keys);
var keysIn$1 = /*#__PURE__*/liftMaybe(keysIn);
var last$1 = /*#__PURE__*/liftMaybe(last);
var lastIndexOf$1 = /*#__PURE__*/liftMaybe(lastIndexOf);
var length$1 = /*#__PURE__*/lift1ShallowMaybe(length);
var lt$1 = /*#__PURE__*/liftMaybe(lt);
var lte$1 = /*#__PURE__*/liftMaybe(lte);
var map$1 = /*#__PURE__*/liftMaybe(map);
var mapAccum$1 = /*#__PURE__*/liftMaybe(mapAccum);
var mapAccumRight$1 = /*#__PURE__*/liftMaybe(mapAccumRight);
var mapObjIndexed$1 = /*#__PURE__*/liftMaybe(mapObjIndexed);
var match$1 = /*#__PURE__*/liftMaybe(match);
var mathMod$1 = /*#__PURE__*/liftMaybe(mathMod);
var max$1 = /*#__PURE__*/liftMaybe(max);
var maxBy$1 = /*#__PURE__*/liftMaybe(maxBy);
var mean$1 = /*#__PURE__*/liftMaybe(mean);
var median$1 = /*#__PURE__*/liftMaybe(median);
var memoize$1 = /*#__PURE__*/liftStagedMaybe(memoize);
var memoizeWith$1 = /*#__PURE__*/liftStagedMaybe(memoizeWith);
var merge$2 = /*#__PURE__*/liftMaybe(merge);
var mergeAll$1 = /*#__PURE__*/liftMaybe(mergeAll);
var mergeDeepLeft$1 = /*#__PURE__*/liftMaybe(mergeDeepLeft);
var mergeDeepRight$1 = /*#__PURE__*/liftMaybe(mergeDeepRight);
var mergeDeepWith$1 = /*#__PURE__*/liftMaybe(mergeDeepWith);
var mergeDeepWithKey$1 = /*#__PURE__*/liftMaybe(mergeDeepWithKey);
var mergeWith$1 = /*#__PURE__*/liftMaybe(mergeWith);
var mergeWithKey$1 = /*#__PURE__*/liftMaybe(mergeWithKey);
var min$1 = /*#__PURE__*/liftMaybe(min);
var minBy$1 = /*#__PURE__*/liftMaybe(minBy);
var modulo$1 = /*#__PURE__*/liftMaybe(modulo);
var multiply$1 = /*#__PURE__*/liftMaybe(multiply);
var nAry$1 = /*#__PURE__*/liftStagedMaybe(nAry);
var negate$1 = /*#__PURE__*/liftMaybe(negate);
var none$1 = /*#__PURE__*/liftMaybe(none);
var not$1 = /*#__PURE__*/liftMaybe(not);
var nth$1 = /*#__PURE__*/liftMaybe(nth);
var nthArg$1 = /*#__PURE__*/liftStagedMaybe(nthArg);
var o$1 = /*#__PURE__*/liftMaybe(o);
var objOf$1 = /*#__PURE__*/liftMaybe(objOf);
var of$1 = /*#__PURE__*/liftMaybe(of);
var omit$1 = /*#__PURE__*/liftMaybe(omit);
var or$1 = /*#__PURE__*/liftMaybe(or);
var pair$1 = /*#__PURE__*/liftMaybe(pair);
var partial$1 = /*#__PURE__*/liftStagedMaybe(partial);
var partialRight$1 = /*#__PURE__*/liftStagedMaybe(partialRight);
var partition$1 = /*#__PURE__*/liftMaybe(partition);
var path$1 = /*#__PURE__*/liftMaybe(path);
var pathEq$1 = /*#__PURE__*/liftMaybe(pathEq);
var pathOr$1 = /*#__PURE__*/liftMaybe(pathOr);
var pathSatisfies$1 = /*#__PURE__*/liftMaybe(pathSatisfies);
var pick$1 = /*#__PURE__*/liftMaybe(pick);
var pickAll$1 = /*#__PURE__*/liftMaybe(pickAll);
var pickBy$1 = /*#__PURE__*/liftMaybe(pickBy);
var pipe$1 = /*#__PURE__*/liftStagedMaybe(pipe);
var pluck$1 = /*#__PURE__*/liftMaybe(pluck);
var prepend$1 = /*#__PURE__*/liftMaybe(prepend);
var product$1 = /*#__PURE__*/liftMaybe(product);
var project$1 = /*#__PURE__*/liftMaybe(project);
var prop$1 = /*#__PURE__*/liftMaybe(prop);
var propEq$1 = /*#__PURE__*/liftMaybe(propEq);
var propIs$1 = /*#__PURE__*/liftMaybe(propIs);
var propOr$1 = /*#__PURE__*/liftMaybe(propOr);
var propSatisfies$1 = /*#__PURE__*/liftMaybe(propSatisfies);
var props$1 = /*#__PURE__*/liftMaybe(props);
var range$1 = /*#__PURE__*/liftMaybe(range);
var reduce$1 = /*#__PURE__*/liftMaybe(reduce);
var reduceBy$1 = /*#__PURE__*/liftMaybe(reduceBy);
var reduceRight$1 = /*#__PURE__*/liftMaybe(reduceRight);
var reduceWhile$1 = /*#__PURE__*/liftMaybe(reduceWhile);
var reduced$1 = /*#__PURE__*/liftMaybe(reduced);
var reject$1 = /*#__PURE__*/liftMaybe(reject);
var remove$1 = /*#__PURE__*/liftMaybe(remove);
var repeat$1 = /*#__PURE__*/liftMaybe(repeat);
var replace$1 = /*#__PURE__*/liftMaybe(replace);
var reverse$1 = /*#__PURE__*/liftMaybe(reverse);
var scan$1 = /*#__PURE__*/liftMaybe(scan);
var sequence$1 = /*#__PURE__*/liftMaybe(sequence);
var slice$1 = /*#__PURE__*/liftMaybe(slice);
var sort$1 = /*#__PURE__*/liftMaybe(sort);
var sortBy$1 = /*#__PURE__*/liftMaybe(sortBy);
var sortWith$1 = /*#__PURE__*/liftMaybe(sortWith);
var split$1 = /*#__PURE__*/liftMaybe(split);
var splitAt$1 = /*#__PURE__*/liftMaybe(splitAt);
var splitEvery$1 = /*#__PURE__*/liftMaybe(splitEvery);
var splitWhen$1 = /*#__PURE__*/liftMaybe(splitWhen);
var startsWith$1 = /*#__PURE__*/liftMaybe(startsWith);
var subtract$1 = /*#__PURE__*/liftMaybe(subtract);
var sum$1 = /*#__PURE__*/liftMaybe(sum);
var symmetricDifference$1 = /*#__PURE__*/liftMaybe(symmetricDifference);
var symmetricDifferenceWith$1 = /*#__PURE__*/liftMaybe(symmetricDifferenceWith);
var tail$1 = /*#__PURE__*/liftMaybe(tail);
var take$1 = /*#__PURE__*/liftMaybe(take);
var takeLast$1 = /*#__PURE__*/liftMaybe(takeLast);
var takeLastWhile$1 = /*#__PURE__*/liftMaybe(takeLastWhile);
var takeWhile$1 = /*#__PURE__*/liftMaybe(takeWhile);
var tap$1 = /*#__PURE__*/liftMaybe(tap);
var test$1 = /*#__PURE__*/liftMaybe(test);
var times$1 = /*#__PURE__*/liftMaybe(times);
var toLower$1 = /*#__PURE__*/liftMaybe(toLower);
var toPairs$1 = /*#__PURE__*/liftMaybe(toPairs);
var toPairsIn$1 = /*#__PURE__*/liftMaybe(toPairsIn);
var toString$1 = /*#__PURE__*/liftMaybe(toString);
var toUpper$1 = /*#__PURE__*/liftMaybe(toUpper);
var transduce$1 = /*#__PURE__*/liftMaybe(transduce);
var transpose$1 = /*#__PURE__*/liftMaybe(transpose);
var traverse$1 = /*#__PURE__*/liftMaybe(traverse);
var trim$1 = /*#__PURE__*/liftMaybe(trim);
var tryCatch$1 = /*#__PURE__*/liftStagedMaybe(tryCatch);
var type$1 = /*#__PURE__*/liftMaybe(type);
var unapply$1 = /*#__PURE__*/liftStagedMaybe(unapply);
var unary$1 = /*#__PURE__*/liftStagedMaybe(unary);
var uncurryN$1 = /*#__PURE__*/liftStagedMaybe(uncurryN);
var unfold$1 = /*#__PURE__*/liftMaybe(unfold);
var union$1 = /*#__PURE__*/liftMaybe(union);
var unionWith$1 = /*#__PURE__*/liftMaybe(unionWith);
var uniq$1 = /*#__PURE__*/liftMaybe(uniq);
var uniqBy$1 = /*#__PURE__*/liftMaybe(uniqBy);
var uniqWith$1 = /*#__PURE__*/liftMaybe(uniqWith);
var unless$1 = /*#__PURE__*/liftMaybe(unless);
var unnest$1 = /*#__PURE__*/liftMaybe(unnest);
var until$1 = /*#__PURE__*/liftMaybe(until);
var update$1 = /*#__PURE__*/liftMaybe(update);
var useWith$1 = /*#__PURE__*/liftStagedMaybe(useWith);
var values$1 = /*#__PURE__*/lift1Maybe(values);
var valuesIn$1 = /*#__PURE__*/liftMaybe(valuesIn);
var when$2 = /*#__PURE__*/liftMaybe(when);
var where$1 = /*#__PURE__*/liftStagedMaybe(stageLast1Of2Maybe(where));
var whereEq$1 = /*#__PURE__*/liftStagedMaybe(stageLast1Of2Maybe(whereEq));
var without$1 = /*#__PURE__*/liftMaybe(without);
var xprod$1 = /*#__PURE__*/liftMaybe(xprod);
var zip$1 = /*#__PURE__*/liftMaybe(zip);
var zipObj$1 = /*#__PURE__*/liftMaybe(zipObj);
var zipWith$1 = /*#__PURE__*/liftMaybe(zipWith);

// Math

var abs = /*#__PURE__*/lift1ShallowMaybe(Math.abs);
var acos = /*#__PURE__*/lift1ShallowMaybe(Math.acos);
var acosh = /*#__PURE__*/lift1ShallowMaybe(Math.acosh);
var asin = /*#__PURE__*/lift1ShallowMaybe(Math.asin);
var asinh = /*#__PURE__*/lift1ShallowMaybe(Math.asinh);
var atan = /*#__PURE__*/lift1ShallowMaybe(Math.atan);
var atan2 = /*#__PURE__*/liftMaybe(Math.atan2);
var atanh = /*#__PURE__*/lift1ShallowMaybe(Math.atanh);
var cbrt = /*#__PURE__*/lift1ShallowMaybe(Math.cbrt);
var ceil = /*#__PURE__*/lift1ShallowMaybe(Math.ceil);
var clz32 = /*#__PURE__*/lift1ShallowMaybe(Math.clz32);
var cos = /*#__PURE__*/lift1ShallowMaybe(Math.cos);
var cosh = /*#__PURE__*/lift1ShallowMaybe(Math.cosh);
var exp = /*#__PURE__*/lift1ShallowMaybe(Math.exp);
var expm1 = /*#__PURE__*/lift1ShallowMaybe(Math.expm1);
var floor = /*#__PURE__*/lift1ShallowMaybe(Math.floor);
var fround = /*#__PURE__*/lift1ShallowMaybe(Math.fround);
var hypot = /*#__PURE__*/liftMaybe(Math.hypot);
var imul = /*#__PURE__*/liftMaybe(Math.imul);
var log = /*#__PURE__*/lift1ShallowMaybe(Math.log);
var log10 = /*#__PURE__*/lift1ShallowMaybe(Math.log10);
var log1p = /*#__PURE__*/lift1ShallowMaybe(Math.log1p);
var log2 = /*#__PURE__*/lift1ShallowMaybe(Math.log2);
var pow = /*#__PURE__*/liftMaybe(Math.pow);
var round = /*#__PURE__*/lift1ShallowMaybe(Math.round);
var sign = /*#__PURE__*/lift1ShallowMaybe(Math.sign);
var sin = /*#__PURE__*/lift1ShallowMaybe(Math.sin);
var sinh = /*#__PURE__*/lift1ShallowMaybe(Math.sinh);
var sqrt = /*#__PURE__*/lift1ShallowMaybe(Math.sqrt);
var tan = /*#__PURE__*/lift1ShallowMaybe(Math.tan);
var tanh = /*#__PURE__*/lift1ShallowMaybe(Math.tanh);
var trunc = /*#__PURE__*/lift1ShallowMaybe(Math.trunc);

//

var indices = /*#__PURE__*/pipe2U(length$1, lift1Shallow(range(0)));

//

var mapElems = /*#__PURE__*/curry$1(function (xi2y, xs) {
  return seq(xs, foldPast(function (ysIn, xsIn) {
    var xsN = xsIn.length;
    var ysN = ysIn.length;
    if (xsN === ysN) return ysIn;
    var ys = Array(xsN);
    for (var i = 0; i < xsN; ++i) {
      ys[i] = i < ysN ? ysIn[i] : xi2y(view(i, xs), i);
    }return ys;
  }, []), skipDuplicates(identicalU));
});

//

var mapElemsWithIds = /*#__PURE__*/curry$1(function (idL, xi2y, xs) {
  var id2info = new Map();
  var idOf = get(idL);
  var pred = function pred(x, _, info) {
    return idOf(x) === info.id;
  };
  return seq(xs, foldPast(function (ysIn, xsIn) {
    var n = xsIn.length;
    var ys = ysIn.length === n ? ysIn : Array(n);
    for (var i = 0; i < n; ++i) {
      var _id2 = idOf(xsIn[i]);
      var info = id2info.get(_id2);
      if (void 0 === info) {
        id2info.set(_id2, info = {});
        info.id = _id2;
        info.hint = i;
        info.elem = xi2y(view(find$1(pred, info), xs), _id2);
      }
      if (ys[i] !== info.elem) {
        info.hint = i;
        if (ys === ysIn) ys = ys.slice(0);
        ys[i] = info.elem;
      }
    }
    if (ys !== ysIn) {
      id2info.forEach(function (info, id$$1) {
        if (ys[info.hint] !== info.elem) id2info.delete(id$$1);
      });
    }
    return ys;
  }, []), skipDuplicates(identicalU));
});

export { lift, lift1, lift1Shallow, liftStaged, template, fromKefir, debounce, changes, serially, parallel, delay, endWith, mapValue, flatMapParallel, flatMapSerial, flatMapErrors, flatMapLatest, foldPast, interval$1 as interval, later$1 as later, lazy, never$1 as never, on, sampledBy, skipFirst, skipDuplicates, skipUnless, skipWhen, startWith, sink, takeFirst, takeUntilBy, toProperty, throttle, fromEvents$1 as fromEvents, set, Bus, bus, refTo, seq, seqPartial, scope, toPartial, show, staged, setProps, getProps, bindProps, bind, cns, classes, mapCached, mapIndexed, ifte, ift, iftes, view, Context, withContext, WithContext, actions, string, atom, variable, molecule, holding, F$1 as F, T$1 as T, __$1 as __, add$1 as add, addIndex$1 as addIndex, adjust$1 as adjust, all$1 as all, allPass$1 as allPass, always$1 as always, and$1 as and, any$1 as any, anyPass$1 as anyPass, ap$1 as ap, aperture$1 as aperture, append$1 as append, apply$1 as apply, applySpec$1 as applySpec, ascend$1 as ascend, assoc$1 as assoc, assocPath$1 as assocPath, binary$1 as binary, both$1 as both, call$1 as call, chain$1 as chain, clamp$1 as clamp, comparator$1 as comparator, complement$1 as complement, compose$1 as compose, concat$2 as concat, cond$1 as cond, construct$1 as construct, constructN$1 as constructN, contains$1 as contains, converge$1 as converge, countBy$1 as countBy, curry$2 as curry, curryN$2 as curryN, dec$1 as dec, defaultTo$1 as defaultTo, descend$1 as descend, difference$1 as difference, differenceWith$1 as differenceWith, dissoc$1 as dissoc, dissocPath$1 as dissocPath, divide$1 as divide, drop$1 as drop, dropLast$1 as dropLast, dropLastWhile$1 as dropLastWhile, dropRepeats$1 as dropRepeats, dropRepeatsWith$1 as dropRepeatsWith, dropWhile$1 as dropWhile, either$1 as either, empty$1 as empty, endsWith$1 as endsWith, eqBy$1 as eqBy, eqProps$1 as eqProps, equals$1 as equals, evolve$1 as evolve, filter$1 as filter, find$2 as find, findIndex$1 as findIndex, findLast$1 as findLast, findLastIndex$1 as findLastIndex, flatten$2 as flatten, flip$1 as flip, fromPairs$1 as fromPairs, groupBy$1 as groupBy, groupWith$1 as groupWith, gt$1 as gt, gte$1 as gte, has$1 as has, hasIn$1 as hasIn, head$1 as head, identical$1 as identical, identity$1 as identity, ifElse$1 as ifElse, inc$1 as inc, indexBy$1 as indexBy, indexOf$1 as indexOf, init$1 as init, innerJoin$1 as innerJoin, insert$1 as insert, insertAll$1 as insertAll, intersection$1 as intersection, intersperse$1 as intersperse, into$1 as into, invert$1 as invert, invertObj$1 as invertObj, invoker$1 as invoker, is$1 as is, isEmpty$1 as isEmpty, isNil$1 as isNil, join$2 as join, juxt$1 as juxt, keys$1 as keys, keysIn$1 as keysIn, last$1 as last, lastIndexOf$1 as lastIndexOf, length$1 as length, lt$1 as lt, lte$1 as lte, map$1 as map, mapAccum$1 as mapAccum, mapAccumRight$1 as mapAccumRight, mapObjIndexed$1 as mapObjIndexed, match$1 as match, mathMod$1 as mathMod, max$1 as max, maxBy$1 as maxBy, mean$1 as mean, median$1 as median, memoize$1 as memoize, memoizeWith$1 as memoizeWith, merge$2 as merge, mergeAll$1 as mergeAll, mergeDeepLeft$1 as mergeDeepLeft, mergeDeepRight$1 as mergeDeepRight, mergeDeepWith$1 as mergeDeepWith, mergeDeepWithKey$1 as mergeDeepWithKey, mergeWith$1 as mergeWith, mergeWithKey$1 as mergeWithKey, min$1 as min, minBy$1 as minBy, modulo$1 as modulo, multiply$1 as multiply, nAry$1 as nAry, negate$1 as negate, none$1 as none, not$1 as not, nth$1 as nth, nthArg$1 as nthArg, o$1 as o, objOf$1 as objOf, of$1 as of, omit$1 as omit, or$1 as or, pair$1 as pair, partial$1 as partial, partialRight$1 as partialRight, partition$1 as partition, path$1 as path, pathEq$1 as pathEq, pathOr$1 as pathOr, pathSatisfies$1 as pathSatisfies, pick$1 as pick, pickAll$1 as pickAll, pickBy$1 as pickBy, pipe$1 as pipe, pluck$1 as pluck, prepend$1 as prepend, product$1 as product, project$1 as project, prop$1 as prop, propEq$1 as propEq, propIs$1 as propIs, propOr$1 as propOr, propSatisfies$1 as propSatisfies, props$1 as props, range$1 as range, reduce$1 as reduce, reduceBy$1 as reduceBy, reduceRight$1 as reduceRight, reduceWhile$1 as reduceWhile, reduced$1 as reduced, reject$1 as reject, remove$1 as remove, repeat$1 as repeat, replace$1 as replace, reverse$1 as reverse, scan$1 as scan, sequence$1 as sequence, slice$1 as slice, sort$1 as sort, sortBy$1 as sortBy, sortWith$1 as sortWith, split$1 as split, splitAt$1 as splitAt, splitEvery$1 as splitEvery, splitWhen$1 as splitWhen, startsWith$1 as startsWith, subtract$1 as subtract, sum$1 as sum, symmetricDifference$1 as symmetricDifference, symmetricDifferenceWith$1 as symmetricDifferenceWith, tail$1 as tail, take$1 as take, takeLast$1 as takeLast, takeLastWhile$1 as takeLastWhile, takeWhile$1 as takeWhile, tap$1 as tap, test$1 as test, times$1 as times, toLower$1 as toLower, toPairs$1 as toPairs, toPairsIn$1 as toPairsIn, toString$1 as toString, toUpper$1 as toUpper, transduce$1 as transduce, transpose$1 as transpose, traverse$1 as traverse, trim$1 as trim, tryCatch$1 as tryCatch, type$1 as type, unapply$1 as unapply, unary$1 as unary, uncurryN$1 as uncurryN, unfold$1 as unfold, union$1 as union, unionWith$1 as unionWith, uniq$1 as uniq, uniqBy$1 as uniqBy, uniqWith$1 as uniqWith, unless$1 as unless, unnest$1 as unnest, until$1 as until, update$1 as update, useWith$1 as useWith, values$1 as values, valuesIn$1 as valuesIn, when$2 as when, where$1 as where, whereEq$1 as whereEq, without$1 as without, xprod$1 as xprod, zip$1 as zip, zipObj$1 as zipObj, zipWith$1 as zipWith, abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, pow, round, sign, sin, sinh, sqrt, tan, tanh, trunc, indices, mapElems, mapElemsWithIds };
export default K;
