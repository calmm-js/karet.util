import { AbstractMutable, Atom, Molecule, Join } from 'kefir.atom';
export { holding } from 'kefir.atom';
import { Observable, Property, Stream, constant, concat, merge, interval, later, never, fromEvents, combine, stream } from 'kefir';
import { defineNameU, arityN, curry, pipe2U, identicalU, id, inherit, always, seq, seqPartial, isDefined, object0, isFunction, assign } from 'infestines';
import { iso, get, set, collect, flatten, when, join, remove, find } from 'partial.lenses';
import { combine as combine$1, lift, liftRec } from 'karet.lift';
export { combine, lift, liftRec } from 'karet.lift';
import { createElement } from 'karet';
export { fromClass as toKaret } from 'karet';
import { createContext, createElement as createElement$1, forwardRef, PureComponent } from 'react';
import { combines } from 'kefir.combines';

var header = 'karet.util: ';

function warn(f, m) {
  if (!f.warned) {
    f.warned = 1;
    console.warn(header + m);
  }
}

////////////////////////////////////////////////////////////////////////////////

var setName = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : function (to, name) {
  return defineNameU(to, name);
};

// Actions /////////////////////////////////////////////////////////////////////

var doN = function doN(n, method, name) {
  return arityN(n + 1, setName(function (target) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return combine$1(params, function () {
      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      return setName(function () {
        return target[method].apply(target, params);
      }, name);
    });
  }, name));
};

// Kefir ///////////////////////////////////////////////////////////////////////

var isMutable = function isMutable(x) {
  return x instanceof AbstractMutable;
};
var isObservable = function isObservable(x) {
  return x instanceof Observable;
};
var isProperty = function isProperty(x) {
  return x instanceof Property;
};
var isStream = function isStream(x) {
  return x instanceof Stream;
};

var toUndefined = function toUndefined(_) {};
var toObservable = function toObservable(x) {
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

var debounce = /*#__PURE__*/curry(function debounce(ms, xs) {
  return toObservable(xs).debounce(ms);
});
var changes = function changes(xs) {
  return toObservable(xs).changes();
};
var serially = function serially(xs) {
  return concat(xs.map(toObservable));
};
var parallel = merge;
var delay = /*#__PURE__*/curry(function delay(ms, xs) {
  return toObservable(xs).delay(ms);
});
var mapValue = /*#__PURE__*/curry(function mapValue(fn, xs) {
  return toObservable(xs).map(fn);
});
var flatMapParallel = /*#__PURE__*/curry(function flatMapParallel(fn, xs) {
  return toObservable(xs).flatMap(pipe2U(fn, toObservable));
});
var flatMapSerial = /*#__PURE__*/curry(function flatMapSerial(fn, xs) {
  return toObservable(xs).flatMapConcat(pipe2U(fn, toObservable));
});
var flatMapErrors = /*#__PURE__*/curry(function flatMapErrors(fn, xs) {
  return toObservable(xs).flatMapErrors(pipe2U(fn, toObservable));
});
var flatMapLatest = /*#__PURE__*/curry(function flatMapLatest(fn, xs) {
  return toObservable(xs).flatMapLatest(pipe2U(fn, toObservable));
});
var foldPast = /*#__PURE__*/curry(function foldPast(fn, s, xs) {
  return toObservable(xs).scan(fn, s);
});
var interval$1 = /*#__PURE__*/curry(interval);
var later$1 = /*#__PURE__*/curry(later);
var never$1 = /*#__PURE__*/never();
var on = /*#__PURE__*/curry(function on(efs, xs) {
  return toObservable(xs).onAny(toHandler(efs));
});
var sampledBy = /*#__PURE__*/curry(function sampledBy(es, xs) {
  return toObservable(xs).sampledBy(es);
});
var skipFirst = /*#__PURE__*/curry(function skipFirst(n, xs) {
  return toObservable(xs).skip(n);
});
var skipDuplicates = /*#__PURE__*/curry(function skipDuplicates(equals, xs) {
  return toObservable(xs).skipDuplicates(equals);
});
var skipUnless = /*#__PURE__*/curry(function skipUnless(p, xs) {
  return toObservable(xs).filter(p);
});
var takeFirst = /*#__PURE__*/curry(function takeFirst(n, xs) {
  return toObservable(xs).take(n);
});
var takeFirstErrors = /*#__PURE__*/curry(function takeFirstErrors(n, xs) {
  return toObservable(xs).takeErrors(n);
});
var takeUntilBy = /*#__PURE__*/curry(function takeUntilBy(ts, xs) {
  return toObservable(xs).takeUntilBy(ts);
});
var toProperty = function toProperty(xs) {
  return isProperty(xs) ? xs : isStream(xs) ? xs.toProperty() : constant(xs);
};
var throttle = /*#__PURE__*/curry(function throttle(ms, xs) {
  return toObservable(xs).throttle(ms);
});
var fromEvents$1 = /*#__PURE__*/curry(fromEvents);
var ignoreValues = function ignoreValues(s) {
  return s.ignoreValues();
};
var ignoreErrors = function ignoreErrors(s) {
  return s.ignoreErrors();
};

// Additional ------------------------------------------------------------------

var startWith = /*#__PURE__*/curry(function startWith(x, xs) {
  return toObservable(xs).toProperty(function () {
    return x;
  });
});
var sink = /*#__PURE__*/pipe2U( /*#__PURE__*/startWith(undefined), /*#__PURE__*/lift(toUndefined));

var consume = /*#__PURE__*/pipe2U(mapValue, sink);
var endWith = /*#__PURE__*/curry(function endWith(v, xs) {
  return toObservable(xs).concat(toObservable(v));
});
var lazy = function lazy(th) {
  return toProperty(flatMapLatest(th, toProperty()));
};
var skipIdenticals = /*#__PURE__*/skipDuplicates(identicalU);
var skipWhen = /*#__PURE__*/curry(function skipWhen(p, xs) {
  return toObservable(xs).filter(function (x) {
    return !p(x);
  });
});
var template = function template(observables) {
  return combine$1([observables], id);
};

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

var not = /*#__PURE__*/lift(function not(x) {
  return !x;
});

var mkBop = function mkBop(zero, bop) {
  return function () {
    var n = arguments.length;
    var op = n ? arguments[--n] : zero;
    while (n--) {
      op = bop(arguments[n], op);
    }
    return op;
  };
};

var and = /*#__PURE__*/setName( /*#__PURE__*/mkBop(true, function and(l, r) {
  return toProperty(flatMapLatest(function (l) {
    return l && r;
  }, l));
}), 'andAlso');

var or = /*#__PURE__*/setName( /*#__PURE__*/mkBop(false, function or(l, r) {
  return toProperty(flatMapLatest(function (l) {
    return l || r;
  }, l));
}), 'orElse');

var ifteU = function ifElse(b, t, e) {
  return toProperty(flatMapLatest(function (b) {
    return b ? t : e;
  }, b));
};

var ifElse = /*#__PURE__*/curry(ifteU);
var unless = /*#__PURE__*/curry(function unless(b, e) {
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

// Animation -------------------------------------------------------------------

var Ticks = /*#__PURE__*/inherit(function Ticks(duration) {
  var self = this;
  Property.call(self);
  self.d = duration;
  self.s = self.i = 0;
}, Property, {
  _onActivation: function _onActivation() {
    var self = this;
    var step = function step(t) {
      if (!self.s) self.s = t;
      var n = (t - self.s) / self.d;
      if (1 < n) n = 1;
      self._emitValue(n);
      if (n < 1) {
        self.i = requestAnimationFrame(step);
      } else {
        self._emitEnd();
      }
    };
    self.i = requestAnimationFrame(step);
  },
  _onDeactivation: function _onDeactivation() {
    cancelAnimationFrame(this.i);
  }
});

var animationSpan = process.env.NODE_ENV === 'production' ? typeof window === 'undefined' ? /*#__PURE__*/always(never$1) : function (d) {
  return new Ticks(d);
} : function animationSpan(d) {
  return typeof window === 'undefined' ? never$1 : new Ticks(d);
};

var combines$1 = process.env.NODE_ENV === 'production' ? combines : function combines$$1() {
  warn(combines$$1, '`combines` has been obsoleted.  Please use `combine`, `template`, `lift`, or `liftRec` instead.');
  return combines.apply(null, arguments);
};

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

var doPush = /*#__PURE__*/doN(1, 'push', 'doPush');
var doError = /*#__PURE__*/doN(1, 'error', 'doError');
var doEnd = /*#__PURE__*/doN(0, 'end', 'doEnd');

// Convenience /////////////////////////////////////////////////////////////////

var seq$1 = process.env.NODE_ENV === 'production' ? seq : function seq$$1(_) {
  warn(seq$$1, '`seq` has been obsoleted.  Use `thru` instead.');
  return seq.apply(null, arguments);
};

var seqPartial$1 = process.env.NODE_ENV === 'production' ? seqPartial : function seqPartial$$1(_) {
  warn(seqPartial$$1, '`seqPartial` has been deprecated.  There is no replacement for it.');
  return seqPartial.apply(null, arguments);
};

var scope = function scope(fn) {
  return fn();
};

var tapPartial = /*#__PURE__*/lift( /*#__PURE__*/curry(function tapPartial(effect, data) {
  if (undefined !== data) effect(data);
  return data;
}));

var toPartial = function toPartial(fn) {
  return liftRec(arityN(fn.length, function toPartial() {
    for (var _len3 = arguments.length, xs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      xs[_key3] = arguments[_key3];
    }

    return xs.every(isDefined) ? fn.apply(undefined, xs) : undefined;
  }));
};

var thruPlain = function thru(x, fs) {
  for (var i = 0, n = fs.length; i < n; ++i) {
    x = fs[i](x);
  }return x;
};

var thruProperty = function thru(x, fs) {
  return toProperty(flatMapLatest(function thru(fs) {
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
    return function through(x) {
      return thruPlain(x, fs);
    };
  } else {
    fs = template(fs);
    return function through(x) {
      return thruProperty(x, fs);
    };
  }
}

// Debugging ///////////////////////////////////////////////////////////////////

var showIso = function showIso() {
  for (var _len4 = arguments.length, xs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    xs[_key4] = arguments[_key4];
  }

  return iso(function (x) {
    return console.log.apply(console, xs.concat([x])) || x;
  }, function (y) {
    return console.log.apply(console, xs.concat([y, '(set)'])) || y;
  });
};

function show(_) {
  var n = arguments.length - 1;
  var xs = Array(n);
  for (var i = 0; i < n; ++i) {
    xs[i] = arguments[i];
  }var iso$$1 = combine$1(xs, showIso);
  var s = arguments[n];
  return isStream(s) ? isProperty(iso$$1) ? combine([iso$$1, s], get) : mapValue(get(iso$$1), s) : view(iso$$1, s);
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
  return function Context(props) {
    warn(Context, '`Context` has been obsoleted.  Just use the new React context API.');
    return fn(props);
  };
})(function Context(_ref2) {
  var context = _ref2.context,
      children = _ref2.children;

  return createElement$1(
    Provider,
    { value: context },
    children
  );
});

var withContext = /*#__PURE__*/(process.env.NODE_ENV === 'production' ? id : function (fn) {
  return function withContext(props) {
    warn(withContext, '`withContext` has been obsoleted.  Just use the new React context API.');
    return fn(props);
  };
})(function withContext(toElem) {
  return function (props) {
    return createElement$1(
      Consumer,
      null,
      function (context) {
        return toElem(props, context);
      }
    );
  };
});

// DOM Binding -----------------------------------------------------------------

var getProp = function getProp(name, object) {
  return function getProp(_ref3) {
    var target = _ref3.target;

    var value = target[name];
    if (isFunction(object.push)) {
      object.push(value);
    } else {
      object.set(value);
    }
  };
};

function getProps(template) {
  var result = void 0;
  for (var k in template) {
    if (result) return function getProps(e) {
      for (var _k in template) {
        getProp(_k, template[_k])(e);
      }
    };
    result = getProp(k, template[k]);
  }
  return result;
}

function setProps(observables) {
  var observable = void 0;
  var callback = void 0;
  return function setProps(e) {
    if (callback) {
      observable.offAny(callback);
      observable = callback = null;
    }
    if (e) {
      callback = function setProps(ev) {
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
            observable = callback = null;
            break;
        }
      };
      observable = template(observables);
      observable.onAny(callback);
    }
  };
}

// Input components ------------------------------------------------------------

function tryGet(name, props) {
  var value = props[name];
  if (null != value) return getProp(name, value);
}

var mkBound = function mkBound(Elem, name, checked) {
  return forwardRef(setName(function (props, ref) {
    var getter = tryGet('value', props) || checked && tryGet(checked, props);
    if (getter) props = set('onChange', actions(getter, props.onChange), props);
    return createElement(Elem, ref ? set('ref', ref, props) : props);
  }, name));
};

var Select = /*#__PURE__*/mkBound('select', 'Select');
var Input = /*#__PURE__*/mkBound('input', 'Input', 'checked');
var TextArea = /*#__PURE__*/mkBound('textarea', 'TextArea');

// Refs ------------------------------------------------------------------------

var refTo = function refTo(settable) {
  return function refTo(elem) {
    if (null !== elem) settable.set(elem);
  };
};

// Events ----------------------------------------------------------------------

var actionsCollect = /*#__PURE__*/collect([flatten, /*#__PURE__*/when(isFunction)]);

var actions = /*#__PURE__*/lift(function actions() {
  for (var _len5 = arguments.length, fnsIn = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    fnsIn[_key5] = arguments[_key5];
  }

  var fns = actionsCollect(fnsIn);
  switch (fns.length) {
    case 0:
      return undefined;
    case 1:
      return fns[0];
    default:
      return function actions() {
        for (var i = 0, n = fns.length; i < n; ++i) {
          fns[i].apply(fns, arguments);
        }
      };
  }
});

var invoke = function invoke(name) {
  return setName(function (e) {
    return e[name]();
  }, name);
};

var preventDefault = /*#__PURE__*/invoke('preventDefault');
var stopPropagation = /*#__PURE__*/invoke('stopPropagation');

// classNames ------------------------------------------------------------------

var cnsImmediate = /*#__PURE__*/join(' ', [flatten, /*#__PURE__*/when(id)]);

var cns = /*#__PURE__*/lift(function cns() {
  for (var _len6 = arguments.length, xs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    xs[_key6] = arguments[_key6];
  }

  return cnsImmediate(xs) || undefined;
});

// Observables -----------------------------------------------------------------

function shallowWhereEq(lhs, rhs) {
  for (var k in lhs) {
    if (!identicalU(lhs[k], rhs[k])) return false;
  }return true;
}

var shallowEquals = function shallowEquals(lhs, rhs) {
  return shallowWhereEq(lhs, rhs) && shallowWhereEq(rhs, lhs);
};

function updateObs(prevObs, nextProps, plain) {
  var nextObs = {};
  for (var k in nextProps) {
    var v = nextProps[k];
    if (plain(k)) {
      nextObs[k] = v;
    } else {
      var obs = nextObs[k] = prevObs[k] || new Property().skipDuplicates(identicalU);
      obs._emitValue(v);
    }
  }
  for (var _k2 in prevObs) {
    if (!plain(_k2)) {
      var _v = prevObs[_k2];
      if (_v !== nextObs[_k2]) {
        _v._emitEnd();
      }
    }
  }
  return nextObs;
}

var toReactExcept = /*#__PURE__*/curry(function toReactExcept(plain, Calmm) {
  var Pure = inherit(function Pure(props) {
    PureComponent.call(this, props);
  }, PureComponent, {
    render: function render() {
      return createElement$1(Calmm, this.props);
    }
  });
  return inherit(function ToClass(props) {
    PureComponent.call(this, props);
    this.o = updateObs(object0, props, plain);
  }, PureComponent, {
    componentDidUpdate: function componentDidUpdate() {
      var prev = this.o;
      var next = this.o = updateObs(prev, this.props, plain);
      if (!shallowEquals(prev, next)) {
        this.forceUpdate();
      }
    },
    render: function render() {
      return createElement$1(Pure, this.o);
    },
    componentWillUnmount: function componentWillUnmount() {
      updateObs(this.o, object0, plain);
    }
  });
});

var toReact = /*#__PURE__*/toReactExcept( /*#__PURE__*/always(false));

// Standard ////////////////////////////////////////////////////////////////////

// JSON ------------------------------------------------------------------------

var parse = /*#__PURE__*/lift(JSON.parse);
var stringify = /*#__PURE__*/lift(JSON.stringify);

// URIs ------------------------------------------------------------------------

var du = /*#__PURE__*/lift(decodeURI);
var duc = /*#__PURE__*/lift(decodeURIComponent);
var eu = /*#__PURE__*/lift(encodeURI);
var euc = /*#__PURE__*/lift(encodeURIComponent);

// Math ------------------------------------------------------------------------

var abs = /*#__PURE__*/lift(Math.abs);
var acos = /*#__PURE__*/lift(Math.acos);
var acosh = /*#__PURE__*/lift(Math.acosh);
var asin = /*#__PURE__*/lift(Math.asin);
var asinh = /*#__PURE__*/lift(Math.asinh);
var atan = /*#__PURE__*/lift(Math.atan);
var atan2 = /*#__PURE__*/lift(Math.atan2);
var atanh = /*#__PURE__*/lift(Math.atanh);
var cbrt = /*#__PURE__*/lift(Math.cbrt);
var ceil = /*#__PURE__*/lift(Math.ceil);
var clz32 = /*#__PURE__*/lift(Math.clz32);
var cos = /*#__PURE__*/lift(Math.cos);
var cosh = /*#__PURE__*/lift(Math.cosh);
var exp = /*#__PURE__*/lift(Math.exp);
var expm1 = /*#__PURE__*/lift(Math.expm1);
var floor = /*#__PURE__*/lift(Math.floor);
var fround = /*#__PURE__*/lift(Math.fround);
var hypot = /*#__PURE__*/lift(Math.hypot);
var imul = /*#__PURE__*/lift(Math.imul);
var log = /*#__PURE__*/lift(Math.log);
var log10 = /*#__PURE__*/lift(Math.log10);
var log1p = /*#__PURE__*/lift(Math.log1p);
var log2 = /*#__PURE__*/lift(Math.log2);
var max = /*#__PURE__*/lift(Math.max);
var min = /*#__PURE__*/lift(Math.min);
var pow = /*#__PURE__*/lift(Math.pow);
var round = /*#__PURE__*/lift(Math.round);
var sign = /*#__PURE__*/lift(Math.sign);
var sin = /*#__PURE__*/lift(Math.sin);
var sinh = /*#__PURE__*/lift(Math.sinh);
var sqrt = /*#__PURE__*/lift(Math.sqrt);
var tan = /*#__PURE__*/lift(Math.tan);
var tanh = /*#__PURE__*/lift(Math.tanh);
var trunc = /*#__PURE__*/lift(Math.trunc);

// String ----------------------------------------------------------------------

var string = /*#__PURE__*/lift(String.raw);

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

var set$1 = /*#__PURE__*/curry(function set$$1(settable, xs) {
  var ss = combine$1([xs], function (xs) {
    return settable.set(xs);
  });
  if (isProperty(ss)) return ss.toProperty(toUndefined);
});

// Actions on atoms ------------------------------------------------------------

var doModify = /*#__PURE__*/doN(1, 'modify', 'doModify');
var doSet = /*#__PURE__*/doN(1, 'set', 'doSet');
var doRemove = /*#__PURE__*/doN(0, 'remove', 'doRemove');

// Decomposing -----------------------------------------------------------------

var getMutable = function getMutable(xs, l) {
  return xs.view(l);
};
var getProperty = function getProperty(xs, l) {
  return combine$1([l, xs], get);
};
var getConstant = function getConstant(xs, l) {
  return get(l, xs);
};
var chooseGet = function chooseGet(xs) {
  return isMutable(xs) ? getMutable : isProperty(xs) ? getProperty : getConstant;
};

//

var destructureUnsupported = function destructureUnsupported(name) {
  return function unsupported() {
    throw Error('destructure: `' + name + '` unsupported');
  };
};

var DestructureCommon = {
  deleteProperty: /*#__PURE__*/destructureUnsupported('deleteProperty'),
  has: /*#__PURE__*/destructureUnsupported('has'),
  ownKeys: /*#__PURE__*/destructureUnsupported('ownKeys'),
  set: /*#__PURE__*/destructureUnsupported('set')
};

var DestructureMutable = /*#__PURE__*/assign({}, DestructureCommon, {
  get: getMutable,
  set: function set$$1(target, prop, value) {
    return !target.modify(set(prop, value));
  },
  deleteProperty: function deleteProperty(target, prop) {
    return !target.modify(remove(prop));
  }
});

var DestructureProperty = /*#__PURE__*/assign({}, DestructureCommon, {
  get: getProperty
});

function destructure(x) {
  if (isMutable(x)) {
    return new Proxy(x, DestructureMutable);
  } else if (isProperty(x)) {
    return new Proxy(x, DestructureProperty);
  } else {
    return x;
  }
}

//

var view = /*#__PURE__*/curry(function view(l, xs) {
  if (isMutable(xs)) {
    return isProperty(template(l)) ? new Join(combine$1([l], function (l) {
      return xs.view(l);
    })) : getMutable(xs, l);
  } else {
    return getProperty(xs, l);
  }
});

//

var mapElems = /*#__PURE__*/curry(function mapElems(xi2y, xs) {
  var vs = [];
  var get$$1 = chooseGet(xs);
  return thru(xs, foldPast(function mapElems(ysIn, xsIn) {
    var ysN = ysIn.length;
    var xsN = xsIn.length;
    if (xsN === ysN) return ysIn;
    var m = Math.min(ysN, xsN);
    var ys = ysIn.slice(0, m);
    for (var i = xsN; i < ysN; ++i) {
      vs[i]._onDeactivation();
    }for (var _i = m; _i < xsN; ++_i) {
      ys[_i] = xi2y(vs[_i] = get$$1(xs, _i), _i);
    }vs.length = xsN;
    return ys;
  }, []), skipIdenticals);
});

var mapElemsWithIds = /*#__PURE__*/curry(function mapElemsWithIds(idL, xi2y, xs) {
  var id2info = new Map();
  var idOf = get(idL);
  var pred = function pred(x, _, info) {
    return idOf(x) === info.id;
  };
  var get$$1 = chooseGet(xs);
  return thru(xs, foldPast(function mapElemsWithIds(ysIn, xsIn) {
    var n = xsIn.length;
    var ys = ysIn.length === n ? ysIn : Array(n);
    for (var i = 0; i < n; ++i) {
      var id$$1 = idOf(xsIn[i]);
      var info = id2info.get(id$$1);
      if (void 0 === info) {
        id2info.set(id$$1, info = {});
        info.id = id$$1;
        info.hint = i;
        info.elem = xi2y(info.view = get$$1(xs, find(pred, info)), id$$1);
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

export { debounce, changes, serially, parallel, delay, mapValue, flatMapParallel, flatMapSerial, flatMapErrors, flatMapLatest, foldPast, interval$1 as interval, later$1 as later, never$1 as never, on, sampledBy, skipFirst, skipDuplicates, skipUnless, takeFirst, takeFirstErrors, takeUntilBy, toProperty, throttle, fromEvents$1 as fromEvents, ignoreValues, ignoreErrors, startWith, sink, consume, endWith, lazy, skipIdenticals, skipWhen, template, fromPromise, not, and, or, ifElse, unless, when$1 as when, cond, animationSpan, combines$1 as combines, Bus, bus, doPush, doError, doEnd, seq$1 as seq, seqPartial$1 as seqPartial, scope, tapPartial, toPartial, thru, through, show, onUnmount, Context, withContext, getProps, setProps, Select, Input, TextArea, refTo, actions, preventDefault, stopPropagation, cns, toReactExcept, toReact, parse, stringify, du as decodeURI, duc as decodeURIComponent, eu as encodeURI, euc as encodeURIComponent, abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow, round, sign, sin, sinh, sqrt, tan, tanh, trunc, string, atom, variable, molecule, set$1 as set, doModify, doSet, doRemove, destructure, view, mapElems, mapElemsWithIds };
