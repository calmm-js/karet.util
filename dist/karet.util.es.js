import { holding, Atom, Molecule, AbstractMutable, Join } from 'kefir.atom';
export { holding } from 'kefir.atom';
import { constant, concat, merge, Observable, interval, later, never, Stream, fromEvents, Property, combine as combine$1, stream } from 'kefir';
import { defineNameU, curry, pipe2U, identicalU, id, inherit, arityN, Monad, applyU, IdentityOrU, always, isDefined, isFunction, object0, assign, array0 } from 'infestines';
import { get, set, collect, flatten, when, join, remove, find, iso } from 'partial.lenses';
import { lift, combine, liftRec } from 'karet.lift';
export { combine, lift, liftRec } from 'karet.lift';
import { createElement } from 'karet';
export { fromClass as toKaret } from 'karet';
import { forwardRef, PureComponent, createElement as createElement$1 } from 'react';

////////////////////////////////////////////////////////////////////////////////

var setName = process.env.NODE_ENV === 'production' ? function (x) {
  return x;
} : defineNameU;

// Actions /////////////////////////////////////////////////////////////////////

var doN = function doN(n, method, name) {
  return arityN(n + 1, setName(function (target) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    return combine(params, function () {
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

var mapValueU = function mapValue(fn, xs) {
  if (isObservable(xs)) return xs.map(fn);else return fn(xs);
};

var flatMapLatestU = function flatMapLatest(fn, xs) {
  if (isObservable(xs)) return xs.flatMapLatest(pipe2U(fn, toObservable));else return fn(xs);
};

var flatMapParallelU = function flatMapParallel(fn, xs) {
  if (isObservable(xs)) return xs.flatMap(pipe2U(fn, toObservable));else return fn(xs);
};

var flatMapSerialU = function flatMapSerial(fn, xs) {
  if (isObservable(xs)) return xs.flatMapConcat(pipe2U(fn, toObservable));else return fn(xs);
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
var parallel = function parallel(xs) {
  return merge(xs.map(toObservable));
};
var delay = /*#__PURE__*/curry(function delay(ms, xs) {
  if (isObservable(xs)) return xs.delay(ms);else return xs;
});
var mapValue = /*#__PURE__*/curry(mapValueU);
var flatMapParallel = /*#__PURE__*/curry(flatMapParallelU);
var flatMapSerial = /*#__PURE__*/curry(flatMapSerialU);
var flatMapErrors = /*#__PURE__*/curry(function flatMapErrors(fn, xs) {
  return toObservable(xs).flatMapErrors(pipe2U(fn, toObservable));
});
var flatMapLatest = /*#__PURE__*/curry(flatMapLatestU);
var foldPast = /*#__PURE__*/curry(function foldPast(fn, s, xs) {
  if (isObservable(xs)) return xs.scan(fn, s);else return fn(s, xs);
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
  if (isObservable(xs)) return xs.skipDuplicates(equals);else return xs;
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
var toObservable = function toObservable(x) {
  return isObservable(x) ? x : constant(x);
};
var toProperty = function toProperty(xs) {
  return isStream(xs) ? xs.toProperty() : xs;
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
  return toProperty(flatMapLatestU(th, toObservable()));
};
var skipIdenticals = /*#__PURE__*/skipDuplicates(identicalU);
var skipWhen = /*#__PURE__*/curry(function skipWhen(p, xs) {
  return toObservable(xs).filter(function (x) {
    return !p(x);
  });
});
var template = function template(observables) {
  return combine([observables], id);
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
  return toProperty(flatMapLatestU(function (l) {
    return l && r;
  }, l));
}), 'andAlso');

var or = /*#__PURE__*/setName( /*#__PURE__*/mkBop(false, function or(l, r) {
  return toProperty(flatMapLatestU(function (l) {
    return l || r;
  }, l));
}), 'orElse');

var ifteU = function ifElse(b, t, e) {
  return toProperty(flatMapLatestU(function (b) {
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

// Algebras --------------------------------------------------------------------

var Latest = /*#__PURE__*/Monad(function (f, x) {
  return x.map(f).skipDuplicates(identicalU);
}, constant, function (f, x) {
  return combine$1([f, x], applyU).toProperty().skipDuplicates(identicalU);
}, function (f, x) {
  return x.flatMapLatest(f).toProperty().skipDuplicates(identicalU);
});

var IdentityLatest = /*#__PURE__*/IdentityOrU(isProperty, Latest);

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

// Serializer ------------------------------------------------------------------

function serializer(initial) {
  var atFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : array0;

  var actions = bus();
  var property = thru(serially(atFirst.concat(actions)), flatMapSerial(scope), startWith(initial));
  property.push = function (action) {
    return actions.push(action);
  };
  property.error = function (value) {
    return actions.error(value);
  };
  property.end = function () {
    return actions.end();
  };
  return property;
}

// Actions on buses ------------------------------------------------------------

var doPush = /*#__PURE__*/doN(1, 'push', 'doPush');
var doError = /*#__PURE__*/doN(1, 'error', 'doError');
var doEnd = /*#__PURE__*/doN(0, 'end', 'doEnd');

// Convenience /////////////////////////////////////////////////////////////////

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
  return toProperty(flatMapLatestU(function thru(fs) {
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
  }var iso$$1 = combine(xs, showIso);
  var s = arguments[n];
  return isStream(s) ? isProperty(iso$$1) ? combine$1([iso$$1, s], get) : mapValue(get(iso$$1), s) : view(iso$$1, s);
}

// React ///////////////////////////////////////////////////////////////////////

var onUnmount = function onUnmount(effect) {
  return stream(always(effect)).toProperty(always(undefined));
};

// DOM Binding -----------------------------------------------------------------

var getProp = function getProp(name, object) {
  return function getProp(_ref2) {
    var target = _ref2.target;

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
      holding(function getProps() {
        for (var _k in template) {
          getProp(_k, template[_k])(e);
        }
      });
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
      return function actions(e) {
        holding(function () {
          for (var i = 0, n = fns.length; i < n; ++i) {
            fns[i](e);
          }
        });
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

// Interop ---------------------------------------------------------------------

var pure = function pure(Component) {
  return inherit(function Pure(props) {
    PureComponent.call(this, props);
  }, PureComponent, {
    render: function render() {
      return createElement$1(Component, this.props);
    }
  });
};

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
  var Pure = pure(Calmm);
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
  var ss = combine([xs], function (xs) {
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
  return combine([l, xs], get);
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
    return isProperty(template(l)) ? new Join(combine([l], function (l) {
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
    var xsN = xsIn ? xsIn.length : 0;
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
    var n = xsIn ? xsIn.length : 0;
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

export { debounce, changes, serially, parallel, delay, mapValue, flatMapParallel, flatMapSerial, flatMapErrors, flatMapLatest, foldPast, interval$1 as interval, later$1 as later, never$1 as never, on, sampledBy, skipFirst, skipDuplicates, skipUnless, takeFirst, takeFirstErrors, takeUntilBy, toObservable, toProperty, throttle, fromEvents$1 as fromEvents, ignoreValues, ignoreErrors, startWith, sink, consume, endWith, lazy, skipIdenticals, skipWhen, template, fromPromise, not, and, or, ifElse, unless, when$1 as when, cond, Latest, IdentityLatest, animationSpan, Bus, bus, serializer, doPush, doError, doEnd, scope, tapPartial, toPartial, thru, through, show, onUnmount, getProps, setProps, Select, Input, TextArea, refTo, actions, preventDefault, stopPropagation, cns, pure, toReactExcept, toReact, parse, stringify, du as decodeURI, duc as decodeURIComponent, eu as encodeURI, euc as encodeURIComponent, abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow, round, sign, sin, sinh, sqrt, tan, tanh, trunc, string, atom, variable, molecule, set$1 as set, doModify, doSet, doRemove, destructure, view, mapElems, mapElemsWithIds };
