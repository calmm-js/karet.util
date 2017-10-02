(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ramda'), require('kefir.atom'), require('kefir'), require('infestines'), require('partial.lenses'), require('kefir.combines'), require('karet'), require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['exports', 'ramda', 'kefir.atom', 'kefir', 'infestines', 'partial.lenses', 'kefir.combines', 'karet', 'react', 'prop-types'], factory) :
	(factory((global.karet = global.karet || {}, global.karet.util = {}),global.R,global.kefir.atom,global.Kefir,global.I,global.L,global.kefir.combines,global.karet,global.React,global.PropTypes));
}(this, (function (exports,R,kefir_atom,kefir,infestines,L,K,karet,react,PropTypes) { 'use strict';

var K__default = 'default' in K ? K['default'] : K;
PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

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

var debounce = /*#__PURE__*/infestines.curry(function (ms, xs) {
  return toConstant(xs).debounce(ms);
});
var changes = function changes(xs) {
  return toConstant(xs).changes();
};
var serially = function serially(xs) {
  return kefir.concat(R.map(toConstant, xs));
};
var parallel = /*#__PURE__*/kefir.merge;
var delay = /*#__PURE__*/infestines.curry(function (ms, xs) {
  return toConstant(xs).delay(ms);
});
var endWith = /*#__PURE__*/infestines.curry(function (v, xs) {
  return toConstant(xs).concat(toConstant(v));
});
var mapValue = /*#__PURE__*/infestines.curry(function (fn, xs) {
  return toConstant(xs).map(fn);
});
var flatMapParallel = /*#__PURE__*/infestines.curry(function (fn, xs) {
  return toConstant(xs).flatMap(infestines.pipe2U(fn, toConstant));
});
var flatMapSerial = /*#__PURE__*/infestines.curry(function (fn, xs) {
  return toConstant(xs).flatMapConcat(infestines.pipe2U(fn, toConstant));
});
var flatMapErrors = /*#__PURE__*/infestines.curry(function (fn, xs) {
  return toConstant(xs).flatMapErrors(infestines.pipe2U(fn, toConstant));
});
var flatMapLatest = /*#__PURE__*/infestines.curry(function (fn, xs) {
  return toConstant(xs).flatMapLatest(infestines.pipe2U(fn, toConstant));
});
var foldPast = /*#__PURE__*/infestines.curry(function (fn, s, xs) {
  return toConstant(xs).scan(fn, s);
});
var interval$1 = /*#__PURE__*/infestines.curry(kefir.interval);
var later$1 = /*#__PURE__*/infestines.curry(kefir.later);
var lazy = function lazy(th) {
  return infestines.seq(toProperty(), flatMapLatest(th), toProperty);
};
var never$1 = /*#__PURE__*/kefir.never();
var on = /*#__PURE__*/infestines.curry(function (efs, xs) {
  return toConstant(xs).onAny(toHandler(efs));
});
var sampledBy = /*#__PURE__*/infestines.curry(function (es, xs) {
  return toConstant(xs).sampledBy(es);
});
var skipFirst = /*#__PURE__*/infestines.curry(function (n, xs) {
  return toConstant(xs).skip(n);
});
var skipDuplicates = /*#__PURE__*/infestines.curry(function (equals$$1, xs) {
  return toConstant(xs).skipDuplicates(equals$$1);
});
var skipUnless = /*#__PURE__*/infestines.curry(function (p, xs) {
  return toConstant(xs).filter(p);
});
var skipWhen = /*#__PURE__*/infestines.curry(function (p, xs) {
  return toConstant(xs).filter(function (x) {
    return !p(x);
  });
});
var startWith = /*#__PURE__*/infestines.curry(function (x, xs) {
  return toConstant(xs).toProperty(function () {
    return x;
  });
});
var sink = /*#__PURE__*/infestines.pipe2U(startWith(undefined), K.lift(toUndefined));
var takeFirst = /*#__PURE__*/infestines.curry(function (n, xs) {
  return toConstant(xs).take(n);
});
var takeUntilBy = /*#__PURE__*/infestines.curry(function (ts, xs) {
  return toConstant(xs).takeUntilBy(ts);
});
var toProperty = function toProperty(xs) {
  return toConstant(xs).toProperty();
};
var throttle = /*#__PURE__*/infestines.curry(function (ms, xs) {
  return toConstant(xs).throttle(ms);
});
var fromEvents$1 = /*#__PURE__*/infestines.curry(kefir.fromEvents);

var set = /*#__PURE__*/infestines.curry(function (settable, xs) {
  var ss = K__default(xs, function (xs) {
    return settable.set(xs);
  });
  if (ss instanceof kefir.Observable) return ss.toProperty(toUndefined);
});

//

var Bus = /*#__PURE__*/infestines.inherit(function Bus() {
  kefir.Stream.call(this);
}, kefir.Stream, {
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

var flatJoin = /*#__PURE__*/K.lift1(L.join(" ", [L.flatten, L.when(infestines.id)]));

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

var mapCachedMap = /*#__PURE__*/K.lift1Shallow(function (x) {
  return x[1];
});

var mapCached = /*#__PURE__*/infestines.curryN(2, function (fromId) {
  return infestines.pipe2U(foldPast(mapCachedStep(fromId), mapCachedInit), mapCachedMap);
});

//

var mapIndexed = /*#__PURE__*/infestines.curryN(2, function (xi2y) {
  return K.lift1(function (xs) {
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

var ifte = /*#__PURE__*/infestines.curry(ifteU);
var ift = /*#__PURE__*/infestines.arityN(2, ifteU);

function iftes(_c, _t) {
  var n = arguments.length;
  var r = n & 1 ? arguments[--n] : undefined;
  while (0 <= (n -= 2)) {
    r = ifteU(arguments[n], arguments[n + 1], r);
  }return r;
}

//

var view = /*#__PURE__*/infestines.curry(function (l, xs) {
  return xs instanceof kefir_atom.AbstractMutable ? l instanceof kefir.Observable ? new kefir_atom.Join(K__default(l, function (l) {
    return xs.view(l);
  })) : xs.view(l) : K__default(l, xs, L.get);
});

//

var types = { context: PropTypes.any };

var Context = /*#__PURE__*/infestines.inherit(function Context(props$$1) {
  Context.childContextTypes = types;
  react.Component.call(this, props$$1);
}, react.Component, {
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

  return K__default.apply(undefined, fns.concat([actionsImmediate]));
};

//

var string = function string(strings) {
  for (var _len5 = arguments.length, values$$1 = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    values$$1[_key5 - 1] = arguments[_key5];
  }

  return K__default.apply(undefined, values$$1.concat([function () {
    for (var _len6 = arguments.length, values$$1 = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      values$$1[_key6] = arguments[_key6];
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

var liftMaybe = /*#__PURE__*/maybe(K.lift);
var liftStagedMaybe = /*#__PURE__*/maybe(liftStaged);
var lift1Maybe = /*#__PURE__*/maybe(K.lift1);
var lift1ShallowMaybe = /*#__PURE__*/maybe( /*#__PURE__*/K.lift1Shallow);

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

var F$1 = /*#__PURE__*/R.F;
var T$1 = /*#__PURE__*/R.T;
var __$1 = /*#__PURE__*/R.__;
var add$1 = /*#__PURE__*/liftMaybe(R.add);
var addIndex$1 = /*#__PURE__*/liftStagedMaybe(R.addIndex);
var adjust$1 = /*#__PURE__*/liftMaybe(R.adjust);
var all$1 = /*#__PURE__*/liftMaybe(R.all);
var allPass$1 = /*#__PURE__*/liftStagedMaybe(R.allPass);
var always$1 = /*#__PURE__*/R.always; // lifting won't really work
var and$1 = /*#__PURE__*/liftMaybe(R.and);
var any$1 = /*#__PURE__*/liftMaybe(R.any);
var anyPass$1 = /*#__PURE__*/liftStagedMaybe(R.anyPass);
var ap$1 = /*#__PURE__*/liftMaybe(R.ap);
var aperture$1 = /*#__PURE__*/liftMaybe(R.aperture);
var append$1 = /*#__PURE__*/liftMaybe(R.append);
var apply$1 = /*#__PURE__*/liftMaybe(R.apply);
var applySpec$1 = /*#__PURE__*/liftMaybe(R.applySpec);
var ascend$1 = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(R.ascend));
var assoc$1 = /*#__PURE__*/liftMaybe(R.assoc);
var assocPath$1 = /*#__PURE__*/liftMaybe(R.assocPath);
var binary$1 = /*#__PURE__*/liftStagedMaybe(R.binary);
var both$1 = /*#__PURE__*/liftStagedMaybe(R.both);
var call$1 = /*#__PURE__*/liftStagedMaybe(R.call);
var chain$1 = /*#__PURE__*/liftMaybe(R.chain);
var clamp$1 = /*#__PURE__*/liftMaybe(R.clamp);
var comparator$1 = /*#__PURE__*/liftStagedMaybe(R.comparator);
var complement$1 = /*#__PURE__*/liftStagedMaybe(R.complement);
var compose$1 = /*#__PURE__*/liftStagedMaybe(R.compose);
var concat$2 = /*#__PURE__*/liftMaybe(R.concat);
var cond$1 = /*#__PURE__*/liftStagedMaybe(R.cond);
var construct$1 = /*#__PURE__*/liftStagedMaybe(R.construct);
var constructN$1 = /*#__PURE__*/liftStagedMaybe(R.constructN);
var contains$1 = /*#__PURE__*/liftMaybe(R.contains);
var converge$1 = /*#__PURE__*/liftStagedMaybe(R.converge);
var countBy$1 = /*#__PURE__*/liftMaybe(R.countBy);
var curry$2 = /*#__PURE__*/liftStagedMaybe(R.curry);
var curryN$2 = /*#__PURE__*/liftStagedMaybe(R.curryN);
var dec$1 = /*#__PURE__*/liftMaybe(R.dec);
var defaultTo$1 = /*#__PURE__*/liftMaybe(R.defaultTo);
var descend$1 = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(R.descend));
var difference$1 = /*#__PURE__*/liftMaybe(R.difference);
var differenceWith$1 = /*#__PURE__*/liftMaybe(R.differenceWith);
var dissoc$1 = /*#__PURE__*/liftMaybe(R.dissoc);
var dissocPath$1 = /*#__PURE__*/liftMaybe(R.dissocPath);
var divide$1 = /*#__PURE__*/liftMaybe(R.divide);
var drop$1 = /*#__PURE__*/liftMaybe(R.drop);
var dropLast$1 = /*#__PURE__*/liftMaybe(R.dropLast);
var dropLastWhile$1 = /*#__PURE__*/liftMaybe(R.dropLastWhile);
var dropRepeats$1 = /*#__PURE__*/liftMaybe(R.dropRepeats);
var dropRepeatsWith$1 = /*#__PURE__*/liftMaybe(R.dropRepeatsWith);
var dropWhile$1 = /*#__PURE__*/liftMaybe(R.dropWhile);
var either$1 = /*#__PURE__*/liftStagedMaybe(R.either);
var empty$1 = /*#__PURE__*/liftMaybe(R.empty);
var endsWith$1 = /*#__PURE__*/liftMaybe(R.endsWith);
var eqBy$1 = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(R.eqBy));
var eqProps$1 = /*#__PURE__*/liftMaybe(stageLast2Of3Maybe(R.eqProps));
var equals$1 = /*#__PURE__*/liftMaybe(R.equals);
var evolve$1 = /*#__PURE__*/liftMaybe(R.evolve);
var filter$1 = /*#__PURE__*/liftMaybe(R.filter);
var find$1 = /*#__PURE__*/liftMaybe(R.find);
var findIndex$1 = /*#__PURE__*/liftMaybe(R.findIndex);
var findLast$1 = /*#__PURE__*/liftMaybe(R.findLast);
var findLastIndex$1 = /*#__PURE__*/liftMaybe(R.findLastIndex);
var flatten$2 = /*#__PURE__*/liftMaybe(R.flatten);
var flip$1 = /*#__PURE__*/liftStagedMaybe(R.flip);
var fromPairs$1 = /*#__PURE__*/liftMaybe(R.fromPairs);
var groupBy$1 = /*#__PURE__*/liftMaybe(R.groupBy);
var groupWith$1 = /*#__PURE__*/liftMaybe(R.groupWith);
var gt$1 = /*#__PURE__*/liftMaybe(R.gt);
var gte$1 = /*#__PURE__*/liftMaybe(R.gte);
var has$1 = /*#__PURE__*/liftMaybe(R.has);
var hasIn$1 = /*#__PURE__*/liftMaybe(R.hasIn);
var head$1 = /*#__PURE__*/liftMaybe(R.head);
var identical$1 = /*#__PURE__*/liftMaybe(R.identical);
var identity$1 = /*#__PURE__*/R.identity; // lifting won't really work
var ifElse$1 = /*#__PURE__*/liftStagedMaybe(R.ifElse);
var inc$1 = /*#__PURE__*/liftMaybe(R.inc);
var indexBy$1 = /*#__PURE__*/liftMaybe(R.indexBy);
var indexOf$1 = /*#__PURE__*/liftMaybe(R.indexOf);
var init$1 = /*#__PURE__*/liftMaybe(R.init);
var innerJoin$1 = /*#__PURE__*/liftMaybe(R.innerJoin);
var insert$1 = /*#__PURE__*/liftMaybe(R.insert);
var insertAll$1 = /*#__PURE__*/liftMaybe(R.insertAll);
var intersection$1 = /*#__PURE__*/liftMaybe(R.intersection);
var intersperse$1 = /*#__PURE__*/liftMaybe(R.intersperse);
var into$1 = /*#__PURE__*/liftMaybe(R.into);
var invert$1 = /*#__PURE__*/liftMaybe(R.invert);
var invertObj$1 = /*#__PURE__*/liftMaybe(R.invertObj);
var invoker$1 = /*#__PURE__*/liftStagedMaybe(R.invoker);
var is$1 = /*#__PURE__*/liftMaybe(stageLast1Of2Maybe(R.is));
var isEmpty$1 = /*#__PURE__*/liftMaybe(R.isEmpty);
var isNil$1 = /*#__PURE__*/liftMaybe(R.isNil);
var join$2 = /*#__PURE__*/liftMaybe(R.join);
var juxt$1 = /*#__PURE__*/liftStagedMaybe(R.juxt);
var keys$1 = /*#__PURE__*/lift1ShallowMaybe(R.keys);
var keysIn$1 = /*#__PURE__*/liftMaybe(R.keysIn);
var last$1 = /*#__PURE__*/liftMaybe(R.last);
var lastIndexOf$1 = /*#__PURE__*/liftMaybe(R.lastIndexOf);
var length$1 = /*#__PURE__*/lift1ShallowMaybe(R.length);
var lt$1 = /*#__PURE__*/liftMaybe(R.lt);
var lte$1 = /*#__PURE__*/liftMaybe(R.lte);
var map$1 = /*#__PURE__*/liftMaybe(R.map);
var mapAccum$1 = /*#__PURE__*/liftMaybe(R.mapAccum);
var mapAccumRight$1 = /*#__PURE__*/liftMaybe(R.mapAccumRight);
var mapObjIndexed$1 = /*#__PURE__*/liftMaybe(R.mapObjIndexed);
var match$1 = /*#__PURE__*/liftMaybe(R.match);
var mathMod$1 = /*#__PURE__*/liftMaybe(R.mathMod);
var max$1 = /*#__PURE__*/liftMaybe(R.max);
var maxBy$1 = /*#__PURE__*/liftMaybe(R.maxBy);
var mean$1 = /*#__PURE__*/liftMaybe(R.mean);
var median$1 = /*#__PURE__*/liftMaybe(R.median);
var memoize$1 = /*#__PURE__*/liftStagedMaybe(R.memoize);
var memoizeWith$1 = /*#__PURE__*/liftStagedMaybe(R.memoizeWith);
var merge$2 = /*#__PURE__*/liftMaybe(R.merge);
var mergeAll$1 = /*#__PURE__*/liftMaybe(R.mergeAll);
var mergeDeepLeft$1 = /*#__PURE__*/liftMaybe(R.mergeDeepLeft);
var mergeDeepRight$1 = /*#__PURE__*/liftMaybe(R.mergeDeepRight);
var mergeDeepWith$1 = /*#__PURE__*/liftMaybe(R.mergeDeepWith);
var mergeDeepWithKey$1 = /*#__PURE__*/liftMaybe(R.mergeDeepWithKey);
var mergeWith$1 = /*#__PURE__*/liftMaybe(R.mergeWith);
var mergeWithKey$1 = /*#__PURE__*/liftMaybe(R.mergeWithKey);
var min$1 = /*#__PURE__*/liftMaybe(R.min);
var minBy$1 = /*#__PURE__*/liftMaybe(R.minBy);
var modulo$1 = /*#__PURE__*/liftMaybe(R.modulo);
var multiply$1 = /*#__PURE__*/liftMaybe(R.multiply);
var nAry$1 = /*#__PURE__*/liftStagedMaybe(R.nAry);
var negate$1 = /*#__PURE__*/liftMaybe(R.negate);
var none$1 = /*#__PURE__*/liftMaybe(R.none);
var not$1 = /*#__PURE__*/liftMaybe(R.not);
var nth$1 = /*#__PURE__*/liftMaybe(R.nth);
var nthArg$1 = /*#__PURE__*/liftStagedMaybe(R.nthArg);
var o$1 = /*#__PURE__*/liftMaybe(R.o);
var objOf$1 = /*#__PURE__*/liftMaybe(R.objOf);
var of$1 = /*#__PURE__*/liftMaybe(R.of);
var omit$1 = /*#__PURE__*/liftMaybe(R.omit);
var or$1 = /*#__PURE__*/liftMaybe(R.or);
var pair$1 = /*#__PURE__*/liftMaybe(R.pair);
var partial$1 = /*#__PURE__*/liftStagedMaybe(R.partial);
var partialRight$1 = /*#__PURE__*/liftStagedMaybe(R.partialRight);
var partition$1 = /*#__PURE__*/liftMaybe(R.partition);
var path$1 = /*#__PURE__*/liftMaybe(R.path);
var pathEq$1 = /*#__PURE__*/liftMaybe(R.pathEq);
var pathOr$1 = /*#__PURE__*/liftMaybe(R.pathOr);
var pathSatisfies$1 = /*#__PURE__*/liftMaybe(R.pathSatisfies);
var pick$1 = /*#__PURE__*/liftMaybe(R.pick);
var pickAll$1 = /*#__PURE__*/liftMaybe(R.pickAll);
var pickBy$1 = /*#__PURE__*/liftMaybe(R.pickBy);
var pipe$1 = /*#__PURE__*/liftStagedMaybe(R.pipe);
var pluck$1 = /*#__PURE__*/liftMaybe(R.pluck);
var prepend$1 = /*#__PURE__*/liftMaybe(R.prepend);
var product$1 = /*#__PURE__*/liftMaybe(R.product);
var project$1 = /*#__PURE__*/liftMaybe(R.project);
var prop$1 = /*#__PURE__*/liftMaybe(R.prop);
var propEq$1 = /*#__PURE__*/liftMaybe(R.propEq);
var propIs$1 = /*#__PURE__*/liftMaybe(R.propIs);
var propOr$1 = /*#__PURE__*/liftMaybe(R.propOr);
var propSatisfies$1 = /*#__PURE__*/liftMaybe(R.propSatisfies);
var props$1 = /*#__PURE__*/liftMaybe(R.props);
var range$1 = /*#__PURE__*/liftMaybe(R.range);
var reduce$1 = /*#__PURE__*/liftMaybe(R.reduce);
var reduceBy$1 = /*#__PURE__*/liftMaybe(R.reduceBy);
var reduceRight$1 = /*#__PURE__*/liftMaybe(R.reduceRight);
var reduceWhile$1 = /*#__PURE__*/liftMaybe(R.reduceWhile);
var reduced$1 = /*#__PURE__*/liftMaybe(R.reduced);
var reject$1 = /*#__PURE__*/liftMaybe(R.reject);
var remove$1 = /*#__PURE__*/liftMaybe(R.remove);
var repeat$1 = /*#__PURE__*/liftMaybe(R.repeat);
var replace$1 = /*#__PURE__*/liftMaybe(R.replace);
var reverse$1 = /*#__PURE__*/liftMaybe(R.reverse);
var scan$1 = /*#__PURE__*/liftMaybe(R.scan);
var sequence$1 = /*#__PURE__*/liftMaybe(R.sequence);
var slice$1 = /*#__PURE__*/liftMaybe(R.slice);
var sort$1 = /*#__PURE__*/liftMaybe(R.sort);
var sortBy$1 = /*#__PURE__*/liftMaybe(R.sortBy);
var sortWith$1 = /*#__PURE__*/liftMaybe(R.sortWith);
var split$1 = /*#__PURE__*/liftMaybe(R.split);
var splitAt$1 = /*#__PURE__*/liftMaybe(R.splitAt);
var splitEvery$1 = /*#__PURE__*/liftMaybe(R.splitEvery);
var splitWhen$1 = /*#__PURE__*/liftMaybe(R.splitWhen);
var startsWith$1 = /*#__PURE__*/liftMaybe(R.startsWith);
var subtract$1 = /*#__PURE__*/liftMaybe(R.subtract);
var sum$1 = /*#__PURE__*/liftMaybe(R.sum);
var symmetricDifference$1 = /*#__PURE__*/liftMaybe(R.symmetricDifference);
var symmetricDifferenceWith$1 = /*#__PURE__*/liftMaybe(R.symmetricDifferenceWith);
var tail$1 = /*#__PURE__*/liftMaybe(R.tail);
var take$1 = /*#__PURE__*/liftMaybe(R.take);
var takeLast$1 = /*#__PURE__*/liftMaybe(R.takeLast);
var takeLastWhile$1 = /*#__PURE__*/liftMaybe(R.takeLastWhile);
var takeWhile$1 = /*#__PURE__*/liftMaybe(R.takeWhile);
var tap$1 = /*#__PURE__*/liftMaybe(R.tap);
var test$1 = /*#__PURE__*/liftMaybe(R.test);
var times$1 = /*#__PURE__*/liftMaybe(R.times);
var toLower$1 = /*#__PURE__*/liftMaybe(R.toLower);
var toPairs$1 = /*#__PURE__*/liftMaybe(R.toPairs);
var toPairsIn$1 = /*#__PURE__*/liftMaybe(R.toPairsIn);
var toString$1 = /*#__PURE__*/liftMaybe(R.toString);
var toUpper$1 = /*#__PURE__*/liftMaybe(R.toUpper);
var transduce$1 = /*#__PURE__*/liftMaybe(R.transduce);
var transpose$1 = /*#__PURE__*/liftMaybe(R.transpose);
var traverse$1 = /*#__PURE__*/liftMaybe(R.traverse);
var trim$1 = /*#__PURE__*/liftMaybe(R.trim);
var tryCatch$1 = /*#__PURE__*/liftStagedMaybe(R.tryCatch);
var type$1 = /*#__PURE__*/liftMaybe(R.type);
var unapply$1 = /*#__PURE__*/liftStagedMaybe(R.unapply);
var unary$1 = /*#__PURE__*/liftStagedMaybe(R.unary);
var uncurryN$1 = /*#__PURE__*/liftStagedMaybe(R.uncurryN);
var unfold$1 = /*#__PURE__*/liftMaybe(R.unfold);
var union$1 = /*#__PURE__*/liftMaybe(R.union);
var unionWith$1 = /*#__PURE__*/liftMaybe(R.unionWith);
var uniq$1 = /*#__PURE__*/liftMaybe(R.uniq);
var uniqBy$1 = /*#__PURE__*/liftMaybe(R.uniqBy);
var uniqWith$1 = /*#__PURE__*/liftMaybe(R.uniqWith);
var unless$1 = /*#__PURE__*/liftMaybe(R.unless);
var unnest$1 = /*#__PURE__*/liftMaybe(R.unnest);
var until$1 = /*#__PURE__*/liftMaybe(R.until);
var update$1 = /*#__PURE__*/liftMaybe(R.update);
var useWith$1 = /*#__PURE__*/liftStagedMaybe(R.useWith);
var values$1 = /*#__PURE__*/lift1Maybe(R.values);
var valuesIn$1 = /*#__PURE__*/liftMaybe(R.valuesIn);
var when$2 = /*#__PURE__*/liftMaybe(R.when);
var where$1 = /*#__PURE__*/liftStagedMaybe(stageLast1Of2Maybe(R.where));
var whereEq$1 = /*#__PURE__*/liftStagedMaybe(stageLast1Of2Maybe(R.whereEq));
var without$1 = /*#__PURE__*/liftMaybe(R.without);
var xprod$1 = /*#__PURE__*/liftMaybe(R.xprod);
var zip$1 = /*#__PURE__*/liftMaybe(R.zip);
var zipObj$1 = /*#__PURE__*/liftMaybe(R.zipObj);
var zipWith$1 = /*#__PURE__*/liftMaybe(R.zipWith);

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

var indices = /*#__PURE__*/infestines.pipe2U(length$1, K.lift1Shallow(R.range(0)));

//

var mapElems = /*#__PURE__*/infestines.curry(function (xi2y, xs) {
  return infestines.seq(xs, foldPast(function (ysIn, xsIn) {
    var xsN = xsIn.length;
    var ysN = ysIn.length;
    if (xsN === ysN) return ysIn;
    var ys = Array(xsN);
    for (var i = 0; i < xsN; ++i) {
      ys[i] = i < ysN ? ysIn[i] : xi2y(view(i, xs), i);
    }return ys;
  }, []), skipDuplicates(infestines.identicalU));
});

//

var mapElemsWithIds = /*#__PURE__*/infestines.curry(function (idL, xi2y, xs) {
  var id2info = new Map();
  var idOf = L.get(idL);
  var find$$1 = L.findHint(function (x, info) {
    return idOf(x) === info.id;
  });
  return infestines.seq(xs, foldPast(function (ysIn, xsIn) {
    var n = xsIn.length;
    var ys = ysIn.length === n ? ysIn : Array(n);
    for (var i = 0; i < n; ++i) {
      var _id2 = idOf(xsIn[i]);
      var info = id2info.get(_id2);
      if (void 0 === info) {
        id2info.set(_id2, info = {});
        info.id = _id2;
        info.hint = i;
        info.elem = xi2y(view(find$$1(info), xs), _id2);
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
  }, []), skipDuplicates(infestines.identicalU));
});

exports['default'] = K__default;
exports.lift = K.lift;
exports.lift1 = K.lift1;
exports.lift1Shallow = K.lift1Shallow;
exports.liftStaged = liftStaged;
exports.template = template;
exports.fromKefir = karet.fromKefir;
exports.debounce = debounce;
exports.changes = changes;
exports.serially = serially;
exports.parallel = parallel;
exports.delay = delay;
exports.endWith = endWith;
exports.mapValue = mapValue;
exports.flatMapParallel = flatMapParallel;
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
exports.Bus = Bus;
exports.bus = bus;
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
exports.iftes = iftes;
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
exports.endsWith = endsWith$1;
exports.eqBy = eqBy$1;
exports.eqProps = eqProps$1;
exports.equals = equals$1;
exports.evolve = evolve$1;
exports.filter = filter$1;
exports.find = find$1;
exports.findIndex = findIndex$1;
exports.findLast = findLast$1;
exports.findLastIndex = findLastIndex$1;
exports.flatten = flatten$2;
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
exports.innerJoin = innerJoin$1;
exports.insert = insert$1;
exports.insertAll = insertAll$1;
exports.intersection = intersection$1;
exports.intersperse = intersperse$1;
exports.into = into$1;
exports.invert = invert$1;
exports.invertObj = invertObj$1;
exports.invoker = invoker$1;
exports.is = is$1;
exports.isEmpty = isEmpty$1;
exports.isNil = isNil$1;
exports.join = join$2;
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
exports.memoizeWith = memoizeWith$1;
exports.merge = merge$2;
exports.mergeAll = mergeAll$1;
exports.mergeDeepLeft = mergeDeepLeft$1;
exports.mergeDeepRight = mergeDeepRight$1;
exports.mergeDeepWith = mergeDeepWith$1;
exports.mergeDeepWithKey = mergeDeepWithKey$1;
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
exports.o = o$1;
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
exports.startsWith = startsWith$1;
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
exports.when = when$2;
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
exports.mapElemsWithIds = mapElemsWithIds;

Object.defineProperty(exports, '__esModule', { value: true });

})));
