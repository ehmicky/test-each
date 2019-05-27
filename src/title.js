import prettyFormat, { plugins } from 'pretty-format'

import { isPlainObject } from './utils.js'

// Retrieve unique test titles for each loop.
// Users can customize titles by using the iterated function parameters.
export const addTitles = function({ index, indexes, params }) {
  const titles = params.map(getTitle)
  const title = titles.join(' ')
  return { title, titles, index, indexes, params }
}

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
