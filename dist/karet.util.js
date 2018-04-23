(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('kefir.atom'), require('kefir'), require('infestines'), require('partial.lenses'), require('kefir.combines'), require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'kefir.atom', 'kefir', 'infestines', 'partial.lenses', 'kefir.combines', 'react'], factory) :
  (factory((global.karet = global.karet || {}, global.karet.util = {}),global.kefir.atom,global.Kefir,global.I,global.L,global.kefir.combines,global.React));
}(this, (function (exports,A,K,I,L,C,React) { 'use strict';

  var header = 'karet.util: ';

  function warn(f, m) {
    if (!f.warned) {
      f.warned = 1;
      console.warn(header + m);
    }
  }

  // Kefir ///////////////////////////////////////////////////////////////////////

  var isMutable = function isMutable(x) {
    return x instanceof A.AbstractMutable;
  };
  var isProperty = function isProperty(x) {
    return x instanceof K.Property;
  };
  var isObservable = function isObservable(x) {
    return x instanceof K.Observable;
  };

  var toUndefined = function toUndefined(_) {};
  var toConstant = function toConstant(x) {
    return isObservable(x) ? x : K.constant(x);
  };

  var invokeIf = function invokeIf(fn, x) {
    return fn && fn(x);
  };
  var toHandler = function toHandler(fns) {
    return function (_ref) {
      var type = _ref.type,
          value = _ref.value;
      return invokeIf(fns[type], value);
    };
  };

  // Curried ---------------------------------------------------------------------

  var debounce = /*#__PURE__*/I.curry(function (ms, xs) {
    return toConstant(xs).debounce(ms);
  });
  var changes = function changes(xs) {
    return toConstant(xs).changes();
  };
  var serially = function serially(xs) {
    return K.concat(xs.map(toConstant));
  };
  var parallel = K.merge;
  var delay = /*#__PURE__*/I.curry(function (ms, xs) {
    return toConstant(xs).delay(ms);
  });
  var endWith = /*#__PURE__*/I.curry(function (v, xs) {
    return toConstant(xs).concat(toConstant(v));
  });
  var mapValue = /*#__PURE__*/I.curry(function (fn, xs) {
    return toConstant(xs).map(fn);
  });
  var flatMapParallel = /*#__PURE__*/I.curry(function (fn, xs) {
    return toConstant(xs).flatMap(I.pipe2U(fn, toConstant));
  });
  var flatMapSerial = /*#__PURE__*/I.curry(function (fn, xs) {
    return toConstant(xs).flatMapConcat(I.pipe2U(fn, toConstant));
  });
  var flatMapErrors = /*#__PURE__*/I.curry(function (fn, xs) {
    return toConstant(xs).flatMapErrors(I.pipe2U(fn, toConstant));
  });
  var flatMapLatest = /*#__PURE__*/I.curry(function (fn, xs) {
    return toConstant(xs).flatMapLatest(I.pipe2U(fn, toConstant));
  });
  var foldPast = /*#__PURE__*/I.curry(function (fn, s, xs) {
    return toConstant(xs).scan(fn, s);
  });
  var interval = /*#__PURE__*/I.curry(K.interval);
  var later = /*#__PURE__*/I.curry(K.later);
  var lazy = function lazy(th) {
    return toProperty(flatMapLatest(th, toProperty()));
  };
  var never = /*#__PURE__*/K.never();
  var on = /*#__PURE__*/I.curry(function (efs, xs) {
    return toConstant(xs).onAny(toHandler(efs));
  });
  var sampledBy = /*#__PURE__*/I.curry(function (es, xs) {
    return toConstant(xs).sampledBy(es);
  });
  var skipFirst = /*#__PURE__*/I.curry(function (n, xs) {
    return toConstant(xs).skip(n);
  });
  var skipDuplicates = /*#__PURE__*/I.curry(function (equals, xs) {
    return toConstant(xs).skipDuplicates(equals);
  });
  var skipIdenticals = /*#__PURE__*/skipDuplicates(I.identicalU);
  var skipUnless = /*#__PURE__*/I.curry(function (p, xs) {
    return toConstant(xs).filter(p);
  });
  var skipWhen = /*#__PURE__*/I.curry(function (p, xs) {
    return toConstant(xs).filter(function (x) {
      return !p(x);
    });
  });
  var startWith = /*#__PURE__*/I.curry(function (x, xs) {
    return toConstant(xs).toProperty(function () {
      return x;
    });
  });
  var sink = /*#__PURE__*/I.pipe2U( /*#__PURE__*/startWith(undefined), /*#__PURE__*/C.lift1(toUndefined));
  var takeFirst = /*#__PURE__*/I.curry(function (n, xs) {
    return toConstant(xs).take(n);
  });
  var takeFirstErrors = /*#__PURE__*/I.curry(function (n, xs) {
    return toConstant(xs).takeErrors(n);
  });
  var takeUntilBy = /*#__PURE__*/I.curry(function (ts, xs) {
    return toConstant(xs).takeUntilBy(ts);
  });
  var toProperty = function toProperty(xs) {
    return toConstant(xs).toProperty();
  };
  var throttle = /*#__PURE__*/I.curry(function (ms, xs) {
    return toConstant(xs).throttle(ms);
  });
  var fromEvents = /*#__PURE__*/I.curry(K.fromEvents);
  var ignoreValues = function ignoreValues(s) {
    return s.ignoreValues();
  };
  var ignoreErrors = function ignoreErrors(s) {
    return s.ignoreErrors();
  };

  // Conditionals ----------------------------------------------------------------

  var ifteU = function ifteU(b, t, e) {
    return toProperty(flatMapLatest(function (b) {
      return b ? t : e;
    }, b));
  };

  var ifElse = /*#__PURE__*/I.curry(ifteU);
  var unless = /*#__PURE__*/I.curry(function (b, e) {
    return ifteU(b, undefined, e);
  });
  var when = /*#__PURE__*/I.arityN(2, ifteU);

  function cond(_) {
    var n = arguments.length;
    var op = undefined;
    while (n--) {
      var c = arguments[n];
      op = c.length !== 1 ? ifteU(c[0], c[1], op) : c[0];
    }
    return op;
  }

  // Bus -------------------------------------------------------------------------

  var streamPrototype = K.Stream.prototype;

  var Bus = /*#__PURE__*/I.inherit(function Bus() {
    K.Stream.call(this);
  }, K.Stream, {
    push: streamPrototype._emitValue,
    error: streamPrototype._emitError,
    end: streamPrototype._emitEnd
  });

  var bus = function bus() {
    return new Bus();
  };

  // Convenience /////////////////////////////////////////////////////////////////

  var seq = function (_) {
    warn(seq, '`seq` has been obsoleted.  Use `thru` instead.');
    return I.seq.apply(null, arguments);
  };

  var seqPartial = function (_) {
    warn(seqPartial, '`seqPartial` has been deprecated.  There is no replacement for it.');
    return I.seqPartial.apply(null, arguments);
  };

  var scope = function scope(fn) {
    return fn();
  };

  var template = function template(observables) {
    return C.combines(observables, I.id);
  };

  var tapPartial = /*#__PURE__*/C.liftRec( /*#__PURE__*/I.curry(function (effect, data) {
    if (undefined !== data) effect(data);
    return data;
  }));

  var toPartial = function toPartial(fn) {
    return C.liftRec(I.arityN(fn.length, function () {
      for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
        xs[_key] = arguments[_key];
      }

      return xs.every(I.isDefined) ? fn.apply(undefined, xs) : undefined;
    }));
  };

  function thruPlain(x, fs) {
    for (var i = 0, n = fs.length; i < n; ++i) {
      x = fs[i](x);
    }return x;
  }

  var thruProperty = function thruProperty(x, fs) {
    return toProperty(flatMapLatest(function (fs) {
      return thruPlain(x, fs);
    }, fs));
  };

  function thru(x) {
    var n = arguments.length;
    var fs = undefined;
    for (var i = 1; i < n; ++i) {
      var f = arguments[i];
      if (fs) {
        fs.push(f);
      } else if (isProperty(f)) {
        fs = [f];
      } else {
        x = f(x);
      }
    }
    if (fs) {
      return thruProperty(x, template(fs));
    } else {
      return x;
    }
  }

  function through() {
    var n = arguments.length;
    var fs = Array(n);
    var plain = true;
    for (var i = 0; i < n; ++i) {
      var f = fs[i] = arguments[i];
      if (plain) plain = !isProperty(f);
    }
    if (plain) {
      return function (x) {
        return thruPlain(x, fs);
      };
    } else {
      fs = template(fs);
      return function (x) {
        return thruProperty(x, fs);
      };
    }
  }

  // Debugging ///////////////////////////////////////////////////////////////////

  var showIso = function showIso() {
    for (var _len2 = arguments.length, xs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      xs[_key2] = arguments[_key2];
    }

    return L.iso(function (x) {
      return console.log.apply(console, xs.concat([x])) || x;
    }, function (y) {
      return console.log.apply(console, xs.concat([y, '(set)'])) || y;
    });
  };

  function show(_) {
    var n = arguments.length - 1;
    var xs = Array(n + 1);
    for (var i = 0; i < n; ++i) {
      xs[i] = arguments[i];
    }xs[n] = showIso;
    return view(C.combines.apply(null, xs), arguments[n]);
  }

  // React ///////////////////////////////////////////////////////////////////////

  var onUnmount = function onUnmount(effect) {
    return K.stream(I.always(effect)).toProperty(I.always(undefined));
  };

  // Context ---------------------------------------------------------------------

  var _React$createContext = /*#__PURE__*/React.createContext(I.object0),
      Provider = _React$createContext.Provider,
      Consumer = _React$createContext.Consumer;

  var Context = /*#__PURE__*/(function (fn) {
    return function (props) {
      warn(Context, '`Context` has been obsoleted.  Just use the new React context API.');
      return fn(props);
    };
  })(function (_ref2) {
    var context = _ref2.context,
        children = _ref2.children;
    return React.createElement(
      Provider,
      { value: context },
      children
    );
  });

  var withContext = /*#__PURE__*/(function (fn) {
    return function (props) {
      warn(withContext, '`withContext` has been obsoleted.  Just use the new React context API.');
      return fn(props);
    };
  })(function (toElem) {
    return function (props) {
      return React.createElement(
        Consumer,
        null,
        function (context) {
          return toElem(props, context);
        }
      );
    };
  });

  // DOM Binding -----------------------------------------------------------------

  var getProps = function getProps(template) {
    return function (_ref3) {
      var target = _ref3.target;

      for (var k in template) {
        template[k].set(target[k]);
      }
    };
  };

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
            case 'value':
              {
                var _observables = ev.value;
                for (var k in _observables) {
                  e[k] = _observables[k];
                }break;
              }
            case 'error':
              throw ev.value;
            case 'end':
              observable = _callback = null;
              break;
          }
        };
        observable = template(observables);
        observable.onAny(_callback);
      }
    };
  }

  // Refs ------------------------------------------------------------------------

  var refTo = function refTo(settable) {
    return function (elem) {
      if (null !== elem) settable.set(elem);
    };
  };

  // Events ----------------------------------------------------------------------

  var actions = /*#__PURE__*/C.liftRec(function () {
    for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      fns[_key3] = arguments[_key3];
    }

    return function () {
      for (var i = 0, n = fns.length; i < n; ++i) {
        if (I.isFunction(fns[i])) fns[i].apply(fns, arguments);
      }
    };
  });

  var invoke = function invoke(name) {
    return function (e) {
      return e[name]();
    };
  };

  var preventDefault = /*#__PURE__*/invoke('preventDefault');
  var stopPropagation = /*#__PURE__*/invoke('stopPropagation');

  // classNames ------------------------------------------------------------------

  var cnsImmediate = /*#__PURE__*/L.join(' ', [L.flatten, /*#__PURE__*/L.when(I.id)]);

  var cns = /*#__PURE__*/C.liftRec(function () {
    for (var _len4 = arguments.length, xs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      xs[_key4] = arguments[_key4];
    }

    return cnsImmediate(xs) || undefined;
  });

  // Standard ////////////////////////////////////////////////////////////////////

  // JSON ------------------------------------------------------------------------

  var parse = /*#__PURE__*/C.liftRec(JSON.parse);
  var stringify = /*#__PURE__*/C.liftRec(JSON.stringify);

  // Math ------------------------------------------------------------------------

  var abs = /*#__PURE__*/C.liftRec(Math.abs);
  var acos = /*#__PURE__*/C.liftRec(Math.acos);
  var acosh = /*#__PURE__*/C.liftRec(Math.acosh);
  var asin = /*#__PURE__*/C.liftRec(Math.asin);
  var asinh = /*#__PURE__*/C.liftRec(Math.asinh);
  var atan = /*#__PURE__*/C.liftRec(Math.atan);
  var atan2 = /*#__PURE__*/C.liftRec(Math.atan2);
  var atanh = /*#__PURE__*/C.liftRec(Math.atanh);
  var cbrt = /*#__PURE__*/C.liftRec(Math.cbrt);
  var ceil = /*#__PURE__*/C.liftRec(Math.ceil);
  var clz32 = /*#__PURE__*/C.liftRec(Math.clz32);
  var cos = /*#__PURE__*/C.liftRec(Math.cos);
  var cosh = /*#__PURE__*/C.liftRec(Math.cosh);
  var exp = /*#__PURE__*/C.liftRec(Math.exp);
  var expm1 = /*#__PURE__*/C.liftRec(Math.expm1);
  var floor = /*#__PURE__*/C.liftRec(Math.floor);
  var fround = /*#__PURE__*/C.liftRec(Math.fround);
  var hypot = /*#__PURE__*/C.liftRec(Math.hypot);
  var imul = /*#__PURE__*/C.liftRec(Math.imul);
  var log = /*#__PURE__*/C.liftRec(Math.log);
  var log10 = /*#__PURE__*/C.liftRec(Math.log10);
  var log1p = /*#__PURE__*/C.liftRec(Math.log1p);
  var log2 = /*#__PURE__*/C.liftRec(Math.log2);
  var max = /*#__PURE__*/C.liftRec(Math.max);
  var min = /*#__PURE__*/C.liftRec(Math.min);
  var pow = /*#__PURE__*/C.liftRec(Math.pow);
  var round = /*#__PURE__*/C.liftRec(Math.round);
  var sign = /*#__PURE__*/C.liftRec(Math.sign);
  var sin = /*#__PURE__*/C.liftRec(Math.sin);
  var sinh = /*#__PURE__*/C.liftRec(Math.sinh);
  var sqrt = /*#__PURE__*/C.liftRec(Math.sqrt);
  var tan = /*#__PURE__*/C.liftRec(Math.tan);
  var tanh = /*#__PURE__*/C.liftRec(Math.tanh);
  var trunc = /*#__PURE__*/C.liftRec(Math.trunc);

  // String ----------------------------------------------------------------------

  var string = /*#__PURE__*/C.liftRec(String.raw);

  // Atoms ///////////////////////////////////////////////////////////////////////

  // Creating --------------------------------------------------------------------

  var atom = function atom(value) {
    return new A.Atom(value);
  };
  var variable = function variable() {
    return new A.Atom();
  };
  var molecule = function molecule(template) {
    return new A.Molecule(template);
  };

  // Side-effects ----------------------------------------------------------------

  var set = /*#__PURE__*/I.curry(function (settable, xs) {
    var ss = C.combines(xs, function (xs) {
      return settable.set(xs);
    });
    if (isProperty(ss)) return ss.toProperty(toUndefined);
  });

  // Decomposing -----------------------------------------------------------------

  var view = /*#__PURE__*/I.curry(function (l, xs) {
    if (isMutable(xs)) {
      return isProperty(template(l)) ? new A.Join(C.combines(l, function (l) {
        return xs.view(l);
      })) : xs.view(l);
    } else {
      return C.combines(l, xs, L.get);
    }
  });

  var mapElems = /*#__PURE__*/I.curry(function (xi2y, xs) {
    var vs = [];
    return thru(xs, foldPast(function (ysIn, xsIn) {
      var ysN = ysIn.length;
      var xsN = xsIn.length;
      if (xsN === ysN) return ysIn;
      var m = Math.min(ysN, xsN);
      var ys = ysIn.slice(0, m);
      for (var i = xsN; i < ysN; ++i) {
        vs[i]._onDeactivation();
      }for (var _i = m; _i < xsN; ++_i) {
        ys[_i] = xi2y(vs[_i] = view(_i, xs), _i);
      }vs.length = xsN;
      return ys;
    }, []), skipIdenticals);
  });

  var mapElemsWithIds = /*#__PURE__*/I.curry(function (idL, xi2y, xs) {
    var id2info = new Map();
    var idOf = L.get(idL);
    var pred = function pred(x, _, info) {
      return idOf(x) === info.id;
    };
    return thru(xs, foldPast(function (ysIn, xsIn) {
      var n = xsIn.length;
      var ys = ysIn.length === n ? ysIn : Array(n);
      for (var i = 0; i < n; ++i) {
        var id = idOf(xsIn[i]);
        var info = id2info.get(id);
        if (void 0 === info) {
          id2info.set(id, info = {});
          info.id = id;
          info.hint = i;
          info.elem = xi2y(info.view = view(L.find(pred, info), xs), id);
        }
        if (ys[i] !== info.elem) {
          info.hint = i;
          if (ys === ysIn) ys = ys.slice(0);
          ys[i] = info.elem;
        }
      }
      if (ys !== ysIn) {
        id2info.forEach(function (info, id) {
          if (ys[info.hint] !== info.elem) {
            info.view._onDeactivation();
            id2info.delete(id);
          }
        });
      }
      return ys;
    }, []), skipIdenticals);
  });

  exports.holding = A.holding;
  exports.combines = C.combines;
  exports.liftRec = C.liftRec;
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
  exports.interval = interval;
  exports.later = later;
  exports.lazy = lazy;
  exports.never = never;
  exports.on = on;
  exports.sampledBy = sampledBy;
  exports.skipFirst = skipFirst;
  exports.skipDuplicates = skipDuplicates;
  exports.skipIdenticals = skipIdenticals;
  exports.skipUnless = skipUnless;
  exports.skipWhen = skipWhen;
  exports.startWith = startWith;
  exports.sink = sink;
  exports.takeFirst = takeFirst;
  exports.takeFirstErrors = takeFirstErrors;
  exports.takeUntilBy = takeUntilBy;
  exports.toProperty = toProperty;
  exports.throttle = throttle;
  exports.fromEvents = fromEvents;
  exports.ignoreValues = ignoreValues;
  exports.ignoreErrors = ignoreErrors;
  exports.ifElse = ifElse;
  exports.unless = unless;
  exports.when = when;
  exports.cond = cond;
  exports.Bus = Bus;
  exports.bus = bus;
  exports.seq = seq;
  exports.seqPartial = seqPartial;
  exports.scope = scope;
  exports.template = template;
  exports.tapPartial = tapPartial;
  exports.toPartial = toPartial;
  exports.thru = thru;
  exports.through = through;
  exports.show = show;
  exports.onUnmount = onUnmount;
  exports.Context = Context;
  exports.withContext = withContext;
  exports.getProps = getProps;
  exports.setProps = setProps;
  exports.refTo = refTo;
  exports.actions = actions;
  exports.preventDefault = preventDefault;
  exports.stopPropagation = stopPropagation;
  exports.cns = cns;
  exports.parse = parse;
  exports.stringify = stringify;
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
  exports.max = max;
  exports.min = min;
  exports.pow = pow;
  exports.round = round;
  exports.sign = sign;
  exports.sin = sin;
  exports.sinh = sinh;
  exports.sqrt = sqrt;
  exports.tan = tan;
  exports.tanh = tanh;
  exports.trunc = trunc;
  exports.string = string;
  exports.atom = atom;
  exports.variable = variable;
  exports.molecule = molecule;
  exports.set = set;
  exports.view = view;
  exports.mapElems = mapElems;
  exports.mapElemsWithIds = mapElemsWithIds;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
