'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var R = require('ramda');
var kefir_atom = require('kefir.atom');
var kefir = require('kefir');
var infestines = require('infestines');
var partial_lenses = require('partial.lenses');
var K = require('kefir.combines');
var K__default = _interopDefault(K);
var React = require('karet');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

var liftStaged = function liftStaged(fn) {
  return K.lift(infestines.pipe2U(fn, K.lift));
};
var template = function template(observables) {
  return K__default(observables, infestines.id);
};

// Kefir

var toUndefined = function toUndefined(_) {};
var toConstant = function toConstant(x) {
  return x instanceof kefir.Observable ? x : kefir.constant(x);
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

var debounce = infestines.curry(function (ms, xs) {
  return toConstant(xs).debounce(ms);
});
var changes = function changes(xs) {
  return toConstant(xs).changes();
};
var serially = function serially(xs) {
  return kefir.concat(R.map(toConstant, xs));
};
var parallel = kefir.merge;
var delay = infestines.curry(function (ms, xs) {
  return toConstant(xs).delay(ms);
});
var endWith = infestines.curry(function (v, xs) {
  return toConstant(xs).concat(toConstant(v));
});
var flatMapSerial = infestines.curry(function (fn, xs) {
  return toConstant(xs).flatMapConcat(infestines.pipe2U(fn, toConstant));
});
var flatMapErrors = infestines.curry(function (fn, xs) {
  return toConstant(xs).flatMapErrors(infestines.pipe2U(fn, toConstant));
});
var flatMapLatest = infestines.curry(function (fn, xs) {
  return toConstant(xs).flatMapLatest(infestines.pipe2U(fn, toConstant));
});
var foldPast = infestines.curry(function (fn, s, xs) {
  return toConstant(xs).scan(fn, s);
});
var interval$1 = infestines.curry(kefir.interval);
var later$1 = infestines.curry(kefir.later);
var lazy = function lazy(th) {
  return infestines.seq(toProperty(), flatMapLatest(th), toProperty);
};
var never$1 = kefir.never();
var on = infestines.curry(function (efs, xs) {
  return toConstant(xs).onAny(toHandler(efs));
});
var sampledBy = infestines.curry(function (es, xs) {
  return toConstant(xs).sampledBy(es);
});
var skipFirst = infestines.curry(function (n, xs) {
  return toConstant(xs).skip(n);
});
var skipDuplicates = infestines.curry(function (equals$$1, xs) {
  return toConstant(xs).skipDuplicates(equals$$1);
});
var skipUnless = infestines.curry(function (p, xs) {
  return toConstant(xs).filter(p);
});
var skipWhen = infestines.curry(function (p, xs) {
  return toConstant(xs).filter(function (x) {
    return !p(x);
  });
});
var startWith = infestines.curry(function (x, xs) {
  return toConstant(xs).toProperty(function () {
    return x;
  });
});
var sink = infestines.pipe2U(startWith(undefined), K.lift(toUndefined));
var takeFirst = infestines.curry(function (n, xs) {
  return toConstant(xs).take(n);
});
var takeUntilBy = infestines.curry(function (ts, xs) {
  return toConstant(xs).takeUntilBy(ts);
});
var toProperty = function toProperty(xs) {
  return toConstant(xs).toProperty();
};
var throttle = infestines.curry(function (ms, xs) {
  return toConstant(xs).throttle(ms);
});
var fromEvents$1 = infestines.curry(kefir.fromEvents);

var set = infestines.curry(function (settable, xs) {
  var ss = K__default(xs, function (xs) {
    return settable.set(xs);
  });
  if (ss instanceof kefir.Observable) return ss.toProperty(toUndefined);
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
  return K.lift(infestines.arityN(fn.length, function () {
    for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
      xs[_key] = arguments[_key];
    }

    return R.all(infestines.isDefined, xs) ? fn.apply(undefined, xs) : undefined;
  }));
};

var show = function show(x) {
  return console.log(x) || x;
};

var staged = function staged(fn) {
  return R.curryN(fn.length, function () {
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
  var template = infestines.dissocPartialU("ref", templateWithRef);
  var r = { ref: setProps(template) };
  r[ref] = getProps(template);
  return r;
};

var bind = function bind(template) {
  return infestines.assocPartialU("onChange", getProps(template), template);
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
  return K__default.apply(null, xs);
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
      if (infestines.hasU(k, newIds)) v = newIds[k];else v = newIds[k] = infestines.hasU(k, oldIds) ? oldIds[k] : fromId(_id);
      newVs[i] = v;
      if (!changed) changed = v !== oldVs[i];
    }
    return changed ? [newIds, newVs] : old;
  };
};

var mapCachedMap = K.lift1Shallow(function (x) {
  return x[1];
});

var mapCached = infestines.curryN(2, function (fromId) {
  return infestines.pipe2U(foldPast(mapCachedStep(fromId), mapCachedInit), mapCachedMap);
});

//

var mapIndexed = infestines.curryN(2, function (xi2y) {
  return K.lift1(function (xs) {
    return xs.map(function (x, i) {
      return xi2y(x, i);
    });
  });
});

var ifte = infestines.curry(function (b, t, e) {
  return toProperty(flatMapLatest(function (b) {
    return b ? t : e;
  }, b));
});
var ift = infestines.curry(function (b, t) {
  return toProperty(flatMapLatest(function (b) {
    return b ? t : undefined;
  }, b));
});

//

var viewProp = function viewProp(l, xs) {
  return K__default(xs, partial_lenses.get(l));
};

var view = infestines.curry(function (l, xs) {
  return xs instanceof kefir_atom.AbstractMutable ? xs.view(l) : viewProp(l, xs);
});

//

var types = { context: PropTypes.any };

function Context(props$$1) {
  React__default.Component.call(this, props$$1);
}

Context.childContextTypes = types;

infestines.inherit(Context, React__default.Component, {
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
  return React__default.createElement(Do, context);
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

  return K__default.apply(undefined, fns.concat([actionsImmediate]));
};

//

var string = function string(strings) {
  for (var _len4 = arguments.length, values$$1 = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    values$$1[_key4 - 1] = arguments[_key4];
  }

  return K__default.apply(undefined, values$$1.concat([function () {
    for (var _len5 = arguments.length, values$$1 = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      values$$1[_key5] = arguments[_key5];
    }

    return String.raw.apply(String, [strings].concat(values$$1));
  }]));
};

//

var atom = function atom(value) {
  return new kefir_atom.Atom(value);
};
var variable = function variable() {
  return new kefir_atom.Atom();
};
var molecule = function molecule(template) {
  return new kefir_atom.Molecule(template);
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

var liftMaybe = maybe(K.lift);
var liftStagedMaybe = maybe(liftStaged);
var lift1Maybe = maybe(K.lift1);
var lift1ShallowMaybe = maybe(K.lift1Shallow);

var F$1 = R.F;
var T$1 = R.T;
var __$1 = R.__;
var add$1 = liftMaybe(R.add);
var addIndex$1 = liftStagedMaybe(R.addIndex);
var adjust$1 = liftMaybe(R.adjust);
var all$1 = liftMaybe(R.all);
var allPass$1 = liftStagedMaybe(R.allPass);
var always$1 = R.always; // lifting won't really work
var and$1 = liftMaybe(R.and);
var any$1 = liftMaybe(R.any);
var anyPass$1 = liftStagedMaybe(R.anyPass);
var ap$1 = liftMaybe(R.ap);
var aperture$1 = liftMaybe(R.aperture);
var append$1 = liftMaybe(R.append);
var apply$1 = liftMaybe(R.apply);
var applySpec$1 = liftMaybe(R.applySpec);
var ascend$1 = liftMaybe(stageLast2Of3Maybe(R.ascend));
var assoc$1 = liftMaybe(R.assoc);
var assocPath$1 = liftMaybe(R.assocPath);
var binary$1 = liftStagedMaybe(R.binary);
//export const bind = liftMaybe(R.bind)                          -> conflict, useful?
var both$1 = liftStagedMaybe(R.both);
var call$1 = liftStagedMaybe(R.call);
var chain$1 = liftMaybe(R.chain);
var clamp$1 = liftMaybe(R.clamp);
//export const clone = liftMaybe(R.clone)                        -> useful?
var comparator$1 = liftStagedMaybe(R.comparator);
var complement$1 = liftStagedMaybe(R.complement);
var compose$1 = liftStagedMaybe(R.compose);
//export const composeK = liftMaybe(R.composeK)                  -> lift staged, useful?
//export const composeP = liftMaybe(R.composeP)                  -> lift staged, useful?
var concat$2 = liftMaybe(R.concat);
var cond$1 = liftStagedMaybe(R.cond);
var construct$1 = liftStagedMaybe(R.construct);
var constructN$1 = liftStagedMaybe(R.constructN);
var contains$1 = liftMaybe(R.contains);
var converge$1 = liftStagedMaybe(R.converge);
var countBy$1 = liftMaybe(R.countBy);
var curry$2 = liftStagedMaybe(R.curry);
var curryN$2 = liftStagedMaybe(R.curryN);
var dec$1 = liftMaybe(R.dec);
var defaultTo$1 = liftMaybe(R.defaultTo);
var descend$1 = liftMaybe(stageLast2Of3Maybe(R.descend));
var difference$1 = liftMaybe(R.difference);
var differenceWith$1 = liftMaybe(R.differenceWith);
var dissoc$1 = liftMaybe(R.dissoc);
var dissocPath$1 = liftMaybe(R.dissocPath);
var divide$1 = liftMaybe(R.divide);
var drop$1 = liftMaybe(R.drop);
var dropLast$1 = liftMaybe(R.dropLast);
var dropLastWhile$1 = liftMaybe(R.dropLastWhile);
var dropRepeats$1 = liftMaybe(R.dropRepeats);
var dropRepeatsWith$1 = liftMaybe(R.dropRepeatsWith);
var dropWhile$1 = liftMaybe(R.dropWhile);
var either$1 = liftStagedMaybe(R.either);
var empty$1 = liftMaybe(R.empty);
var eqBy$1 = liftMaybe(stageLast2Of3Maybe(R.eqBy));
var eqProps$1 = liftMaybe(stageLast2Of3Maybe(R.eqProps));
var equals$1 = liftMaybe(R.equals);
var evolve$1 = liftMaybe(R.evolve);
var filter$1 = liftMaybe(R.filter);
var find$1 = liftMaybe(R.find);
var findIndex$1 = liftMaybe(R.findIndex);
var findLast$1 = liftMaybe(R.findLast);
var findLastIndex$1 = liftMaybe(R.findLastIndex);
var flatten$1 = liftMaybe(R.flatten);
var flip$1 = liftStagedMaybe(R.flip);
//export const forEach = liftMaybe(R.forEach)                       -> useful?
//export const forEachObjIndexed = = liftMaybe(R.forEachObjIndexed) -> useful?
var fromPairs$1 = liftMaybe(R.fromPairs);
var groupBy$1 = liftMaybe(R.groupBy);
var groupWith$1 = liftMaybe(R.groupWith);
var gt$1 = liftMaybe(R.gt);
var gte$1 = liftMaybe(R.gte);
var has$1 = liftMaybe(R.has);
var hasIn$1 = liftMaybe(R.hasIn);
var head$1 = liftMaybe(R.head);
var identical$1 = liftMaybe(R.identical);
var identity$1 = R.identity; // lifting won't really work
var ifElse$1 = liftStagedMaybe(R.ifElse);
var inc$1 = liftMaybe(R.inc);
var indexBy$1 = liftMaybe(R.indexBy);
var indexOf$1 = liftMaybe(R.indexOf);
var init$1 = liftMaybe(R.init);
var insert$1 = liftMaybe(R.insert);
var insertAll$1 = liftMaybe(R.insertAll);
var intersection$1 = liftMaybe(R.intersection);
var intersectionWith$1 = liftMaybe(R.intersectionWith);
var intersperse$1 = liftMaybe(R.intersperse);
var into$1 = liftMaybe(R.into);
var invert$1 = liftMaybe(R.invert);
var invertObj$1 = liftMaybe(R.invertObj);
var invoker$1 = liftStagedMaybe(R.invoker);
var is$1 = liftMaybe(stageLast1Of2Maybe(R.is));
var isEmpty$1 = liftMaybe(R.isEmpty);
var isNil$1 = liftMaybe(R.isNil);
var join$1 = liftMaybe(R.join);
var juxt$1 = liftStagedMaybe(R.juxt);
var keys$1 = lift1ShallowMaybe(R.keys);
var keysIn$1 = liftMaybe(R.keysIn);
var last$1 = liftMaybe(R.last);
var lastIndexOf$1 = liftMaybe(R.lastIndexOf);
var length$1 = lift1ShallowMaybe(R.length);
//export const lens = liftMaybe(R.lens)                          -> partial.lenses
//export const lensIndex = liftMaybe(R.lensIndex)                -> partial.lenses
//export const lensPath = liftMaybe(R.lensPath)                  -> partial.lenses
//export const lensProp = liftMaybe(R.lensProp)                  -> partial.lenses
//export const lift = liftMaybe(R.lift)                          -> conflict
//export const liftN = liftMaybe(R.liftN)                        -> conflict
var lt$1 = liftMaybe(R.lt);
var lte$1 = liftMaybe(R.lte);
var map$1 = liftMaybe(R.map);
var mapAccum$1 = liftMaybe(R.mapAccum);
var mapAccumRight$1 = liftMaybe(R.mapAccumRight);
var mapObjIndexed$1 = liftMaybe(R.mapObjIndexed);
var match$1 = liftMaybe(R.match);
var mathMod$1 = liftMaybe(R.mathMod);
var max$1 = liftMaybe(R.max);
var maxBy$1 = liftMaybe(R.maxBy);
var mean$1 = liftMaybe(R.mean);
var median$1 = liftMaybe(R.median);
var memoize$1 = liftStagedMaybe(R.memoize);
var merge$2 = liftMaybe(R.merge);
var mergeAll$1 = liftMaybe(R.mergeAll);
var mergeWith$1 = liftMaybe(R.mergeWith);
var mergeWithKey$1 = liftMaybe(R.mergeWithKey);
var min$1 = liftMaybe(R.min);
var minBy$1 = liftMaybe(R.minBy);
var modulo$1 = liftMaybe(R.modulo);
var multiply$1 = liftMaybe(R.multiply);
var nAry$1 = liftStagedMaybe(R.nAry);
var negate$1 = liftMaybe(R.negate);
var none$1 = liftMaybe(R.none);
var not$1 = liftMaybe(R.not);
var nth$1 = liftMaybe(R.nth);
var nthArg$1 = liftStagedMaybe(R.nthArg);
var objOf$1 = liftMaybe(R.objOf);
var of$1 = liftMaybe(R.of);
var omit$1 = liftMaybe(R.omit);
//export const once = liftMaybe(R.once)                          -> lift staged, usually wrong thing to do?
var or$1 = liftMaybe(R.or);
//export const over = liftMaybe(R.over)                          -> partial.lenses
var pair$1 = liftMaybe(R.pair);
var partial$1 = liftStagedMaybe(R.partial);
var partialRight$1 = liftStagedMaybe(R.partialRight);
var partition$1 = liftMaybe(R.partition);
var path$1 = liftMaybe(R.path);
var pathEq$1 = liftMaybe(R.pathEq);
var pathOr$1 = liftMaybe(R.pathOr);
var pathSatisfies$1 = liftMaybe(R.pathSatisfies);
var pick$1 = liftMaybe(R.pick);
var pickAll$1 = liftMaybe(R.pickAll);
var pickBy$1 = liftMaybe(R.pickBy);
var pipe$1 = liftStagedMaybe(R.pipe);
//export const pipeK = liftMaybe(R.pipeK)                        -> lift staged, useful?
//export const pipeP = liftMaybe(R.pipeP)                        -> lift staged, useful?
var pluck$1 = liftMaybe(R.pluck);
var prepend$1 = liftMaybe(R.prepend);
var product$1 = liftMaybe(R.product);
var project$1 = liftMaybe(R.project);
var prop$1 = liftMaybe(R.prop);
var propEq$1 = liftMaybe(R.propEq);
var propIs$1 = liftMaybe(R.propIs);
var propOr$1 = liftMaybe(R.propOr);
var propSatisfies$1 = liftMaybe(R.propSatisfies);
var props$1 = liftMaybe(R.props);
var range$1 = liftMaybe(R.range);
var reduce$1 = liftMaybe(R.reduce);
var reduceBy$1 = liftMaybe(R.reduceBy);
var reduceRight$1 = liftMaybe(R.reduceRight);
var reduceWhile$1 = liftMaybe(R.reduceWhile);
var reduced$1 = liftMaybe(R.reduced);
var reject$1 = liftMaybe(R.reject);
var remove$1 = liftMaybe(R.remove);
var repeat$1 = liftMaybe(R.repeat);
var replace$1 = liftMaybe(R.replace);
var reverse$1 = liftMaybe(R.reverse);
var scan$1 = liftMaybe(R.scan);
var sequence$1 = liftMaybe(R.sequence);
//export const set = liftMaybe(R.set)                            -> partial.lenses, conflict
var slice$1 = liftMaybe(R.slice);
var sort$1 = liftMaybe(R.sort);
var sortBy$1 = liftMaybe(R.sortBy);
var sortWith$1 = liftMaybe(R.sortWith);
var split$1 = liftMaybe(R.split);
var splitAt$1 = liftMaybe(R.splitAt);
var splitEvery$1 = liftMaybe(R.splitEvery);
var splitWhen$1 = liftMaybe(R.splitWhen);
var subtract$1 = liftMaybe(R.subtract);
var sum$1 = liftMaybe(R.sum);
var symmetricDifference$1 = liftMaybe(R.symmetricDifference);
var symmetricDifferenceWith$1 = liftMaybe(R.symmetricDifferenceWith);
var tail$1 = liftMaybe(R.tail);
var take$1 = liftMaybe(R.take);
var takeLast$1 = liftMaybe(R.takeLast);
var takeLastWhile$1 = liftMaybe(R.takeLastWhile);
var takeWhile$1 = liftMaybe(R.takeWhile);
var tap$1 = liftMaybe(R.tap);
var test$1 = liftMaybe(R.test);
var times$1 = liftMaybe(R.times);
var toLower$1 = liftMaybe(R.toLower);
var toPairs$1 = liftMaybe(R.toPairs);
var toPairsIn$1 = liftMaybe(R.toPairsIn);
var toString$1 = liftMaybe(R.toString);
var toUpper$1 = liftMaybe(R.toUpper);
var transduce$1 = liftMaybe(R.transduce);
var transpose$1 = liftMaybe(R.transpose);
var traverse$1 = liftMaybe(R.traverse);
var trim$1 = liftMaybe(R.trim);
var tryCatch$1 = liftStagedMaybe(R.tryCatch);
var type$1 = liftMaybe(R.type);
var unapply$1 = liftStagedMaybe(R.unapply);
var unary$1 = liftStagedMaybe(R.unary);
var uncurryN$1 = liftStagedMaybe(R.uncurryN);
var unfold$1 = liftMaybe(R.unfold);
var union$1 = liftMaybe(R.union);
var unionWith$1 = liftMaybe(R.unionWith);
var uniq$1 = liftMaybe(R.uniq);
var uniqBy$1 = liftMaybe(R.uniqBy);
var uniqWith$1 = liftMaybe(R.uniqWith);
var unless$1 = liftMaybe(R.unless);
var unnest$1 = liftMaybe(R.unnest);
var until$1 = liftMaybe(R.until);
var update$1 = liftMaybe(R.update);
var useWith$1 = liftStagedMaybe(R.useWith);
var values$1 = lift1Maybe(R.values);
var valuesIn$1 = liftMaybe(R.valuesIn);
//export const view = liftMaybe(R.view)                          -> partial.lenses, conflict
var when$1 = liftMaybe(R.when);
var where$1 = liftStagedMaybe(stageLast1Of2Maybe(R.where));
var whereEq$1 = liftStagedMaybe(stageLast1Of2Maybe(R.whereEq));
var without$1 = liftMaybe(R.without);
var xprod$1 = liftMaybe(R.xprod);
var zip$1 = liftMaybe(R.zip);
var zipObj$1 = liftMaybe(R.zipObj);
var zipWith$1 = liftMaybe(R.zipWith);

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

var indices = infestines.pipe2U(length$1, K.lift1Shallow(R.range(0)));

var mapElems = infestines.curry(function (fn, elems) {
  return mapCached(function (i) {
    return fn(view(i, elems), i);
  }, indices(elems));
});

exports['default'] = K__default;
exports.lift = K.lift;
exports.lift1 = K.lift1;
exports.lift1Shallow = K.lift1Shallow;
exports.liftStaged = liftStaged;
exports.template = template;
exports.fromKefir = React.fromKefir;
exports.debounce = debounce;
exports.changes = changes;
exports.serially = serially;
exports.parallel = parallel;
exports.delay = delay;
exports.endWith = endWith;
exports.flatMapSerial = flatMapSerial;
exports.flatMapErrors = flatMapErrors;
exports.flatMapLatest = flatMapLatest;
exports.foldPast = foldPast;
exports.interval = interval$1;
exports.later = later$1;
exports.lazy = lazy;
exports.never = never$1;
exports.on = on;
exports.sampledBy = sampledBy;
exports.skipFirst = skipFirst;
exports.skipDuplicates = skipDuplicates;
exports.skipUnless = skipUnless;
exports.skipWhen = skipWhen;
exports.startWith = startWith;
exports.sink = sink;
exports.takeFirst = takeFirst;
exports.takeUntilBy = takeUntilBy;
exports.toProperty = toProperty;
exports.throttle = throttle;
exports.fromEvents = fromEvents$1;
exports.set = set;
exports.refTo = refTo;
exports.seq = infestines.seq;
exports.seqPartial = infestines.seqPartial;
exports.scope = scope;
exports.toPartial = toPartial;
exports.show = show;
exports.staged = staged;
exports.setProps = setProps;
exports.getProps = getProps;
exports.bindProps = bindProps;
exports.bind = bind;
exports.cns = cns;
exports.classes = classes;
exports.mapCached = mapCached;
exports.mapIndexed = mapIndexed;
exports.ifte = ifte;
exports.ift = ift;
exports.view = view;
exports.Context = Context;
exports.withContext = withContext;
exports.WithContext = WithContext;
exports.actions = actions;
exports.string = string;
exports.atom = atom;
exports.variable = variable;
exports.molecule = molecule;
exports.holding = kefir_atom.holding;
exports.F = F$1;
exports.T = T$1;
exports.__ = __$1;
exports.add = add$1;
exports.addIndex = addIndex$1;
exports.adjust = adjust$1;
exports.all = all$1;
exports.allPass = allPass$1;
exports.always = always$1;
exports.and = and$1;
exports.any = any$1;
exports.anyPass = anyPass$1;
exports.ap = ap$1;
exports.aperture = aperture$1;
exports.append = append$1;
exports.apply = apply$1;
exports.applySpec = applySpec$1;
exports.ascend = ascend$1;
exports.assoc = assoc$1;
exports.assocPath = assocPath$1;
exports.binary = binary$1;
exports.both = both$1;
exports.call = call$1;
exports.chain = chain$1;
exports.clamp = clamp$1;
exports.comparator = comparator$1;
exports.complement = complement$1;
exports.compose = compose$1;
exports.concat = concat$2;
exports.cond = cond$1;
exports.construct = construct$1;
exports.constructN = constructN$1;
exports.contains = contains$1;
exports.converge = converge$1;
exports.countBy = countBy$1;
exports.curry = curry$2;
exports.curryN = curryN$2;
exports.dec = dec$1;
exports.defaultTo = defaultTo$1;
exports.descend = descend$1;
exports.difference = difference$1;
exports.differenceWith = differenceWith$1;
exports.dissoc = dissoc$1;
exports.dissocPath = dissocPath$1;
exports.divide = divide$1;
exports.drop = drop$1;
exports.dropLast = dropLast$1;
exports.dropLastWhile = dropLastWhile$1;
exports.dropRepeats = dropRepeats$1;
exports.dropRepeatsWith = dropRepeatsWith$1;
exports.dropWhile = dropWhile$1;
exports.either = either$1;
exports.empty = empty$1;
exports.eqBy = eqBy$1;
exports.eqProps = eqProps$1;
exports.equals = equals$1;
exports.evolve = evolve$1;
exports.filter = filter$1;
exports.find = find$1;
exports.findIndex = findIndex$1;
exports.findLast = findLast$1;
exports.findLastIndex = findLastIndex$1;
exports.flatten = flatten$1;
exports.flip = flip$1;
exports.fromPairs = fromPairs$1;
exports.groupBy = groupBy$1;
exports.groupWith = groupWith$1;
exports.gt = gt$1;
exports.gte = gte$1;
exports.has = has$1;
exports.hasIn = hasIn$1;
exports.head = head$1;
exports.identical = identical$1;
exports.identity = identity$1;
exports.ifElse = ifElse$1;
exports.inc = inc$1;
exports.indexBy = indexBy$1;
exports.indexOf = indexOf$1;
exports.init = init$1;
exports.insert = insert$1;
exports.insertAll = insertAll$1;
exports.intersection = intersection$1;
exports.intersectionWith = intersectionWith$1;
exports.intersperse = intersperse$1;
exports.into = into$1;
exports.invert = invert$1;
exports.invertObj = invertObj$1;
exports.invoker = invoker$1;
exports.is = is$1;
exports.isEmpty = isEmpty$1;
exports.isNil = isNil$1;
exports.join = join$1;
exports.juxt = juxt$1;
exports.keys = keys$1;
exports.keysIn = keysIn$1;
exports.last = last$1;
exports.lastIndexOf = lastIndexOf$1;
exports.length = length$1;
exports.lt = lt$1;
exports.lte = lte$1;
exports.map = map$1;
exports.mapAccum = mapAccum$1;
exports.mapAccumRight = mapAccumRight$1;
exports.mapObjIndexed = mapObjIndexed$1;
exports.match = match$1;
exports.mathMod = mathMod$1;
exports.max = max$1;
exports.maxBy = maxBy$1;
exports.mean = mean$1;
exports.median = median$1;
exports.memoize = memoize$1;
exports.merge = merge$2;
exports.mergeAll = mergeAll$1;
exports.mergeWith = mergeWith$1;
exports.mergeWithKey = mergeWithKey$1;
exports.min = min$1;
exports.minBy = minBy$1;
exports.modulo = modulo$1;
exports.multiply = multiply$1;
exports.nAry = nAry$1;
exports.negate = negate$1;
exports.none = none$1;
exports.not = not$1;
exports.nth = nth$1;
exports.nthArg = nthArg$1;
exports.objOf = objOf$1;
exports.of = of$1;
exports.omit = omit$1;
exports.or = or$1;
exports.pair = pair$1;
exports.partial = partial$1;
exports.partialRight = partialRight$1;
exports.partition = partition$1;
exports.path = path$1;
exports.pathEq = pathEq$1;
exports.pathOr = pathOr$1;
exports.pathSatisfies = pathSatisfies$1;
exports.pick = pick$1;
exports.pickAll = pickAll$1;
exports.pickBy = pickBy$1;
exports.pipe = pipe$1;
exports.pluck = pluck$1;
exports.prepend = prepend$1;
exports.product = product$1;
exports.project = project$1;
exports.prop = prop$1;
exports.propEq = propEq$1;
exports.propIs = propIs$1;
exports.propOr = propOr$1;
exports.propSatisfies = propSatisfies$1;
exports.props = props$1;
exports.range = range$1;
exports.reduce = reduce$1;
exports.reduceBy = reduceBy$1;
exports.reduceRight = reduceRight$1;
exports.reduceWhile = reduceWhile$1;
exports.reduced = reduced$1;
exports.reject = reject$1;
exports.remove = remove$1;
exports.repeat = repeat$1;
exports.replace = replace$1;
exports.reverse = reverse$1;
exports.scan = scan$1;
exports.sequence = sequence$1;
exports.slice = slice$1;
exports.sort = sort$1;
exports.sortBy = sortBy$1;
exports.sortWith = sortWith$1;
exports.split = split$1;
exports.splitAt = splitAt$1;
exports.splitEvery = splitEvery$1;
exports.splitWhen = splitWhen$1;
exports.subtract = subtract$1;
exports.sum = sum$1;
exports.symmetricDifference = symmetricDifference$1;
exports.symmetricDifferenceWith = symmetricDifferenceWith$1;
exports.tail = tail$1;
exports.take = take$1;
exports.takeLast = takeLast$1;
exports.takeLastWhile = takeLastWhile$1;
exports.takeWhile = takeWhile$1;
exports.tap = tap$1;
exports.test = test$1;
exports.times = times$1;
exports.toLower = toLower$1;
exports.toPairs = toPairs$1;
exports.toPairsIn = toPairsIn$1;
exports.toString = toString$1;
exports.toUpper = toUpper$1;
exports.transduce = transduce$1;
exports.transpose = transpose$1;
exports.traverse = traverse$1;
exports.trim = trim$1;
exports.tryCatch = tryCatch$1;
exports.type = type$1;
exports.unapply = unapply$1;
exports.unary = unary$1;
exports.uncurryN = uncurryN$1;
exports.unfold = unfold$1;
exports.union = union$1;
exports.unionWith = unionWith$1;
exports.uniq = uniq$1;
exports.uniqBy = uniqBy$1;
exports.uniqWith = uniqWith$1;
exports.unless = unless$1;
exports.unnest = unnest$1;
exports.until = until$1;
exports.update = update$1;
exports.useWith = useWith$1;
exports.values = values$1;
exports.valuesIn = valuesIn$1;
exports.when = when$1;
exports.where = where$1;
exports.whereEq = whereEq$1;
exports.without = without$1;
exports.xprod = xprod$1;
exports.zip = zip$1;
exports.zipObj = zipObj$1;
exports.zipWith = zipWith$1;
exports.abs = abs;
exports.acos = acos;
exports.acosh = acosh;
exports.asin = asin;
exports.asinh = asinh;
exports.atan = atan;
exports.atan2 = atan2;
exports.atanh = atanh;
exports.cbrt = cbrt;
exports.ceil = ceil;
exports.clz32 = clz32;
exports.cos = cos;
exports.cosh = cosh;
exports.exp = exp;
exports.expm1 = expm1;
exports.floor = floor;
exports.fround = fround;
exports.hypot = hypot;
exports.imul = imul;
exports.log = log;
exports.log10 = log10;
exports.log1p = log1p;
exports.log2 = log2;
exports.pow = pow;
exports.round = round;
exports.sign = sign;
exports.sin = sin;
exports.sinh = sinh;
exports.sqrt = sqrt;
exports.tan = tan;
exports.tanh = tanh;
exports.trunc = trunc;
exports.indices = indices;
exports.mapElems = mapElems;
