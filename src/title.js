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

const addTitle = function(param) {
  const title = getTitle(param)
  return { param, title }
}

export const joinTitles = function({
  index,
  indexes,
  params,
  funcParams,
  titles,
}) {
  const titlesA = titles.map((paramTitle, paramIndex) =>
    addFuncTitle(paramTitle, params[paramIndex], funcParams[paramIndex]),
  )
  const title = titlesA.join(' ')
  return { title, titles: titlesA, index, indexes, params }
}

const addFuncTitle = function(title, param, isInputFunc) {
  if (!isInputFunc) {
    return title
  }

  return getTitle(param)
}

// Retrieve unique titles for each loop.
// Users can customize titles by using the iterated function parameters.
const getTitle = function(param) {
  if (hasTitle(param)) {
    return param.title
  }

  const title = serialize(param)

  const titleA = truncateTitle(title)
  return titleA
}

// `{ title }` can be used to override the serialization logic
const hasTitle = function(param) {
  return (
    isPlainObject(param) &&
    typeof param.title === 'string' &&
    param.title.trim() !== ''
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
