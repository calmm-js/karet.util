import { Atom, Molecule, AbstractMutable, Join } from 'kefir.atom';
export { holding } from 'kefir.atom';
import { Observable, constant, concat, merge, interval, later, never, fromEvents, Stream, stream } from 'kefir';
import { curry, pipe2U, seq, identicalU, arityN, inherit, id, isDefined, always, isFunction } from 'infestines';
export { seq, seqPartial } from 'infestines';
import { iso, join, flatten, when, get, find } from 'partial.lenses';
import { lift1, combines, liftRec } from 'kefir.combines';
export { combines, liftRec } from 'kefir.combines';
import { Component } from 'react';
import PropTypes from 'prop-types';

// Kefir ///////////////////////////////////////////////////////////////////////

var isObservable = function isObservable(x) {
  return x instanceof Observable;
};

var toUndefined = function toUndefined(_) {};
var toConstant = function toConstant(x) {
  return isObservable(x) ? x : constant(x);
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

var debounce = /*#__PURE__*/curry(function (ms, xs) {
  return toConstant(xs).debounce(ms);
});
var changes = function changes(xs) {
  return toConstant(xs).changes();
};
var serially = function serially(xs) {
  return concat(xs.map(toConstant));
};
var parallel = merge;
var delay = /*#__PURE__*/curry(function (ms, xs) {
  return toConstant(xs).delay(ms);
});
var endWith = /*#__PURE__*/curry(function (v, xs) {
  return toConstant(xs).concat(toConstant(v));
});
var mapValue = /*#__PURE__*/curry(function (fn, xs) {
  return toConstant(xs).map(fn);
});
var flatMapParallel = /*#__PURE__*/curry(function (fn, xs) {
  return toConstant(xs).flatMap(pipe2U(fn, toConstant));
});
var flatMapSerial = /*#__PURE__*/curry(function (fn, xs) {
  return toConstant(xs).flatMapConcat(pipe2U(fn, toConstant));
});
var flatMapErrors = /*#__PURE__*/curry(function (fn, xs) {
  return toConstant(xs).flatMapErrors(pipe2U(fn, toConstant));
});
var flatMapLatest = /*#__PURE__*/curry(function (fn, xs) {
  return toConstant(xs).flatMapLatest(pipe2U(fn, toConstant));
});
var foldPast = /*#__PURE__*/curry(function (fn, s, xs) {
  return toConstant(xs).scan(fn, s);
});
var interval$1 = /*#__PURE__*/curry(interval);
var later$1 = /*#__PURE__*/curry(later);
var lazy = function lazy(th) {
  return seq(toProperty(), flatMapLatest(th), toProperty);
};
var never$1 = /*#__PURE__*/never();
var on = /*#__PURE__*/curry(function (efs, xs) {
  return toConstant(xs).onAny(toHandler(efs));
});
var sampledBy = /*#__PURE__*/curry(function (es, xs) {
  return toConstant(xs).sampledBy(es);
});
var skipFirst = /*#__PURE__*/curry(function (n, xs) {
  return toConstant(xs).skip(n);
});
var skipDuplicates = /*#__PURE__*/curry(function (equals, xs) {
  return toConstant(xs).skipDuplicates(equals);
});
var skipIdenticals = /*#__PURE__*/skipDuplicates(identicalU);
var skipUnless = /*#__PURE__*/curry(function (p, xs) {
  return toConstant(xs).filter(p);
});
var skipWhen = /*#__PURE__*/curry(function (p, xs) {
  return toConstant(xs).filter(function (x) {
    return !p(x);
  });
});
var startWith = /*#__PURE__*/curry(function (x, xs) {
  return toConstant(xs).toProperty(function () {
    return x;
  });
});
var sink = /*#__PURE__*/pipe2U( /*#__PURE__*/startWith(undefined), /*#__PURE__*/lift1(toUndefined));
var takeFirst = /*#__PURE__*/curry(function (n, xs) {
  return toConstant(xs).take(n);
});
var takeFirstErrors = /*#__PURE__*/curry(function (n, xs) {
  return toConstant(xs).takeErrors(n);
});
var takeUntilBy = /*#__PURE__*/curry(function (ts, xs) {
  return toConstant(xs).takeUntilBy(ts);
});
var toProperty = function toProperty(xs) {
  return toConstant(xs).toProperty();
};
var throttle = /*#__PURE__*/curry(function (ms, xs) {
  return toConstant(xs).throttle(ms);
});
var fromEvents$1 = /*#__PURE__*/curry(fromEvents);
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

var ifElse = /*#__PURE__*/curry(ifteU);
var unless = /*#__PURE__*/curry(function (b, e) {
  return ifteU(b, undefined, e);
});
var when$1 = /*#__PURE__*/arityN(2, ifteU);

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

var streamPrototype = Stream.prototype;

var Bus = /*#__PURE__*/inherit(function Bus() {
  Stream.call(this);
}, Stream, {
  push: streamPrototype._emitValue,
  error: streamPrototype._emitError,
  end: streamPrototype._emitEnd
});

var bus = function bus() {
  return new Bus();
};

var scope = function scope(fn) {
  return fn();
};

var template = function template(observables) {
  return combines(observables, id);
};

var tapPartial = /*#__PURE__*/liftRec( /*#__PURE__*/curry(function (effect, data) {
  if (undefined !== data) effect(data);
  return data;
}));

var toPartial = function toPartial(fn) {
  return liftRec(arityN(fn.length, function () {
    for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
      xs[_key] = arguments[_key];
    }

    return xs.every(isDefined) ? fn.apply(undefined, xs) : undefined;
  }));
};

function thruImmediate(x, fs) {
  for (var i = 0, n = fs.length; i < n; ++i) {
    x = fs[i](x);
  }return x;
}

function thru(x) {
  var n = arguments.length;
  var fs = undefined;
  for (var i = 1; i < n; ++i) {
    var f = arguments[i];
    if (fs) {
      fs.push(f);
    } else if (isObservable(f)) {
      fs = [f];
    } else {
      x = f(x);
    }
  }
  return fs ? toProperty(flatMapLatest(function (fs) {
    return thruImmediate(x, fs);
  }, template(fs))) : x;
}

// Debugging ///////////////////////////////////////////////////////////////////

var showIso = function showIso() {
  for (var _len2 = arguments.length, xs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    xs[_key2] = arguments[_key2];
  }

  return iso(function (x) {
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
  return view(combines.apply(null, xs), arguments[n]);
}

// React ///////////////////////////////////////////////////////////////////////

var onUnmount = function onUnmount(effect) {
  return stream(always(effect)).toProperty(always(undefined));
};

// Context ---------------------------------------------------------------------

var types = { context: PropTypes.any };

var Context = /*#__PURE__*/inherit(function Context(props) {
  Component.call(this, props);
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
  var fn = function fn(props, _ref2) {
    var context = _ref2.context;
    return originalFn(props, context);
  };
  fn.contextTypes = types;
  return fn;
}

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

var actions = /*#__PURE__*/liftRec(function () {
  for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    fns[_key3] = arguments[_key3];
  }

  return function () {
    for (var i = 0, n = fns.length; i < n; ++i) {
      if (isFunction(fns[i])) fns[i].apply(fns, arguments);
    }
  };
});

// classNames ------------------------------------------------------------------

var cnsImmediate = /*#__PURE__*/join(' ', [flatten, /*#__PURE__*/when(id)]);

var cns = /*#__PURE__*/liftRec(function () {
  for (var _len4 = arguments.length, xs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    xs[_key4] = arguments[_key4];
  }

  return cnsImmediate(xs) || undefined;
});

// Standard ////////////////////////////////////////////////////////////////////

// JSON ------------------------------------------------------------------------

var parse = /*#__PURE__*/liftRec(JSON.parse);
var stringify = /*#__PURE__*/liftRec(JSON.stringify);

// Math ------------------------------------------------------------------------

var abs = /*#__PURE__*/liftRec(Math.abs);
var acos = /*#__PURE__*/liftRec(Math.acos);
var acosh = /*#__PURE__*/liftRec(Math.acosh);
var asin = /*#__PURE__*/liftRec(Math.asin);
var asinh = /*#__PURE__*/liftRec(Math.asinh);
var atan = /*#__PURE__*/liftRec(Math.atan);
var atan2 = /*#__PURE__*/liftRec(Math.atan2);
var atanh = /*#__PURE__*/liftRec(Math.atanh);
var cbrt = /*#__PURE__*/liftRec(Math.cbrt);
var ceil = /*#__PURE__*/liftRec(Math.ceil);
var clz32 = /*#__PURE__*/liftRec(Math.clz32);
var cos = /*#__PURE__*/liftRec(Math.cos);
var cosh = /*#__PURE__*/liftRec(Math.cosh);
var exp = /*#__PURE__*/liftRec(Math.exp);
var expm1 = /*#__PURE__*/liftRec(Math.expm1);
var floor = /*#__PURE__*/liftRec(Math.floor);
var fround = /*#__PURE__*/liftRec(Math.fround);
var hypot = /*#__PURE__*/liftRec(Math.hypot);
var imul = /*#__PURE__*/liftRec(Math.imul);
var log = /*#__PURE__*/liftRec(Math.log);
var log10 = /*#__PURE__*/liftRec(Math.log10);
var log1p = /*#__PURE__*/liftRec(Math.log1p);
var log2 = /*#__PURE__*/liftRec(Math.log2);
var max = /*#__PURE__*/liftRec(Math.max);
var min = /*#__PURE__*/liftRec(Math.min);
var pow = /*#__PURE__*/liftRec(Math.pow);
var round = /*#__PURE__*/liftRec(Math.round);
var sign = /*#__PURE__*/liftRec(Math.sign);
var sin = /*#__PURE__*/liftRec(Math.sin);
var sinh = /*#__PURE__*/liftRec(Math.sinh);
var sqrt = /*#__PURE__*/liftRec(Math.sqrt);
var tan = /*#__PURE__*/liftRec(Math.tan);
var tanh = /*#__PURE__*/liftRec(Math.tanh);
var trunc = /*#__PURE__*/liftRec(Math.trunc);

// String ----------------------------------------------------------------------

var string = /*#__PURE__*/liftRec(String.raw);

// Atoms ///////////////////////////////////////////////////////////////////////

// Creating --------------------------------------------------------------------

var atom = function atom(value) {
  return new Atom(value);
};
var variable = function variable() {
  return new Atom();
};
var molecule = function molecule(template) {
  return new Molecule(template);
};

// Side-effects ----------------------------------------------------------------

var set = /*#__PURE__*/curry(function (settable, xs) {
  var ss = combines(xs, function (xs) {
    return settable.set(xs);
  });
  if (isObservable(ss)) return ss.toProperty(toUndefined);
});

// Decomposing -----------------------------------------------------------------

var view = /*#__PURE__*/curry(function (l, xs) {
  if (xs instanceof AbstractMutable) {
    return isObservable(template(l)) ? new Join(combines(l, function (l) {
      return xs.view(l);
    })) : xs.view(l);
  } else {
    return combines(l, xs, get);
  }
});

var mapElems = /*#__PURE__*/curry(function (xi2y, xs) {
  var vs = [];
  return seq(xs, foldPast(function (ysIn, xsIn) {
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

var mapElemsWithIds = /*#__PURE__*/curry(function (idL, xi2y, xs) {
  var id2info = new Map();
  var idOf = get(idL);
  var pred = function pred(x, _, info) {
    return idOf(x) === info.id;
  };
  return seq(xs, foldPast(function (ysIn, xsIn) {
    var n = xsIn.length;
    var ys = ysIn.length === n ? ysIn : Array(n);
    for (var i = 0; i < n; ++i) {
      var id$$1 = idOf(xsIn[i]);
      var info = id2info.get(id$$1);
      if (void 0 === info) {
        id2info.set(id$$1, info = {});
        info.id = id$$1;
        info.hint = i;
        info.elem = xi2y(info.view = view(find(pred, info), xs), id$$1);
      }
      if (ys[i] !== info.elem) {
        info.hint = i;
        if (ys === ysIn) ys = ys.slice(0);
        ys[i] = info.elem;
      }
    }
    if (ys !== ysIn) {
      id2info.forEach(function (info, id$$1) {
        if (ys[info.hint] !== info.elem) {
          info.view._onDeactivation();
          id2info.delete(id$$1);
        }
      });
    }
    return ys;
  }, []), skipIdenticals);
});

export { debounce, changes, serially, parallel, delay, endWith, mapValue, flatMapParallel, flatMapSerial, flatMapErrors, flatMapLatest, foldPast, interval$1 as interval, later$1 as later, lazy, never$1 as never, on, sampledBy, skipFirst, skipDuplicates, skipIdenticals, skipUnless, skipWhen, startWith, sink, takeFirst, takeFirstErrors, takeUntilBy, toProperty, throttle, fromEvents$1 as fromEvents, ignoreValues, ignoreErrors, ifElse, unless, when$1 as when, cond, Bus, bus, scope, template, tapPartial, toPartial, thru, show, onUnmount, Context, withContext, getProps, setProps, refTo, actions, cns, parse, stringify, abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow, round, sign, sin, sinh, sqrt, tan, tanh, trunc, string, atom, variable, molecule, set, view, mapElems, mapElemsWithIds };
