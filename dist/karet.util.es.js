import { F, T, __, add, addIndex, adjust, all, allPass, always, and, any, anyPass, ap, aperture, append, apply, applySpec, ascend, assoc, assocPath, binary, both, call, chain, clamp, comparator, complement, compose, concat, cond, construct, constructN, contains, converge, countBy, curry, curryN, dec, defaultTo, descend, difference, differenceWith, dissoc, dissocPath, divide, drop, dropLast, dropLastWhile, dropRepeats, dropRepeatsWith, dropWhile, either, empty, eqBy, eqProps, equals, evolve, filter, find, findIndex, findLast, findLastIndex, flatten, flip, fromPairs, groupBy, groupWith, gt, gte, has, hasIn, head, identical, identity, ifElse, inc, indexBy, indexOf, init, insert, insertAll, intersection, intersectionWith, intersperse, into, invert, invertObj, invoker, is, isEmpty, isNil, join, juxt, keys, keysIn, last, lastIndexOf, length, lt, lte, map, mapAccum, mapAccumRight, mapObjIndexed, match, mathMod, max, maxBy, mean, median, memoize, merge, mergeAll, mergeWith, mergeWithKey, min, minBy, modulo, multiply, nAry, negate, none, not, nth, nthArg, objOf, of, omit, or, pair, partial, partialRight, partition, path, pathEq, pathOr, pathSatisfies, pick, pickAll, pickBy, pipe, pluck, prepend, product, project, prop, propEq, propIs, propOr, propSatisfies, props, range, reduce, reduceBy, reduceRight, reduceWhile, reduced, reject, remove, repeat, replace, reverse, scan, sequence, slice, sort, sortBy, sortWith, split, splitAt, splitEvery, splitWhen, subtract, sum, symmetricDifference, symmetricDifferenceWith, tail, take, takeLast, takeLastWhile, takeWhile, tap, test, times, toLower, toPairs, toPairsIn, toString, toUpper, transduce, transpose, traverse, trim, tryCatch, type, unapply, unary, uncurryN, unfold, union, unionWith, uniq, uniqBy, uniqWith, unless, unnest, until, update, useWith, values, valuesIn, when, where, whereEq, without, xprod, zip, zipObj, zipWith } from 'ramda';
import * as R from 'ramda';
import { AbstractMutable, Atom, Molecule, holding } from 'kefir.atom';
import { Observable, concat as concat$1, constant, fromEvents, interval, later, merge as merge$1, never } from 'kefir';
import { arityN, assocPartialU, curry as curry$1, curryN as curryN$1, dissocPartialU, hasU, id, inherit, isDefined, pipe2U, seq, seqPartial } from 'infestines';
import { get } from 'partial.lenses';
import K, { lift, lift1, lift1Shallow } from 'kefir.combines';
import React, { fromKefir } from 'karet';
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

var debounce = curry$1(function (ms, xs) {
  return toConstant(xs).debounce(ms);
});
var changes = function changes(xs) {
  return toConstant(xs).changes();
};
var serially = function serially(xs) {
  return concat$1(map(toConstant, xs));
};
var parallel = merge$1;
var delay = curry$1(function (ms, xs) {
  return toConstant(xs).delay(ms);
});
var endWith = curry$1(function (v, xs) {
  return toConstant(xs).concat(toConstant(v));
});
var flatMapSerial = curry$1(function (fn, xs) {
  return toConstant(xs).flatMapConcat(pipe2U(fn, toConstant));
});
var flatMapErrors = curry$1(function (fn, xs) {
  return toConstant(xs).flatMapErrors(pipe2U(fn, toConstant));
});
var flatMapLatest = curry$1(function (fn, xs) {
  return toConstant(xs).flatMapLatest(pipe2U(fn, toConstant));
});
var foldPast = curry$1(function (fn, s, xs) {
  return toConstant(xs).scan(fn, s);
});
var interval$1 = curry$1(interval);
var later$1 = curry$1(later);
var lazy = function lazy(th) {
  return seq(toProperty(), flatMapLatest(th), toProperty);
};
var never$1 = never();
var on = curry$1(function (efs, xs) {
  return toConstant(xs).onAny(toHandler(efs));
});
var sampledBy = curry$1(function (es, xs) {
  return toConstant(xs).sampledBy(es);
});
var skipFirst = curry$1(function (n, xs) {
  return toConstant(xs).skip(n);
});
var skipDuplicates = curry$1(function (equals$$1, xs) {
  return toConstant(xs).skipDuplicates(equals$$1);
});
var skipUnless = curry$1(function (p, xs) {
  return toConstant(xs).filter(p);
});
var skipWhen = curry$1(function (p, xs) {
  return toConstant(xs).filter(function (x) {
    return !p(x);
  });
});
var startWith = curry$1(function (x, xs) {
  return toConstant(xs).toProperty(function () {
    return x;
  });
});
var sink = pipe2U(startWith(undefined), lift(toUndefined));
var takeFirst = curry$1(function (n, xs) {
  return toConstant(xs).take(n);
});
var takeUntilBy = curry$1(function (ts, xs) {
  return toConstant(xs).takeUntilBy(ts);
});
var toProperty = function toProperty(xs) {
  return toConstant(xs).toProperty();
};
var throttle = curry$1(function (ms, xs) {
  return toConstant(xs).throttle(ms);
});
var fromEvents$1 = curry$1(fromEvents);

var set = curry$1(function (settable, xs) {
  var ss = K(xs, function (xs) {
    return settable.set(xs);
  });
  if (ss instanceof Observable) return ss.toProperty(toUndefined);
});

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

function classesImmediate() {
  var result = "";
  for (var i = 0, n = arguments.length; i < n; ++i) {
    var a = arguments[i];
    if (a) {
      if (result) result += " ";
      result += a;
    }
  }
  return result;
}

function cns() {
  var n = arguments.length,
      xs = Array(n + 1);
  for (var i = 0; i < n; ++i) {
    xs[i] = arguments[i];
  }xs[n] = classesImmediate;
  return K.apply(null, xs);
}

var classes = function classes() {
  return { className: cns.apply(undefined, arguments) };
};

//

var mapCachedInit = [{}, []];

var mapCachedStep = function mapCachedStep(fromId) {
  return function (old, ids) {
    var oldIds = old[0],
        oldVs = old[1];
    var newIds = {};
    var n = ids.length;
    var changed = n !== oldVs.length;
    var newVs = Array(n);
    for (var i = 0; i < n; ++i) {
      var _id = ids[i];
      var k = _id.toString();
      var v = void 0;
      if (hasU(k, newIds)) v = newIds[k];else v = newIds[k] = hasU(k, oldIds) ? oldIds[k] : fromId(_id);
      newVs[i] = v;
      if (!changed) changed = v !== oldVs[i];
    }
    return changed ? [newIds, newVs] : old;
  };
};

var mapCachedMap = lift1Shallow(function (x) {
  return x[1];
});

var mapCached = curryN$1(2, function (fromId) {
  return pipe2U(foldPast(mapCachedStep(fromId), mapCachedInit), mapCachedMap);
});

//

var mapIndexed = curryN$1(2, function (xi2y) {
  return lift1(function (xs) {
    return xs.map(function (x, i) {
      return xi2y(x, i);
    });
  });
});

var ifte = curry$1(function (b, t, e) {
  return toProperty(flatMapLatest(function (b) {
    return b ? t : e;
  }, b));
});
var ift = curry$1(function (b, t) {
  return toProperty(flatMapLatest(function (b) {
    return b ? t : undefined;
  }, b));
});

//

var viewProp = function viewProp(l, xs) {
  return K(xs, get(l));
};

var view = curry$1(function (l, xs) {
  return xs instanceof AbstractMutable ? xs.view(l) : viewProp(l, xs);
});

//

var types = { context: PropTypes.any };

function Context(props$$1) {
  React.Component.call(this, props$$1);
}

Context.childContextTypes = types;

inherit(Context, React.Component, {
  getChildContext: function getChildContext() {
    return { context: this.props.context };
  },
  render: function render() {
    return this.props.children;
  }
});

function withContext(originalFn) {
  var fn = function fn(props$$1, _ref3) {
    var context = _ref3.context;
    return originalFn(props$$1, context);
  };
  fn.contextTypes = types;
  return fn;
}

var WithContext = withContext(function (_ref4, context) {
  var Do = _ref4.Do;
  return React.createElement(Do, context);
});

//

var actionsImmediate = function actionsImmediate() {
  for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  return function () {
    for (var i = 0, n = fns.length; i < n; ++i) {
      if (fns[i] instanceof Function) fns[i].apply(fns, arguments);
    }
  };
};

var actions = function actions() {
  for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    fns[_key3] = arguments[_key3];
  }

  return K.apply(undefined, fns.concat([actionsImmediate]));
};

//

var string = function string(strings) {
  for (var _len4 = arguments.length, values$$1 = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    values$$1[_key4 - 1] = arguments[_key4];
  }

  return K.apply(undefined, values$$1.concat([function () {
    for (var _len5 = arguments.length, values$$1 = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      values$$1[_key5] = arguments[_key5];
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

var stageLast1Of2Maybe = maybe(function (fn) {
  return function (x1) {
    return function (x2) {
      return fn(x1, x2);
    };
  };
});
var stageLast2Of3Maybe = maybe(function (fn) {
  return function (x1) {
    return function (x2, x3) {
      return fn(x1, x2, x3);
    };
  };
});

var liftMaybe = maybe(lift);
var liftStagedMaybe = maybe(liftStaged);
var lift1Maybe = maybe(lift1);
var lift1ShallowMaybe = maybe(lift1Shallow);

var F$1 = F;
var T$1 = T;
var __$1 = __;
var add$1 = liftMaybe(add);
var addIndex$1 = liftStagedMaybe(addIndex);
var adjust$1 = liftMaybe(adjust);
var all$1 = liftMaybe(all);
var allPass$1 = liftStagedMaybe(allPass);
var always$1 = always; // lifting won't really work
var and$1 = liftMaybe(and);
var any$1 = liftMaybe(any);
var anyPass$1 = liftStagedMaybe(anyPass);
var ap$1 = liftMaybe(ap);
var aperture$1 = liftMaybe(aperture);
var append$1 = liftMaybe(append);
var apply$1 = liftMaybe(apply);
var applySpec$1 = liftMaybe(applySpec);
var ascend$1 = liftMaybe(stageLast2Of3Maybe(ascend));
var assoc$1 = liftMaybe(assoc);
var assocPath$1 = liftMaybe(assocPath);
var binary$1 = liftStagedMaybe(binary);
//export const bind = liftMaybe(R.bind)                          -> conflict, useful?
var both$1 = liftStagedMaybe(both);
var call$1 = liftStagedMaybe(call);
var chain$1 = liftMaybe(chain);
var clamp$1 = liftMaybe(clamp);
//export const clone = liftMaybe(R.clone)                        -> useful?
var comparator$1 = liftStagedMaybe(comparator);
var complement$1 = liftStagedMaybe(complement);
var compose$1 = liftStagedMaybe(compose);
//export const composeK = liftMaybe(R.composeK)                  -> lift staged, useful?
//export const composeP = liftMaybe(R.composeP)                  -> lift staged, useful?
var concat$2 = liftMaybe(concat);
var cond$1 = liftStagedMaybe(cond);
var construct$1 = liftStagedMaybe(construct);
var constructN$1 = liftStagedMaybe(constructN);
var contains$1 = liftMaybe(contains);
var converge$1 = liftStagedMaybe(converge);
var countBy$1 = liftMaybe(countBy);
var curry$2 = liftStagedMaybe(curry);
var curryN$2 = liftStagedMaybe(curryN);
var dec$1 = liftMaybe(dec);
var defaultTo$1 = liftMaybe(defaultTo);
var descend$1 = liftMaybe(stageLast2Of3Maybe(descend));
var difference$1 = liftMaybe(difference);
var differenceWith$1 = liftMaybe(differenceWith);
var dissoc$1 = liftMaybe(dissoc);
var dissocPath$1 = liftMaybe(dissocPath);
var divide$1 = liftMaybe(divide);
var drop$1 = liftMaybe(drop);
var dropLast$1 = liftMaybe(dropLast);
var dropLastWhile$1 = liftMaybe(dropLastWhile);
var dropRepeats$1 = liftMaybe(dropRepeats);
var dropRepeatsWith$1 = liftMaybe(dropRepeatsWith);
var dropWhile$1 = liftMaybe(dropWhile);
var either$1 = liftStagedMaybe(either);
var empty$1 = liftMaybe(empty);
var eqBy$1 = liftMaybe(stageLast2Of3Maybe(eqBy));
var eqProps$1 = liftMaybe(stageLast2Of3Maybe(eqProps));
var equals$1 = liftMaybe(equals);
var evolve$1 = liftMaybe(evolve);
var filter$1 = liftMaybe(filter);
var find$1 = liftMaybe(find);
var findIndex$1 = liftMaybe(findIndex);
var findLast$1 = liftMaybe(findLast);
var findLastIndex$1 = liftMaybe(findLastIndex);
var flatten$1 = liftMaybe(flatten);
var flip$1 = liftStagedMaybe(flip);
//export const forEach = liftMaybe(R.forEach)                       -> useful?
//export const forEachObjIndexed = = liftMaybe(R.forEachObjIndexed) -> useful?
var fromPairs$1 = liftMaybe(fromPairs);
var groupBy$1 = liftMaybe(groupBy);
var groupWith$1 = liftMaybe(groupWith);
var gt$1 = liftMaybe(gt);
var gte$1 = liftMaybe(gte);
var has$1 = liftMaybe(has);
var hasIn$1 = liftMaybe(hasIn);
var head$1 = liftMaybe(head);
var identical$1 = liftMaybe(identical);
var identity$1 = identity; // lifting won't really work
var ifElse$1 = liftStagedMaybe(ifElse);
var inc$1 = liftMaybe(inc);
var indexBy$1 = liftMaybe(indexBy);
var indexOf$1 = liftMaybe(indexOf);
var init$1 = liftMaybe(init);
var insert$1 = liftMaybe(insert);
var insertAll$1 = liftMaybe(insertAll);
var intersection$1 = liftMaybe(intersection);
var intersectionWith$1 = liftMaybe(intersectionWith);
var intersperse$1 = liftMaybe(intersperse);
var into$1 = liftMaybe(into);
var invert$1 = liftMaybe(invert);
var invertObj$1 = liftMaybe(invertObj);
var invoker$1 = liftStagedMaybe(invoker);
var is$1 = liftMaybe(stageLast1Of2Maybe(is));
var isEmpty$1 = liftMaybe(isEmpty);
var isNil$1 = liftMaybe(isNil);
var join$1 = liftMaybe(join);
var juxt$1 = liftStagedMaybe(juxt);
var keys$1 = lift1ShallowMaybe(keys);
var keysIn$1 = liftMaybe(keysIn);
var last$1 = liftMaybe(last);
var lastIndexOf$1 = liftMaybe(lastIndexOf);
var length$1 = lift1ShallowMaybe(length);
//export const lens = liftMaybe(R.lens)                          -> partial.lenses
//export const lensIndex = liftMaybe(R.lensIndex)                -> partial.lenses
//export const lensPath = liftMaybe(R.lensPath)                  -> partial.lenses
//export const lensProp = liftMaybe(R.lensProp)                  -> partial.lenses
//export const lift = liftMaybe(R.lift)                          -> conflict
//export const liftN = liftMaybe(R.liftN)                        -> conflict
var lt$1 = liftMaybe(lt);
var lte$1 = liftMaybe(lte);
var map$1 = liftMaybe(map);
var mapAccum$1 = liftMaybe(mapAccum);
var mapAccumRight$1 = liftMaybe(mapAccumRight);
var mapObjIndexed$1 = liftMaybe(mapObjIndexed);
var match$1 = liftMaybe(match);
var mathMod$1 = liftMaybe(mathMod);
var max$1 = liftMaybe(max);
var maxBy$1 = liftMaybe(maxBy);
var mean$1 = liftMaybe(mean);
var median$1 = liftMaybe(median);
var memoize$1 = liftStagedMaybe(memoize);
var merge$2 = liftMaybe(merge);
var mergeAll$1 = liftMaybe(mergeAll);
var mergeWith$1 = liftMaybe(mergeWith);
var mergeWithKey$1 = liftMaybe(mergeWithKey);
var min$1 = liftMaybe(min);
var minBy$1 = liftMaybe(minBy);
var modulo$1 = liftMaybe(modulo);
var multiply$1 = liftMaybe(multiply);
var nAry$1 = liftStagedMaybe(nAry);
var negate$1 = liftMaybe(negate);
var none$1 = liftMaybe(none);
var not$1 = liftMaybe(not);
var nth$1 = liftMaybe(nth);
var nthArg$1 = liftStagedMaybe(nthArg);
var objOf$1 = liftMaybe(objOf);
var of$1 = liftMaybe(of);
var omit$1 = liftMaybe(omit);
//export const once = liftMaybe(R.once)                          -> lift staged, usually wrong thing to do?
var or$1 = liftMaybe(or);
//export const over = liftMaybe(R.over)                          -> partial.lenses
var pair$1 = liftMaybe(pair);
var partial$1 = liftStagedMaybe(partial);
var partialRight$1 = liftStagedMaybe(partialRight);
var partition$1 = liftMaybe(partition);
var path$1 = liftMaybe(path);
var pathEq$1 = liftMaybe(pathEq);
var pathOr$1 = liftMaybe(pathOr);
var pathSatisfies$1 = liftMaybe(pathSatisfies);
var pick$1 = liftMaybe(pick);
var pickAll$1 = liftMaybe(pickAll);
var pickBy$1 = liftMaybe(pickBy);
var pipe$1 = liftStagedMaybe(pipe);
//export const pipeK = liftMaybe(R.pipeK)                        -> lift staged, useful?
//export const pipeP = liftMaybe(R.pipeP)                        -> lift staged, useful?
var pluck$1 = liftMaybe(pluck);
var prepend$1 = liftMaybe(prepend);
var product$1 = liftMaybe(product);
var project$1 = liftMaybe(project);
var prop$1 = liftMaybe(prop);
var propEq$1 = liftMaybe(propEq);
var propIs$1 = liftMaybe(propIs);
var propOr$1 = liftMaybe(propOr);
var propSatisfies$1 = liftMaybe(propSatisfies);
var props$1 = liftMaybe(props);
var range$1 = liftMaybe(range);
var reduce$1 = liftMaybe(reduce);
var reduceBy$1 = liftMaybe(reduceBy);
var reduceRight$1 = liftMaybe(reduceRight);
var reduceWhile$1 = liftMaybe(reduceWhile);
var reduced$1 = liftMaybe(reduced);
var reject$1 = liftMaybe(reject);
var remove$1 = liftMaybe(remove);
var repeat$1 = liftMaybe(repeat);
var replace$1 = liftMaybe(replace);
var reverse$1 = liftMaybe(reverse);
var scan$1 = liftMaybe(scan);
var sequence$1 = liftMaybe(sequence);
//export const set = liftMaybe(R.set)                            -> partial.lenses, conflict
var slice$1 = liftMaybe(slice);
var sort$1 = liftMaybe(sort);
var sortBy$1 = liftMaybe(sortBy);
var sortWith$1 = liftMaybe(sortWith);
var split$1 = liftMaybe(split);
var splitAt$1 = liftMaybe(splitAt);
var splitEvery$1 = liftMaybe(splitEvery);
var splitWhen$1 = liftMaybe(splitWhen);
var subtract$1 = liftMaybe(subtract);
var sum$1 = liftMaybe(sum);
var symmetricDifference$1 = liftMaybe(symmetricDifference);
var symmetricDifferenceWith$1 = liftMaybe(symmetricDifferenceWith);
var tail$1 = liftMaybe(tail);
var take$1 = liftMaybe(take);
var takeLast$1 = liftMaybe(takeLast);
var takeLastWhile$1 = liftMaybe(takeLastWhile);
var takeWhile$1 = liftMaybe(takeWhile);
var tap$1 = liftMaybe(tap);
var test$1 = liftMaybe(test);
var times$1 = liftMaybe(times);
var toLower$1 = liftMaybe(toLower);
var toPairs$1 = liftMaybe(toPairs);
var toPairsIn$1 = liftMaybe(toPairsIn);
var toString$1 = liftMaybe(toString);
var toUpper$1 = liftMaybe(toUpper);
var transduce$1 = liftMaybe(transduce);
var transpose$1 = liftMaybe(transpose);
var traverse$1 = liftMaybe(traverse);
var trim$1 = liftMaybe(trim);
var tryCatch$1 = liftStagedMaybe(tryCatch);
var type$1 = liftMaybe(type);
var unapply$1 = liftStagedMaybe(unapply);
var unary$1 = liftStagedMaybe(unary);
var uncurryN$1 = liftStagedMaybe(uncurryN);
var unfold$1 = liftMaybe(unfold);
var union$1 = liftMaybe(union);
var unionWith$1 = liftMaybe(unionWith);
var uniq$1 = liftMaybe(uniq);
var uniqBy$1 = liftMaybe(uniqBy);
var uniqWith$1 = liftMaybe(uniqWith);
var unless$1 = liftMaybe(unless);
var unnest$1 = liftMaybe(unnest);
var until$1 = liftMaybe(until);
var update$1 = liftMaybe(update);
var useWith$1 = liftStagedMaybe(useWith);
var values$1 = lift1Maybe(values);
var valuesIn$1 = liftMaybe(valuesIn);
//export const view = liftMaybe(R.view)                          -> partial.lenses, conflict
var when$1 = liftMaybe(when);
var where$1 = liftStagedMaybe(stageLast1Of2Maybe(where));
var whereEq$1 = liftStagedMaybe(stageLast1Of2Maybe(whereEq));
var without$1 = liftMaybe(without);
var xprod$1 = liftMaybe(xprod);
var zip$1 = liftMaybe(zip);
var zipObj$1 = liftMaybe(zipObj);
var zipWith$1 = liftMaybe(zipWith);

// Math

var abs = lift1ShallowMaybe(Math.abs);
var acos = lift1ShallowMaybe(Math.acos);
var acosh = lift1ShallowMaybe(Math.acosh);
var asin = lift1ShallowMaybe(Math.asin);
var asinh = lift1ShallowMaybe(Math.asinh);
var atan = lift1ShallowMaybe(Math.atan);
var atan2 = liftMaybe(Math.atan2);
var atanh = lift1ShallowMaybe(Math.atanh);
var cbrt = lift1ShallowMaybe(Math.cbrt);
var ceil = lift1ShallowMaybe(Math.ceil);
var clz32 = lift1ShallowMaybe(Math.clz32);
var cos = lift1ShallowMaybe(Math.cos);
var cosh = lift1ShallowMaybe(Math.cosh);
var exp = lift1ShallowMaybe(Math.exp);
var expm1 = lift1ShallowMaybe(Math.expm1);
var floor = lift1ShallowMaybe(Math.floor);
var fround = lift1ShallowMaybe(Math.fround);
var hypot = liftMaybe(Math.hypot);
var imul = liftMaybe(Math.imul);
var log = lift1ShallowMaybe(Math.log);
var log10 = lift1ShallowMaybe(Math.log10);
var log1p = lift1ShallowMaybe(Math.log1p);
var log2 = lift1ShallowMaybe(Math.log2);
var pow = liftMaybe(Math.pow);
var round = lift1ShallowMaybe(Math.round);
var sign = lift1ShallowMaybe(Math.sign);
var sin = lift1ShallowMaybe(Math.sin);
var sinh = lift1ShallowMaybe(Math.sinh);
var sqrt = lift1ShallowMaybe(Math.sqrt);
var tan = lift1ShallowMaybe(Math.tan);
var tanh = lift1ShallowMaybe(Math.tanh);
var trunc = lift1ShallowMaybe(Math.trunc);

//

var indices = pipe2U(length$1, lift1Shallow(range(0)));

var mapElems = curry$1(function (fn, elems) {
  return mapCached(function (i) {
    return fn(view(i, elems), i);
  }, indices(elems));
});

export { lift, lift1, lift1Shallow, liftStaged, template, fromKefir, debounce, changes, serially, parallel, delay, endWith, flatMapSerial, flatMapErrors, flatMapLatest, foldPast, interval$1 as interval, later$1 as later, lazy, never$1 as never, on, sampledBy, skipFirst, skipDuplicates, skipUnless, skipWhen, startWith, sink, takeFirst, takeUntilBy, toProperty, throttle, fromEvents$1 as fromEvents, set, refTo, seq, seqPartial, scope, toPartial, show, staged, setProps, getProps, bindProps, bind, cns, classes, mapCached, mapIndexed, ifte, ift, view, Context, withContext, WithContext, actions, string, atom, variable, molecule, holding, F$1 as F, T$1 as T, __$1 as __, add$1 as add, addIndex$1 as addIndex, adjust$1 as adjust, all$1 as all, allPass$1 as allPass, always$1 as always, and$1 as and, any$1 as any, anyPass$1 as anyPass, ap$1 as ap, aperture$1 as aperture, append$1 as append, apply$1 as apply, applySpec$1 as applySpec, ascend$1 as ascend, assoc$1 as assoc, assocPath$1 as assocPath, binary$1 as binary, both$1 as both, call$1 as call, chain$1 as chain, clamp$1 as clamp, comparator$1 as comparator, complement$1 as complement, compose$1 as compose, concat$2 as concat, cond$1 as cond, construct$1 as construct, constructN$1 as constructN, contains$1 as contains, converge$1 as converge, countBy$1 as countBy, curry$2 as curry, curryN$2 as curryN, dec$1 as dec, defaultTo$1 as defaultTo, descend$1 as descend, difference$1 as difference, differenceWith$1 as differenceWith, dissoc$1 as dissoc, dissocPath$1 as dissocPath, divide$1 as divide, drop$1 as drop, dropLast$1 as dropLast, dropLastWhile$1 as dropLastWhile, dropRepeats$1 as dropRepeats, dropRepeatsWith$1 as dropRepeatsWith, dropWhile$1 as dropWhile, either$1 as either, empty$1 as empty, eqBy$1 as eqBy, eqProps$1 as eqProps, equals$1 as equals, evolve$1 as evolve, filter$1 as filter, find$1 as find, findIndex$1 as findIndex, findLast$1 as findLast, findLastIndex$1 as findLastIndex, flatten$1 as flatten, flip$1 as flip, fromPairs$1 as fromPairs, groupBy$1 as groupBy, groupWith$1 as groupWith, gt$1 as gt, gte$1 as gte, has$1 as has, hasIn$1 as hasIn, head$1 as head, identical$1 as identical, identity$1 as identity, ifElse$1 as ifElse, inc$1 as inc, indexBy$1 as indexBy, indexOf$1 as indexOf, init$1 as init, insert$1 as insert, insertAll$1 as insertAll, intersection$1 as intersection, intersectionWith$1 as intersectionWith, intersperse$1 as intersperse, into$1 as into, invert$1 as invert, invertObj$1 as invertObj, invoker$1 as invoker, is$1 as is, isEmpty$1 as isEmpty, isNil$1 as isNil, join$1 as join, juxt$1 as juxt, keys$1 as keys, keysIn$1 as keysIn, last$1 as last, lastIndexOf$1 as lastIndexOf, length$1 as length, lt$1 as lt, lte$1 as lte, map$1 as map, mapAccum$1 as mapAccum, mapAccumRight$1 as mapAccumRight, mapObjIndexed$1 as mapObjIndexed, match$1 as match, mathMod$1 as mathMod, max$1 as max, maxBy$1 as maxBy, mean$1 as mean, median$1 as median, memoize$1 as memoize, merge$2 as merge, mergeAll$1 as mergeAll, mergeWith$1 as mergeWith, mergeWithKey$1 as mergeWithKey, min$1 as min, minBy$1 as minBy, modulo$1 as modulo, multiply$1 as multiply, nAry$1 as nAry, negate$1 as negate, none$1 as none, not$1 as not, nth$1 as nth, nthArg$1 as nthArg, objOf$1 as objOf, of$1 as of, omit$1 as omit, or$1 as or, pair$1 as pair, partial$1 as partial, partialRight$1 as partialRight, partition$1 as partition, path$1 as path, pathEq$1 as pathEq, pathOr$1 as pathOr, pathSatisfies$1 as pathSatisfies, pick$1 as pick, pickAll$1 as pickAll, pickBy$1 as pickBy, pipe$1 as pipe, pluck$1 as pluck, prepend$1 as prepend, product$1 as product, project$1 as project, prop$1 as prop, propEq$1 as propEq, propIs$1 as propIs, propOr$1 as propOr, propSatisfies$1 as propSatisfies, props$1 as props, range$1 as range, reduce$1 as reduce, reduceBy$1 as reduceBy, reduceRight$1 as reduceRight, reduceWhile$1 as reduceWhile, reduced$1 as reduced, reject$1 as reject, remove$1 as remove, repeat$1 as repeat, replace$1 as replace, reverse$1 as reverse, scan$1 as scan, sequence$1 as sequence, slice$1 as slice, sort$1 as sort, sortBy$1 as sortBy, sortWith$1 as sortWith, split$1 as split, splitAt$1 as splitAt, splitEvery$1 as splitEvery, splitWhen$1 as splitWhen, subtract$1 as subtract, sum$1 as sum, symmetricDifference$1 as symmetricDifference, symmetricDifferenceWith$1 as symmetricDifferenceWith, tail$1 as tail, take$1 as take, takeLast$1 as takeLast, takeLastWhile$1 as takeLastWhile, takeWhile$1 as takeWhile, tap$1 as tap, test$1 as test, times$1 as times, toLower$1 as toLower, toPairs$1 as toPairs, toPairsIn$1 as toPairsIn, toString$1 as toString, toUpper$1 as toUpper, transduce$1 as transduce, transpose$1 as transpose, traverse$1 as traverse, trim$1 as trim, tryCatch$1 as tryCatch, type$1 as type, unapply$1 as unapply, unary$1 as unary, uncurryN$1 as uncurryN, unfold$1 as unfold, union$1 as union, unionWith$1 as unionWith, uniq$1 as uniq, uniqBy$1 as uniqBy, uniqWith$1 as uniqWith, unless$1 as unless, unnest$1 as unnest, until$1 as until, update$1 as update, useWith$1 as useWith, values$1 as values, valuesIn$1 as valuesIn, when$1 as when, where$1 as where, whereEq$1 as whereEq, without$1 as without, xprod$1 as xprod, zip$1 as zip, zipObj$1 as zipObj, zipWith$1 as zipWith, abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, pow, round, sign, sin, sinh, sqrt, tan, tanh, trunc, indices, mapElems };export default K;
