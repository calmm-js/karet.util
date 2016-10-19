import * as Kefir from "kefir"
import * as R     from "ramda"
import K          from "kefir.combines"
import React      from "karet"

export default K

//

export const setProps = template => {
  let observable = null
  let callback = null
  return e => {
    if (callback) {
      observable.offAny(callback)
      observable = null
      callback = null
    }
    if (e) {
      callback = ev => {
        switch (ev.type) {
          case "value": {
            const template = ev.value
            for (const k in template)
              e[k] = template[k]
            break
          }
          case "error":
            throw ev.value
          case "end":
            observable = null
            callback = null
            break
        }
      }
      observable = K(template, R.identity)
      observable.onAny(callback)
    }
  }
}

export const getProps = template => ({target}) => {
  for (const k in template)
    template[k].set(target[k])
}

export const bindProps = ({ref, ...template}) =>
  ({ref: setProps(template), [ref]: getProps(template)})

export const bind = template =>
  ({...template, onChange: getProps(template)})

//

function classesImmediate() {
  let result = ""
  for (let i=0, n=arguments.length; i<n; ++i) {
    const a = arguments[i]
    if (a) {
      if (result)
        result += " "
      result += a
    }
  }
  return result
}

export const classes = (...cs) =>
  ({className: K(...cs, classesImmediate)})

//

export const fromIds = (ids, fromId) => ids.scan(([oldIds], ids) => {
  const newIds = {}
  const newVs = Array(ids.length)
  for (let i=0, n=ids.length; i<n; ++i) {
    const id = ids[i]
    const k = id.toString()
    if (k in newIds)
      newVs[i] = newIds[k]
    else
      newIds[k] = newVs[i] = k in oldIds ? oldIds[k] : fromId(id)
  }
  return [newIds, newVs]
}, [{}, []]).map(s => s[1])

//

const toNull = () => null

export const sink = stream => K(Kefir.constant(null).concat(stream), toNull)

//

const types = {context: React.PropTypes.any}

export class Context extends React.Component {
  constructor(props) {
    super(props)
  }
  getChildContext() {
    return {context: this.props.context}
  }
  render() {
    return this.props.children
  }
}

Context.childContextTypes = types

export const withContext = originalFn => {
  const fn = (props, {context}) => originalFn(props, context)
  fn.contextTypes = types
  return fn
}

//

export const string = (strings, ...values) =>
  K(...values, (...values) => String.raw(strings, ...values))
