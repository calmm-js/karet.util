window.React = window.karet
window.U = window.karet.util
window.log = function() {
  var xs = []
  for (var i = 0; i < arguments.length; ++i) {
    const x = arguments[i]
    if (x instanceof window.Kefir.Observable) xs.push(x)
    else xs.push(window.Kefir.constant(x))
  }
  // This potentially leaks subscriptions, but that usually shouldn't be a
  // problem.
  window.Kefir.combine(xs, console.log).observe()
}
