import prettyFormat, { plugins } from 'pretty-format'

import { isPlainObject } from './utils.js'

// Retrieve unique test names for each loop.
// To customize names, generate them using the iterated function parameters.
export const addNames = function({ index, indexes, params }) {
  const names = params.map(getName)
  const name = names.join(' ')
  return { name, names, index, indexes, params }
}

const getName = function(param) {
  if (hasName(param)) {
    return param.name
  }

  const name = serialize(param)

  const nameA = truncateName(name)
  return nameA
}

// `{ name }` can be used to override the serialization logic
const hasName = function(param) {
  return (
    isPlainObject(param) &&
    typeof param.name === 'string' &&
    param.name.trim() !== ''
  )
}

// We use `pretty-format` because it:
//  - handles most JavaScript types
//  - works in browsers
//  - is fast
//  - has human-friendly output
//  - can minify output
//  - handles circular references
//  - can serialize DOM
const serialize = function(param) {
  return prettyFormat(param, PRETTY_FORMAT_OPTS)
}

const PRETTY_FORMAT_OPTS = {
  min: true,
  maxDepth: 2,
  plugins: [
    plugins.DOMElement,
    plugins.DOMCollection,
    plugins.ReactElement,
    plugins.Immutable,
    plugins.ConvertAnsi,
  ],
}

// Make names short by truncating them
const truncateName = function(name) {
  if (name.length <= MAX_NAME_LENGTH) {
    return name
  }

  const start = name.slice(0, TRUNCATE_START_LENGTH)
  const end = name.slice(name.length - TRUNCATE_END_LENGTH)
  return `${start}...${end}`
}

const MAX_NAME_LENGTH = 120
const TRUNCATE_START_LENGTH = Math.ceil((MAX_NAME_LENGTH - 3) / 2)
const TRUNCATE_END_LENGTH = Math.floor((MAX_NAME_LENGTH - 3) / 2)
