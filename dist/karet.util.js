(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('kefir.atom'), require('kefir'), require('infestines'), require('partial.lenses'), require('karet.lift'), require('karet'), require('react'), require('kefir.combines')) :
  typeof define === 'function' && define.amd ? define(['exports', 'kefir.atom', 'kefir', 'infestines', 'partial.lenses', 'karet.lift', 'karet', 'react', 'kefir.combines'], factory) :
  (factory((global.karet = global.karet || {}, global.karet.util = {}),global.kefir.atom,global.Kefir,global.I,global.L,global.karet.lift,global.karet,global.React,global.kefir.combines));
}(this, (function (exports,A,K,I,L,F,Karet,React,kefir_combines) { 'use strict';

  var header = 'karet.util: ';

  function warn(f, m) {
    if (!f.warned) {
      f.warned = 1;
      console.warn(header + m);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////

  var setName = function (to, name) {
    return I.defineNameU(to, name);
  };

  // Actions /////////////////////////////////////////////////////////////////////

  var doN = function doN(n, method, name) {
    return I.arityN(n + 1, setName(function (target) {
      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      return F.combine(params, function () {
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
    return x instanceof A.AbstractMutable;
  };
  var isObservable = function isObservable(x) {
    return x instanceof K.Observable;
  };
  var isProperty = function isProperty(x) {
    return x instanceof K.Property;
  };
  var isStream = function isStream(x) {
    return x instanceof K.Stream;
  };

  var toUndefined = function toUndefined(_) {};
  var toObservable = function toObservable(x) {
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

  var debounce = /*#__PURE__*/I.curry(function debounce(ms, xs) {
    return toObservable(xs).debounce(ms);
  });
  var changes = function changes(xs) {
    return toObservable(xs).changes();
  };
  var serially = function serially(xs) {
    return K.concat(xs.map(toObservable));
  };
  var parallel = K.merge;
  var delay = /*#__PURE__*/I.curry(function delay(ms, xs) {
    return toObservable(xs).delay(ms);
  });
  var mapValue = /*#__PURE__*/I.curry(function mapValue(fn, xs) {
    return toObservable(xs).map(fn);
  });
  var flatMapParallel = /*#__PURE__*/I.curry(function flatMapParallel(fn, xs) {
    return toObservable(xs).flatMap(I.pipe2U(fn, toObservable));
  });
  var flatMapSerial = /*#__PURE__*/I.curry(function flatMapSerial(fn, xs) {
    return toObservable(xs).flatMapConcat(I.pipe2U(fn, toObservable));
  });
  var flatMapErrors = /*#__PURE__*/I.curry(function flatMapErrors(fn, xs) {
    return toObservable(xs).flatMapErrors(I.pipe2U(fn, toObservable));
  });
  var flatMapLatest = /*#__PURE__*/I.curry(function flatMapLatest(fn, xs) {
    return toObservable(xs).flatMapLatest(I.pipe2U(fn, toObservable));
  });
  var foldPast = /*#__PURE__*/I.curry(function foldPast(fn, s, xs) {
    return toObservable(xs).scan(fn, s);
  });
  var interval = /*#__PURE__*/I.curry(K.interval);
  var later = /*#__PURE__*/I.curry(K.later);
  var never = /*#__PURE__*/K.never();
  var on = /*#__PURE__*/I.curry(function on(efs, xs) {
    return toObservable(xs).onAny(toHandler(efs));
  });
  var sampledBy = /*#__PURE__*/I.curry(function sampledBy(es, xs) {
    return toObservable(xs).sampledBy(es);
  });
  var skipFirst = /*#__PURE__*/I.curry(function skipFirst(n, xs) {
    return toObservable(xs).skip(n);
  });
  var skipDuplicates = /*#__PURE__*/I.curry(function skipDuplicates(equals, xs) {
    return toObservable(xs).skipDuplicates(equals);
  });
  var skipUnless = /*#__PURE__*/I.curry(function skipUnless(p, xs) {
    return toObservable(xs).filter(p);
  });
  var takeFirst = /*#__PURE__*/I.curry(function takeFirst(n, xs) {
    return toObservable(xs).take(n);
  });
  var takeFirstErrors = /*#__PURE__*/I.curry(function takeFirstErrors(n, xs) {
    return toObservable(xs).takeErrors(n);
  });
  var takeUntilBy = /*#__PURE__*/I.curry(function takeUntilBy(ts, xs) {
    return toObservable(xs).takeUntilBy(ts);
  });
  var toProperty = function toProperty(xs) {
    return isProperty(xs) ? xs : isStream(xs) ? xs.toProperty() : K.constant(xs);
  };
  var throttle = /*#__PURE__*/I.curry(function throttle(ms, xs) {
    return toObservable(xs).throttle(ms);
  });
  var fromEvents = /*#__PURE__*/I.curry(K.fromEvents);
  var ignoreValues = function ignoreValues(s) {
    return s.ignoreValues();
  };
  var ignoreErrors = function ignoreErrors(s) {
    return s.ignoreErrors();
  };

  // Additional ------------------------------------------------------------------

  var startWith = /*#__PURE__*/I.curry(function startWith(x, xs) {
    return toObservable(xs).toProperty(function () {
      return x;
    });
  });
  var sink = /*#__PURE__*/I.pipe2U( /*#__PURE__*/startWith(undefined), /*#__PURE__*/F.lift(toUndefined));

  var consume = /*#__PURE__*/I.pipe2U(mapValue, sink);
  var endWith = /*#__PURE__*/I.curry(function endWith(v, xs) {
    return toObservable(xs).concat(toObservable(v));
  });
  var lazy = function lazy(th) {
    return toProperty(flatMapLatest(th, toProperty()));
  };
  var skipIdenticals = /*#__PURE__*/skipDuplicates(I.identicalU);
  var skipWhen = /*#__PURE__*/I.curry(function skipWhen(p, xs) {
    return toObservable(xs).filter(function (x) {
      return !p(x);
    });
  });
  var template = function template(observables) {
    return F.combine([observables], I.id);
  };

  var FromPromise = /*#__PURE__*/I.inherit(function FromPromise(makePromise) {
    K.Property.call(this);
    this.m = makePromise;
    this.a = undefined;
  }, K.Property, {
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

  var ifteU = function ifElse(b, t, e) {
    return toProperty(flatMapLatest(function (b) {
      return b ? t : e;
    }, b));
  };

  var ifElse = /*#__PURE__*/I.curry(ifteU);
  var unless = /*#__PURE__*/I.curry(function unless(b, e) {
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

  // Animation -------------------------------------------------------------------

  var Ticks = /*#__PURE__*/I.inherit(function Ticks(duration) {
    var self = this;
    K.Property.call(self);
    self.d = duration;
    self.s = self.i = 0;
  }, K.Property, {
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

  var animationSpan = function animationSpan(d) {
    return typeof window === 'undefined' ? never : new Ticks(d);
  };

  var combines = function combines() {
    warn(combines, '`combines` has been obsoleted.  Please use `combine`, `template`, `lift`, or `liftRec` instead.');
    return kefir_combines.combines.apply(null, arguments);
  };

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

  // Actions on buses ------------------------------------------------------------

  var doPush = /*#__PURE__*/doN(1, 'push', 'doPush');
  var doError = /*#__PURE__*/doN(1, 'error', 'doError');
  var doEnd = /*#__PURE__*/doN(0, 'end', 'doEnd');

  // Convenience /////////////////////////////////////////////////////////////////

  var seq = function seq(_) {
    warn(seq, '`seq` has been obsoleted.  Use `thru` instead.');
    return I.seq.apply(null, arguments);
  };

  var seqPartial = function seqPartial(_) {
    warn(seqPartial, '`seqPartial` has been deprecated.  There is no replacement for it.');
    return I.seqPartial.apply(null, arguments);
  };

  var scope = function scope(fn) {
    return fn();
  };

  var tapPartial = /*#__PURE__*/F.lift( /*#__PURE__*/I.curry(function tapPartial(effect, data) {
    if (undefined !== data) effect(data);
    return data;
  }));

  var toPartial = function toPartial(fn) {
    return F.liftRec(I.arityN(fn.length, function toPartial() {
      for (var _len3 = arguments.length, xs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        xs[_key3] = arguments[_key3];
      }

      return xs.every(I.isDefined) ? fn.apply(undefined, xs) : undefined;
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

    return L.iso(function (x) {
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
    }var iso = F.combine(xs, showIso);
    var s = arguments[n];
    return isStream(s) ? isProperty(iso) ? K.combine([iso, s], L.get) : mapValue(L.get(iso), s) : view(iso, s);
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
    return function Context(props) {
      warn(Context, '`Context` has been obsoleted.  Just use the new React context API.');
      return fn(props);
    };
  })(function Context(_ref2) {
    var context = _ref2.context,
        children = _ref2.children;

    return React.createElement(
      Provider,
      { value: context },
      children
    );
  });

  var withContext = /*#__PURE__*/(function (fn) {
    return function withContext(props) {
      warn(withContext, '`withContext` has been obsoleted.  Just use the new React context API.');
      return fn(props);
    };
  })(function withContext(toElem) {
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

  var getProp = function getProp(name, object) {
    return function getProp(_ref3) {
      var target = _ref3.target;

      var value = target[name];
      if (I.isFunction(object.push)) {
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
    return React.forwardRef(setName(function (props, ref) {
      var getter = tryGet('value', props) || checked && tryGet(checked, props);
      if (getter) props = L.set('onChange', actions(getter, props.onChange), props);
      return Karet.createElement(Elem, ref ? L.set('ref', ref, props) : props);
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

  var actionsCollect = /*#__PURE__*/L.collect([L.flatten, /*#__PURE__*/L.when(I.isFunction)]);

  var actions = /*#__PURE__*/F.lift(function actions() {
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

  var cnsImmediate = /*#__PURE__*/L.join(' ', [L.flatten, /*#__PURE__*/L.when(I.id)]);

  var cns = /*#__PURE__*/F.lift(function cns() {
    for (var _len6 = arguments.length, xs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      xs[_key6] = arguments[_key6];
    }

    return cnsImmediate(xs) || undefined;
  });

  // Observables -----------------------------------------------------------------

  function shallowWhereEq(lhs, rhs) {
    for (var k in lhs) {
      if (!I.identicalU(lhs[k], rhs[k])) return false;
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
        var obs = nextObs[k] = prevObs[k] || new K.Property().skipDuplicates(I.identicalU);
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

  var toReactExcept = /*#__PURE__*/I.curry(function toReactExcept(plain, Calmm) {
    var Pure = I.inherit(function Pure(props) {
      React.PureComponent.call(this, props);
    }, React.PureComponent, {
      render: function render() {
        return React.createElement(Calmm, this.props);
      }
    });
    return I.inherit(function ToClass(props) {
      React.PureComponent.call(this, props);
      this.o = updateObs(I.object0, props, plain);
    }, React.PureComponent, {
      componentDidUpdate: function componentDidUpdate() {
        var prev = this.o;
        var next = this.o = updateObs(prev, this.props, plain);
        if (!shallowEquals(prev, next)) {
          this.forceUpdate();
        }
      },
      render: function render() {
        return React.createElement(Pure, this.o);
      },
      componentWillUnmount: function componentWillUnmount() {
        updateObs(this.o, I.object0, plain);
      }
    });
  });

  var toReact = /*#__PURE__*/toReactExcept( /*#__PURE__*/I.always(false));

  // Standard ////////////////////////////////////////////////////////////////////

  // JSON ------------------------------------------------------------------------

  var parse = /*#__PURE__*/F.lift(JSON.parse);
  var stringify = /*#__PURE__*/F.lift(JSON.stringify);

  // URIs ------------------------------------------------------------------------

  var du = /*#__PURE__*/F.lift(decodeURI);
  var duc = /*#__PURE__*/F.lift(decodeURIComponent);
  var eu = /*#__PURE__*/F.lift(encodeURI);
  var euc = /*#__PURE__*/F.lift(encodeURIComponent);

  // Math ------------------------------------------------------------------------

  var abs = /*#__PURE__*/F.lift(Math.abs);
  var acos = /*#__PURE__*/F.lift(Math.acos);
  var acosh = /*#__PURE__*/F.lift(Math.acosh);
  var asin = /*#__PURE__*/F.lift(Math.asin);
  var asinh = /*#__PURE__*/F.lift(Math.asinh);
  var atan = /*#__PURE__*/F.lift(Math.atan);
  var atan2 = /*#__PURE__*/F.lift(Math.atan2);
  var atanh = /*#__PURE__*/F.lift(Math.atanh);
  var cbrt = /*#__PURE__*/F.lift(Math.cbrt);
  var ceil = /*#__PURE__*/F.lift(Math.ceil);
  var clz32 = /*#__PURE__*/F.lift(Math.clz32);
  var cos = /*#__PURE__*/F.lift(Math.cos);
  var cosh = /*#__PURE__*/F.lift(Math.cosh);
  var exp = /*#__PURE__*/F.lift(Math.exp);
  var expm1 = /*#__PURE__*/F.lift(Math.expm1);
  var floor = /*#__PURE__*/F.lift(Math.floor);
  var fround = /*#__PURE__*/F.lift(Math.fround);
  var hypot = /*#__PURE__*/F.lift(Math.hypot);
  var imul = /*#__PURE__*/F.lift(Math.imul);
  var log = /*#__PURE__*/F.lift(Math.log);
  var log10 = /*#__PURE__*/F.lift(Math.log10);
  var log1p = /*#__PURE__*/F.lift(Math.log1p);
  var log2 = /*#__PURE__*/F.lift(Math.log2);
  var max = /*#__PURE__*/F.lift(Math.max);
  var min = /*#__PURE__*/F.lift(Math.min);
  var pow = /*#__PURE__*/F.lift(Math.pow);
  var round = /*#__PURE__*/F.lift(Math.round);
  var sign = /*#__PURE__*/F.lift(Math.sign);
  var sin = /*#__PURE__*/F.lift(Math.sin);
  var sinh = /*#__PURE__*/F.lift(Math.sinh);
  var sqrt = /*#__PURE__*/F.lift(Math.sqrt);
  var tan = /*#__PURE__*/F.lift(Math.tan);
  var tanh = /*#__PURE__*/F.lift(Math.tanh);
  var trunc = /*#__PURE__*/F.lift(Math.trunc);

  // String ----------------------------------------------------------------------

  var string = /*#__PURE__*/F.lift(String.raw);

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

  var set = /*#__PURE__*/I.curry(function set(settable, xs) {
    var ss = F.combine([xs], function (xs) {
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
    return F.combine([l, xs], L.get);
  };
  var getConstant = function getConstant(xs, l) {
    return L.get(l, xs);
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

  var DestructureMutable = /*#__PURE__*/I.assign({}, DestructureCommon, {
    get: getMutable,
    set: function set(target, prop, value) {
      return !target.modify(L.set(prop, value));
    },
    deleteProperty: function deleteProperty(target, prop) {
      return !target.modify(L.remove(prop));
    }
  });

  var DestructureProperty = /*#__PURE__*/I.assign({}, DestructureCommon, {
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

  var view = /*#__PURE__*/I.curry(function view(l, xs) {
    if (isMutable(xs)) {
      return isProperty(template(l)) ? new A.Join(F.combine([l], function (l) {
        return xs.view(l);
      })) : getMutable(xs, l);
    } else {
      return getProperty(xs, l);
    }
  });

  //

  var mapElems = /*#__PURE__*/I.curry(function mapElems(xi2y, xs) {
    var vs = [];
    var get = chooseGet(xs);
    return thru(xs, foldPast(function mapElems(ysIn, xsIn) {
      var ysN = ysIn.length;
      var xsN = xsIn.length;
      if (xsN === ysN) return ysIn;
      var m = Math.min(ysN, xsN);
      var ys = ysIn.slice(0, m);
      for (var i = xsN; i < ysN; ++i) {
        vs[i]._onDeactivation();
      }for (var _i = m; _i < xsN; ++_i) {
        ys[_i] = xi2y(vs[_i] = get(xs, _i), _i);
      }vs.length = xsN;
      return ys;
    }, []), skipIdenticals);
  });

  var mapElemsWithIds = /*#__PURE__*/I.curry(function mapElemsWithIds(idL, xi2y, xs) {
    var id2info = new Map();
    var idOf = L.get(idL);
    var pred = function pred(x, _, info) {
      return idOf(x) === info.id;
    };
    var get = chooseGet(xs);
    return thru(xs, foldPast(function mapElemsWithIds(ysIn, xsIn) {
      var n = xsIn.length;
      var ys = ysIn.length === n ? ysIn : Array(n);
      for (var i = 0; i < n; ++i) {
        var id = idOf(xsIn[i]);
        var info = id2info.get(id);
        if (void 0 === info) {
          id2info.set(id, info = {});
          info.id = id;
          info.hint = i;
          info.elem = xi2y(info.view = get(xs, L.find(pred, info)), id);
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
  exports.combine = F.combine;
  exports.lift = F.lift;
  exports.liftRec = F.liftRec;
  exports.toKaret = Karet.fromClass;
  exports.debounce = debounce;
  exports.changes = changes;
  exports.serially = serially;
  exports.parallel = parallel;
  exports.delay = delay;
  exports.mapValue = mapValue;
  exports.flatMapParallel = flatMapParallel;
  exports.flatMapSerial = flatMapSerial;
  exports.flatMapErrors = flatMapErrors;
  exports.flatMapLatest = flatMapLatest;
  exports.foldPast = foldPast;
  exports.interval = interval;
  exports.later = later;
  exports.never = never;
  exports.on = on;
  exports.sampledBy = sampledBy;
  exports.skipFirst = skipFirst;
  exports.skipDuplicates = skipDuplicates;
  exports.skipUnless = skipUnless;
  exports.takeFirst = takeFirst;
  exports.takeFirstErrors = takeFirstErrors;
  exports.takeUntilBy = takeUntilBy;
  exports.toProperty = toProperty;
  exports.throttle = throttle;
  exports.fromEvents = fromEvents;
  exports.ignoreValues = ignoreValues;
  exports.ignoreErrors = ignoreErrors;
  exports.startWith = startWith;
  exports.sink = sink;
  exports.consume = consume;
  exports.endWith = endWith;
  exports.lazy = lazy;
  exports.skipIdenticals = skipIdenticals;
  exports.skipWhen = skipWhen;
  exports.template = template;
  exports.fromPromise = fromPromise;
  exports.ifElse = ifElse;
  exports.unless = unless;
  exports.when = when;
  exports.cond = cond;
  exports.animationSpan = animationSpan;
  exports.combines = combines;
  exports.Bus = Bus;
  exports.bus = bus;
  exports.doPush = doPush;
  exports.doError = doError;
  exports.doEnd = doEnd;
  exports.seq = seq;
  exports.seqPartial = seqPartial;
  exports.scope = scope;
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
  exports.Select = Select;
  exports.Input = Input;
  exports.TextArea = TextArea;
  exports.refTo = refTo;
  exports.actions = actions;
  exports.preventDefault = preventDefault;
  exports.stopPropagation = stopPropagation;
  exports.cns = cns;
  exports.toReactExcept = toReactExcept;
  exports.toReact = toReact;
  exports.parse = parse;
  exports.stringify = stringify;
  exports.decodeURI = du;
  exports.decodeURIComponent = duc;
  exports.encodeURI = eu;
  exports.encodeURIComponent = euc;
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
  exports.doModify = doModify;
  exports.doSet = doSet;
  exports.doRemove = doRemove;
  exports.destructure = destructure;
  exports.view = view;
  exports.mapElems = mapElems;
  exports.mapElemsWithIds = mapElemsWithIds;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
