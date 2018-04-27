import { AbstractMutable, Atom, Molecule, Join } from 'kefir.atom';
export { holding } from 'kefir.atom';
import { Property, Observable, constant, concat, merge, interval, later, never, fromEvents, Stream, stream } from 'kefir';
import { arityN, curry, pipe2U, identicalU, inherit, seq, seqPartial, id, isDefined, always, object0, isFunction } from 'infestines';
import { iso, join, flatten, when, get, find } from 'partial.lenses';
import { combines, lift1, liftRec } from 'kefir.combines';
export { combines, liftRec } from 'kefir.combines';
import { createContext, createElement } from 'react';

var header = 'karet.util: ';

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1;
    console.warn(header + m);
  }
}

// Actions /////////////////////////////////////////////////////////////////////

var doN = function doN(n, method) {
  return arityN(n + 1, function (target) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return combines(params, function (params) {
      return function () {
        return target[method].apply(target, params);
      };
    });
  });
};

// Kefir ///////////////////////////////////////////////////////////////////////

var isMutable = function isMutable(x) {
  return x instanceof AbstractMutable;
};
var isProperty = function isProperty(x) {
  return x instanceof Property;
};
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
  return toProperty(flatMapLatest(th, toProperty()));
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

// Promises --------------------------------------------------------------------

var FromPromise = /*#__PURE__*/inherit(function FromPromise(makePromise) {
  Property.call(this);
  this.m = makePromise;
  this.a = undefined;
}, Property, {
  _onActivation: function _onActivation() {
    var self = this;
    var m = self.m;
    if (m) {
      self.m = null;
      var handle = m();
      var abort = handle.abort;

      var ready = handle.ready || handle;
      self.a = abort;
      ready.then(function (result) {
        var a = self.a;
        if (a !== null) {
          self.a = null;
          self._emitValue(result);
          self._emitEnd();
        }
      }, function (error) {
        var a = self.a;
        if (a !== null) {
          self.a = null;
          self._emitError(error);
          self._emitEnd();
        }
      });
    }
  },
  _onDeactivation: function _onDeactivation() {
    var self = this;
    var a = self.a;
    if (a) {
      self.a = null;
      self._emitEnd();
      a();
    }
  }
});

var fromPromise = function fromPromise(makePromise) {
  return new FromPromise(makePromise);
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

// Actions on buses ------------------------------------------------------------

var doPush = /*#__PURE__*/doN(1, 'push');
var doError = /*#__PURE__*/doN(1, 'error');
var doEnd = /*#__PURE__*/doN(0, 'end');

// Convenience /////////////////////////////////////////////////////////////////

var seq$1 = process.env.NODE_ENV === 'production' ? seq : function (_) {
  warn(seq$1, '`seq` has been obsoleted.  Use `thru` instead.');
  return seq.apply(null, arguments);
};

var seqPartial$1 = process.env.NODE_ENV === 'production' ? seqPartial : function (_) {
  warn(seqPartial$1, '`seqPartial` has been deprecated.  There is no replacement for it.');
  return seqPartial.apply(null, arguments);
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
    for (var _len2 = arguments.length, xs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      xs[_key2] = arguments[_key2];
    }

    return xs.every(isDefined) ? fn.apply(undefined, xs) : undefined;
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
  for (var _len3 = arguments.length, xs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    xs[_key3] = arguments[_key3];
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

var _React$createContext = /*#__PURE__*/createContext(object0),
    Provider = _React$createContext.Provider,
    Consumer = _React$createContext.Consumer;

var Context = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn) {
  return function (props) {
    warn(Context, '`Context` has been obsoleted.  Just use the new React context API.');
    return fn(props);
  };
})(function (_ref2) {
  var context = _ref2.context,
      children = _ref2.children;
  return createElement(
    Provider,
    { value: context },
    children
  );
});

var withContext = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn) {
  return function (props) {
    warn(withContext, '`withContext` has been obsoleted.  Just use the new React context API.');
    return fn(props);
  };
})(function (toElem) {
  return function (props) {
    return createElement(
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

var actions = /*#__PURE__*/liftRec(function () {
  for (var _len4 = arguments.length, fns = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    fns[_key4] = arguments[_key4];
  }

  return function () {
    for (var i = 0, n = fns.length; i < n; ++i) {
      if (isFunction(fns[i])) fns[i].apply(fns, arguments);
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

var cnsImmediate = /*#__PURE__*/join(' ', [flatten, /*#__PURE__*/when(id)]);

var cns = /*#__PURE__*/liftRec(function () {
  for (var _len5 = arguments.length, xs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    xs[_key5] = arguments[_key5];
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
  if (isProperty(ss)) return ss.toProperty(toUndefined);
});

// Actions on atoms ------------------------------------------------------------

var doModify = /*#__PURE__*/doN(1, 'modify');
var doSet = /*#__PURE__*/doN(1, 'set');
var doRemove = /*#__PURE__*/doN(0, 'remove');

// Decomposing -----------------------------------------------------------------

var view = /*#__PURE__*/curry(function (l, xs) {
  if (isMutable(xs)) {
    return isProperty(template(l)) ? new Join(combines(l, function (l) {
      return xs.view(l);
    })) : xs.view(l);
  } else {
    return combines(l, xs, get);
  }
});

var mapElems = /*#__PURE__*/curry(function (xi2y, xs) {
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

var mapElemsWithIds = /*#__PURE__*/curry(function (idL, xi2y, xs) {
  var id2info = new Map();
  var idOf = get(idL);
  var pred = function pred(x, _, info) {
    return idOf(x) === info.id;
  };
  return thru(xs, foldPast(function (ysIn, xsIn) {
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

export { debounce, changes, serially, parallel, delay, endWith, mapValue, flatMapParallel, flatMapSerial, flatMapErrors, flatMapLatest, foldPast, interval$1 as interval, later$1 as later, lazy, never$1 as never, on, sampledBy, skipFirst, skipDuplicates, skipIdenticals, skipUnless, skipWhen, startWith, sink, takeFirst, takeFirstErrors, takeUntilBy, toProperty, throttle, fromEvents$1 as fromEvents, ignoreValues, ignoreErrors, fromPromise, ifElse, unless, when$1 as when, cond, Bus, bus, doPush, doError, doEnd, seq$1 as seq, seqPartial$1 as seqPartial, scope, template, tapPartial, toPartial, thru, through, show, onUnmount, Context, withContext, getProps, setProps, refTo, actions, preventDefault, stopPropagation, cns, parse, stringify, abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow, round, sign, sin, sinh, sqrt, tan, tanh, trunc, string, atom, variable, molecule, set, doModify, doSet, doRemove, view, mapElems, mapElemsWithIds };
