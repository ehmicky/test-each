import prettyFormat, { plugins } from 'pretty-format'

import { isPlainObject } from './utils.js'

// Add `title` to each `param`
// We do it before the cartesian product for performance reasons
// However titles of input functions must be computed afterwards since we use
// their return value, which is performed after the cartesian product
export const addTitles = function(input) {
  if (typeof input === 'function') {
    return input
  }

  return input.map(addTitle)
}

const addTitle = function(value) {
  const title = getTitle(value)
  return { value, title }
}

export const joinTitles = function({
  index,
  indexes,
  values,
  inputFuncs,
  titles,
}) {
  const titlesA = titles.map((paramTitle, valueIndex) =>
    addFuncTitle(paramTitle, values[valueIndex], inputFuncs[valueIndex]),
  )
  const title = titlesA.join(' ')
  return { title, titles: titlesA, index, indexes, values }
}

const addFuncTitle = function(title, value, isInputFunc) {
  if (!isInputFunc) {
    return title
  }

  return getTitle(value)
}

// Retrieve unique titles for each loop.
// Users can customize titles by using the iterated function parameters.
const getTitle = function(value) {
  if (hasTitle(value)) {
    return value.title
  }

  const title = serialize(value)

  const titleA = truncateTitle(title)
  return titleA
}

// `{ title }` can be used to override the serialization logic
const hasTitle = function(value) {
  return (
    isPlainObject(value) &&
    typeof value.title === 'string' &&
    value.title.trim() !== ''
  )
}

// We use `pretty-format` because it:
//  - handles most JavaScript types
//  - works in browsers
//  - is fast
//  - has human-friendly output
//  - can minify output (including maxDepth)
//  - handles circular references
//  - can serialize DOM
const serialize = function(value) {
  return prettyFormat(value, PRETTY_FORMAT_OPTS)
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

// Make titles short by truncating them in the middle
const truncateTitle = function(title) {
  if (title.length <= MAX_TITLE_SIZE) {
    return title
  }

  const start = title.slice(0, TRUNCATE_START_LENGTH)
  const end = title.slice(title.length - TRUNCATE_END_LENGTH)
  return `${start}${ELLIPSIS}${end}`
}

const MAX_TITLE_SIZE = 120
const ELLIPSIS = '...'
const TRUNCATE_START_LENGTH = Math.ceil((MAX_TITLE_SIZE - ELLIPSIS.length) / 2)
const TRUNCATE_END_LENGTH = Math.floor((MAX_TITLE_SIZE - ELLIPSIS.length) / 2)
